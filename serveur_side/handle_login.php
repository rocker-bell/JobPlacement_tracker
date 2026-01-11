<?php
// handle_login.php

require "./Database_init/db_connection.php";

// 1️⃣ Handle CORS properly
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// 2️⃣ Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3️⃣ Get input from React
$data = json_decode(file_get_contents("php://input"), true);
$input_login = $data['username'] ?? ''; // email/username field
$password = $data['password'] ?? '';

if (!$input_login || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// 4️⃣ UUID v4 generator
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // RFC4122 variant
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

try {
    // 5️⃣ Fetch user by email or username
    $stmt = $db->prepare("SELECT * FROM Utilisateurs WHERE email = :email OR username = :email");
    $stmt->bindValue(':email', $input_login, PDO::PARAM_STR);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // 6️⃣ Verify password
    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    // 7️⃣ Only insert connection if there’s no active session
    $check_conn = $db->prepare("
        SELECT COUNT(*) FROM UserConnections 
        WHERE user_id = :user_id AND disconnected_at IS NULL
    ");
    $check_conn->bindValue(':user_id', $user['user_id'], PDO::PARAM_STR);
    $check_conn->execute();
    $existing = $check_conn->fetchColumn();

    $connection_id = null;

    if ($existing == 0) {
        $connection_id = uuidv4();
        $insert_conn = $db->prepare("
            INSERT INTO UserConnections (id, user_id, connect_at, ip_address)
            VALUES (:id, :user_id, NOW(), :ip_address)
        ");
        $insert_conn->bindValue(':id', $connection_id, PDO::PARAM_STR);
        $insert_conn->bindValue(':user_id', $user['user_id'], PDO::PARAM_STR);
        $insert_conn->bindValue(':ip_address', $_SERVER['REMOTE_ADDR'], PDO::PARAM_STR);
        $insert_conn->execute();
    }

    // 8️⃣ Return success response
    echo json_encode([
        'success' => true,
        'connection_id' => $connection_id, // null if already connected
        'role' => $user['role'],
        'user_data' => [
            'user_id' => $user['user_id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'account_status' => $user['account_status'],
            'created_at' => $user['created_at']
        ]
    ]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

// 9️⃣ Close connection
$db = null;
?>
