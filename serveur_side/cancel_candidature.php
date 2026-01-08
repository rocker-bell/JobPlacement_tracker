<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');


ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);
$candidature_id = $data['candidature_id'];

if (!$candidature_id) {
    echo json_encode(['success' => false, 'message' => 'Candidature ID missing']);
    exit;
}

$stmt = $db->prepare("DELETE FROM candidatures WHERE candidature_id = :candidature_id");
$stmt->bindParam(":candidature_id", $candidature_id);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Candidature deleted']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete candidature']);
}
?>
