<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Decode JSON body
    $input = json_decode(file_get_contents("php://input"), true);
    $offre_id = $input['offre_id'] ?? null;

    if (!$offre_id) {
        echo json_encode(['success' => false, 'message' => 'No offre_id provided']);
        exit;
    }

    // Fetch encadrant details via JOIN with affectation
    $stmt = $db->prepare("
        SELECT e.*
        FROM affectation a
        JOIN encadrant_account e ON a.encadrant_id = e.encadrant_id
        WHERE a.offre_id = :offre_id
        LIMIT 1
    ");
    $stmt->bindParam(':offre_id', $offre_id);
    $stmt->execute();
    $encadrant = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($encadrant) {
        echo json_encode(['success' => true, 'user_data' => $encadrant]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Encadrant not found']);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
