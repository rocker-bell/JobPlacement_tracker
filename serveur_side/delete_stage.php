<?php
require("./Database_init/db_connection.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Read JSON body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['stage_id']) || !isset($data['entreprise_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing parameters"
    ]);
    exit;
}

$stage_id = $data['stage_id'];
$entrepriseId = $data['entreprise_id'];

try {
    $stmt = $db->prepare("DELETE FROM Offres_Stage WHERE offre_id = :stage_id AND entreprise_id = :entrepriseId");
    $stmt->bindParam(":stage_id", $stage_id, PDO::PARAM_STR);
    $stmt->bindParam(":entrepriseId", $entrepriseId, PDO::PARAM_STR);

    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode([
            "success" => true,
            "message" => "Stage deleted successfully"
        ]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "No stage found or already deleted"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
