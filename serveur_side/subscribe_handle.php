<?php
require "./Database_init/db_connection.php"; // PDO connection already set

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);
$email = $data['email'] ?? null;

if (!$email) {
    echo json_encode([
        'success' => false,
        'message' => 'Email is required'
    ]);
    exit;
}

try {
    // Insert email into subscribe table
    $stmt = $db->prepare("
        INSERT INTO subscribe (email) VALUES (:email)
    ");
    $stmt->execute([
        ':email' => $email
    ]);

    $subscribe_id = $db->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Subscribed successfully',
        'subscribe_id' => $subscribe_id
    ]);

} catch (PDOException $e) {
    // Handle duplicate email
    if ($e->getCode() == 23000) {
        echo json_encode([
            'success' => false,
            'message' => 'This email is already subscribed'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Database error',
            'error' => $e->getMessage()
        ]);
    }
}