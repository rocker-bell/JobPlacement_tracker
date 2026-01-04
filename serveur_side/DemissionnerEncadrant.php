<?php
require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$encadrant_id = $data['encadrant_id'] ?? null;
$stage_id     = $data['stage_id'] ?? null;

if (!$encadrant_id || !$stage_id) {
    echo json_encode(['success' => false, 'message' => 'encadrant_id and stage_id are required']);
    exit;
}

try {
    // Check if this affectation exists
    $stmtCheck = $db->prepare("SELECT * FROM Affectation WHERE encadrant_id = :encadrant_id AND offre_id = :offre_id");
    $stmtCheck->execute([
        ':encadrant_id' => $encadrant_id,
        ':offre_id' => $stage_id
    ]);

    $affectation = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if (!$affectation) {
        echo json_encode(['success' => false, 'message' => 'Encadrant not assigned to this stage']);
        exit;
    }

    // Delete the affectation
    $stmtDel = $db->prepare("DELETE FROM Affectation WHERE encadrant_id = :encadrant_id AND offre_id = :offre_id");
    $stmtDel->execute([
        ':encadrant_id' => $encadrant_id,
        ':offre_id' => $stage_id
    ]);

    echo json_encode(['success' => true, 'message' => 'Encadrant retiré du stage avec succès']);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
