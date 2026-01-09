<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require "./Database_init/db_connection.php";

// Read the input from the request body
$data = json_decode(file_get_contents("php://input"), true);

// Extract form data from the input
$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$phonenumber = trim($data['phone'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'Stagiaire';
$verificationToken = $data['verificationToken'] ?? '';

// Check if all required fields are provided
if (!$username || !$email || !$password || !$phonenumber || !$verificationToken) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Check if the email or username is already taken
$checkEmail = $db->prepare("SELECT 1 FROM Utilisateurs_ WHERE email = :email");
$checkEmail->execute([':email' => $email]);
if ($checkEmail->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

$checkUsername = $db->prepare("SELECT 1 FROM Utilisateurs_ WHERE username = :username");
$checkUsername->execute([':username' => $username]);
if ($checkUsername->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Username already taken']);
    exit;
}

// Insert new user into the database with Pending status
$user_id = uuidv4();  // Generate a UUID for the new user
$createdAt = date('Y-m-d H:i:s');
$hash = password_hash($password, PASSWORD_DEFAULT);

// Prepare the SQL query
$stmt = $db->prepare("
    INSERT INTO Utilisateurs_ (
        user_id, email, username, password_hash,
        telephone, role, account_status, verification_token, 
        token_created_at, token_expires_at, created_at, updated_at
    ) VALUES (
        :user_id, :email, :username, :password_hash,
        :telephone, :role, 'Pending', :verification_token, 
        :token_created_at, :token_expires_at, :created_at, :updated_at
    )
");

$stmt->execute([
    ':user_id' => $user_id,
    ':email' => $email,
    ':username' => $username,
    ':password_hash' => $hash,
    ':telephone' => $phonenumber,
    ':role' => $role,
    ':verification_token' => $verificationToken,
    ':token_created_at' => $createdAt,
    ':token_expires_at' => date('Y-m-d H:i:s', strtotime('+24 hours')),
    ':created_at' => $createdAt,
    ':updated_at' => $createdAt
]);

// Send back the response for successful registration
echo json_encode([
    'success' => true,
    'message' => 'Registration successful! Please check your email to verify your account.'
]);

?>
