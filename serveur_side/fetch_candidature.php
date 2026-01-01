<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// $input = json_decode(file_get_contents("php://input"), true);
$user_id = $input['user_id'] ?? null;
$offre_id = $input['offre_id'] ?? null;

if (!$user_id || !$offre_id) {
    echo json_encode(['success' => false, 'message' => 'user_id and offre_id required']);
    exit;
}

try {
    $stmt = $db->prepare("
        SELECT * FROM Candidatures
        WHERE stagiaire_id = :user_id AND offre_id = :offre_id
    ");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->bindParam(':offre_id', $offre_id);
    $stmt->execute();
    $candidature = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($candidature) {
        echo json_encode(['success' => true, 'candidature' => $candidature]);
    } else {
        echo json_encode(['success' => true, 'candidature' => null]);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
