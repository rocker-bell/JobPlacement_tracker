<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $data = json_decode(file_get_contents("php://input"), true);
    $candidature_id = $data['candidature_id'] ?? null;

    if (!$candidature_id) {
        echo json_encode(['success' => false, 'message' => 'Candidature ID missing']);
        exit;
    }

    // Start transaction for safety
    $db->beginTransaction();

    // 1️⃣ Fetch the candidature
    $stmt = $db->prepare("SELECT * FROM candidatures WHERE candidature_id = :candidature_id");
    $stmt->bindParam(":candidature_id", $candidature_id);
    $stmt->execute();
    $candidature = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$candidature) {
        echo json_encode(['success' => false, 'message' => 'Candidature not found']);
        exit;
    }

    // 2️⃣ Move to hold table
    $holdStmt = $db->prepare("
        INSERT INTO cancelled_candidature_hold 
        (candidature_id, stagiaire_id, offre_id, statut, message_motivation, cv_path, created_at, deleted_at) 
        VALUES 
        (:candidature_id, :stagiaire_id, :offre_id, :statut, :message_motivation, :cv_path, :created_at, NOW())
    ");
    $holdStmt->bindParam(':candidature_id', $candidature['candidature_id']);
    $holdStmt->bindParam(':stagiaire_id', $candidature['stagiaire_id']);
    $holdStmt->bindParam(':offre_id', $candidature['offre_id']);
    $holdStmt->bindParam(':statut', $candidature['statut']);
    $holdStmt->bindParam(':message_motivation', $candidature['message_motivation']);
    $holdStmt->bindParam(':cv_path', $candidature['cv_path']);
    $holdStmt->bindParam(':created_at', $candidature['created_at']);
    $holdStmt->execute();

    // 3️⃣ Delete from main table
    $deleteStmt = $db->prepare("DELETE FROM candidatures WHERE candidature_id = :candidature_id");
    $deleteStmt->bindParam(":candidature_id", $candidature_id);
    $deleteStmt->execute();

    // Commit transaction
    $db->commit();

    echo json_encode(['success' => true, 'message' => 'Candidature cancelled and moved to hold table successfully']);

} catch (PDOException $e) {
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
?>
