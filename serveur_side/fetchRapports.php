<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['candidature_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "candidature_id manquant"
    ]);
    exit;
}

$candidature_id = $data['candidature_id'];

$sql = "SELECT * FROM Evaluations WHERE candidature_id = :candidature_id";
$stmt = $db->prepare($sql);
$stmt->bindParam(":candidature_id", $candidature_id);
$stmt->execute();

$rapport = $stmt->fetch(PDO::FETCH_ASSOC);

if ($rapport) {
    echo json_encode([
        "success" => true,
        "rapport" => $rapport
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Aucun rapport trouvé"
    ]);
}

?>