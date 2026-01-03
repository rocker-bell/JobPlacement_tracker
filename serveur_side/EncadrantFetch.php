<?php
require "./Database_init/db_connection.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get user_id from POST
    $user_id = $_POST['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'No user_id provided']);
        exit;
    }

    // Fetch encadrant data
    $stmt = $db->prepare("SELECT * FROM Encadrants WHERE encadrant_id = :user_id");
    $stmt->bindParam(':user_id', $user_id);
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
