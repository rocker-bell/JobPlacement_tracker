<?php
require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);

// Validate required fields
$candidature_id = $data['candidature_id'] ?? null;

if (!$candidature_id) {
    echo json_encode(['success' => false, 'message' => 'candidature_id is required']);
    exit;
}

// Optional fields
$stagiaire_id = $data['stagiaire_id'] ?? null;
$offre_id = $data['offre_id'] ?? null;
$statut = $data['statut'] ?? null;
$message_motivation = $data['message_motivation'] ?? null;
$cv_path = $data['cv_path'] ?? null;

try {
    $stmt = $db->prepare("UPDATE Candidatures SET 
        stagiaire_id = :stagiaire_id,
        offre_id = :offre_id,
        statut = :statut,
        message_motivation = :message_motivation,
        cv_path = :cv_path,
        updated_at = NOW()
        WHERE candidature_id = :candidature_id
    ");

    $stmt->execute([
        ':stagiaire_id' => $stagiaire_id,
        ':offre_id' => $offre_id,
        ':statut' => $statut,
        ':message_motivation' => $message_motivation,
        ':cv_path' => $cv_path,
        ':candidature_id' => $candidature_id
    ]);

    echo json_encode(['success' => true, 'message' => 'Candidature mise à jour avec succès']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
