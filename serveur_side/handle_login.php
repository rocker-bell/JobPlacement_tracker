<?php
// handle_login.php

require "./Database_init/db_connection.php";

// 1. Handle CORS properly
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);


// Handle preflight request (React sends this before POST)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Error Reporting (Keep enabled for debugging, disable in production)

// 3. Get Input
$data = json_decode(file_get_contents("php://input"), true);
$input_login = $data['username'] ?? ''; // This captures the email typed in the username box
$password = $data['password'] ?? '';

if (!$input_login || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

try {
    // 4. Correct Query (PDO)
    // We check ONLY 'email' because the 'username' column does not exist in your Utilisateurs table 
    $stmt = $db->prepare("SELECT * FROM Utilisateurs WHERE email = :email OR username = :email");
    
    // Bind the input (React sends 'username', but we treat it as email)
    $stmt->bindValue(':email', $input_login, PDO::PARAM_STR);
    $stmt->execute();
    
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // 5. Verify Password
    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    // 6. Success Response
    // Note: We access $user['user_id'] (CHAR 36 UUID) based on your schema
    echo json_encode([
        'success' => true,
        'role' => $user['role'],
        'user_data' => [
            'user_id' => $user['user_id'], // This is your UUID
            'email' => $user['email'],
            'role' => $user['role'],
            'account_status' => $user['account_status'],
            'password_hash' => $user['password_hash'],
            'verification_token' => $user['verification_token'],
            'created_at' => $user['created_at']
        ]
    ]);

} catch (PDOException $e) {
    // Return a JSON error if the DB query fails
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// Close connection (Optional in PDO as it closes automatically at script end, but good practice)
$db = null;
?>