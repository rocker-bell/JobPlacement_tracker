<?php
require "./Database_init/db_connection.php"; // $db is already set

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Turn off display errors (don’t output to client)
ini_set('display_errors', 0);
ini_set('log_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$first_name = $data['first_name'] ?? null;
$last_name  = $data['last_name'] ?? null;
$email      = $data['email'] ?? null;
$contact    = $data['contact'] ?? null;
$subject    = $data['subject'] ?? null;

if (!$first_name || !$last_name || !$email || !$subject) {
    echo json_encode([
        'success' => false,
        'message' => 'first_name, last_name, email, and subject are required'
    ]);
    exit;
}

try {
    $stmt = $db->prepare("
        INSERT INTO contact_requests (first_name, last_name, email, contact, subject)
        VALUES (:first_name, :last_name, :email, :contact, :subject)
    ");
    $stmt->execute([
        ':first_name' => $first_name,
        ':last_name'  => $last_name,
        ':email'      => $email,
        ':contact'    => $contact,
        ':subject'    => $subject
    ]);

    $contact_id = $db->lastInsertId();

    echo json_encode([
        'success' => true,
        'message' => 'Contact request saved successfully',
        'contact_id' => $contact_id
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}

// 🔹 No closing PHP tag at all!
