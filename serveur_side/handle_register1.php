<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json");

require "./Database_init/db_connection.php";  // Assuming this file establishes the MySQL connection

// Function to generate UUID v4
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // Set the version to 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // Set the variant to RFC4122
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$data = json_decode(file_get_contents("php://input"), true);

$username = trim($data['username'] ?? '');
$email = trim($data['email'] ?? '');
$phonenumber = trim($data['registerPhoneNumber'] ?? '');
$password = $data['password'] ?? '';
$role = $data['role'] ?? 'Stagiaire';

if (!$username || !$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}




// Check if the email is already taken
$check = $db->prepare("SELECT 1 FROM Utilisateurs WHERE email=:email");
$check->bindValue(':email', $email, PDO::PARAM_STR);
$check->execute();  // Execute the query

// Instead of calling fetch() on the result of execute(), call fetch() on the query result
if ($check->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

// Check if the username is already taken
$checkUser = $db->prepare("SELECT 1 FROM Utilisateurs WHERE username=:username");
$checkUser->bindValue(':username', $username, PDO::PARAM_STR);
$checkUser->execute();  // Execute the query

// Same as above: call fetch() on the result of the query
if ($checkUser->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Username already taken']);
    exit;
}

/* ---- create user ---- */
$user_id = uuidv4();  // Generate UUID manually
$createdAt = date('Y-m-d H:i:s');
$hash = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("
    INSERT INTO Utilisateurs (
        user_id, email, password_hash, telephone, role, account_status, created_at, updated_at
    )
    VALUES (
        :user_id, :email, :password_hash, :telephone, :role, :account_status, :created_at, :updated_at
    )
");

$stmt->bindValue(':user_id', $user_id, PDO::PARAM_STR);  // Insert UUID manually
$stmt->bindValue(':email', $email, PDO::PARAM_STR);
$stmt->bindValue(':password_hash', $hash, PDO::PARAM_STR);
$stmt->bindValue(':telephone', $phonenumber, PDO::PARAM_STR);
$stmt->bindValue(':role', $role, PDO::PARAM_STR);
$stmt->bindValue(':account_status', 'Pending', PDO::PARAM_STR);  // Default status is 'Pending'
$stmt->bindValue(':created_at', $createdAt, PDO::PARAM_STR);
$stmt->bindValue(':updated_at', $createdAt, PDO::PARAM_STR);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Registration successful',
        'user_id' => $user_id
    ]);
} else {
    $errorInfo = $stmt->errorInfo();  // Get error information
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $errorInfo[2]]);
}

?>
