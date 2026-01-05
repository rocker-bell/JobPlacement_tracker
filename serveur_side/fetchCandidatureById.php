<?php
require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$candidature_id = $data['candidature_id'] ?? null;

if (!$candidature_id) {
    echo json_encode(['success' => false, 'message' => 'candidature_id is required']);
    exit;
}

try {
    $stmt = $db->prepare("SELECT * FROM Candidatures WHERE candidature_id = :candidature_id");
    $stmt->execute([':candidature_id' => $candidature_id]);
    $candidature = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($candidature) {
        echo json_encode(['success' => true, 'candidature' => $candidature]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Candidature not found']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
