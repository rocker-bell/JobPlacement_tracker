<?php
require("./Database_init/db_connection.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $stage_id = $_POST["stage_id"] ?? null;
        $entrepriseId = $_POST["entreprise_id"] ?? null;

        if (!$stage_id || !$entrepriseId) {
            echo json_encode([
                "success" => false,
                "message" => "Missing parameters"
            ]);
            exit;
        }

        $stmt = $db->prepare("DELETE FROM Offres_Stage WHERE offre_id = :stage_id AND entreprise_id = :entrepriseId");

        $stmt->bindParam(":stage_id", $stage_id);
        $stmt->bindParam(":entrepriseId", $entrepriseId);

        $res = $stmt->execute();

        if (!$res) {
            echo json_encode([
                "success" => false,
                "message" => "Failed to delete stage"
            ]);
        } else {
            echo json_encode([
                "success" => true,
                "message" => "Stage deleted successfully"
            ]);
        }
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Invalid request method"
        ]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => $e->getMessage()
    ]);
}
?>
