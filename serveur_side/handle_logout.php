<?php
    
require "./Database_init/db_connection.php";

// 1. Handle CORS properly
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Get user_id and connection id from POST
$data = json_decode(file_get_contents("php://input"), true);
$user_id = $data['user_id'] ?? null;
// $connection_id = $data['connection_id'] ?? null;

if (!$user_id ) {
    echo json_encode(['success' => false, 'message' => 'Missing user_id or connection_id']);
    exit;
}

try {
    $stmt = $db->prepare("
        UPDATE UserConnections
        SET disconnected_at = NOW()
        WHERE  user_id = :user_id
    ");
    // $stmt->bindValue(':connection_id', $connection_id, PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);
    $stmt->execute();

    echo json_encode(['success' => true, 'message' => 'Disconnected successfully']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$db = null;

?>