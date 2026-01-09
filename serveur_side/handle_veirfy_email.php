<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require "./Database_init/db_connection.php";

// Read the token from the request
$token = $_GET['token'] ?? '';

if (!$token) {
    echo json_encode(['success' => false, 'message' => 'Invalid token']);
    exit;
}

// Find the user with the matching token
$stmt = $db->prepare("SELECT user_id, account_status FROM Utilisateurs_ WHERE verification_token = :token");
$stmt->execute([':token' => $token]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    exit;
}

// If the token is valid, mark the user as verified
if ($user['account_status'] == 'Pending') {
    $updateStmt = $db->prepare("UPDATE Utilisateurs_ SET account_status = 'Verified' WHERE user_id = :user_id");
    $updateStmt->execute([':user_id' => $user['user_id']]);

    echo json_encode(['success' => true, 'message' => 'Account successfully verified']);
} else {
    echo json_encode(['success' => false, 'message' => 'Account already verified or blocked']);
}

?>
