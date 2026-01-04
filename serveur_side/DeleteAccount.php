<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');


ini_set('display_errors', 1);
error_reporting(E_ALL);
try {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $user_id = $input['user_id'] ?? null;

    if (!$user_id) {
        echo json_encode(['success' => false, 'message' => 'user_id is required']);
        exit;
    }

    // Prepare and execute DELETE
    $stmt = $db->prepare("DELETE FROM Utilisateurs WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id);
    $result = $stmt->execute();

    if ($result) {
        echo json_encode(['success' => true, 'message' => 'User deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to delete user']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
?>
