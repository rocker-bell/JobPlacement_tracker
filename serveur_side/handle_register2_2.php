<?php

require "./Database_init/db_connection.php";

// Enable CORS for React frontend
header("Access-Control-Allow-Origin: http://localhost:5173");  // React app URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Get input data (username/email and password)
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (!$username || !$password) {
    echo json_encode(['success' => false, 'message' => 'All fields are required']);
    exit;
}

// Check for connection error using try-catch
try {
    // Assuming $db is your PDO object
    if (!$db) {
        throw new Exception("Database connection failed.");
    }

    // Query to get user by username or email
    $stmt = $db->prepare("SELECT * FROM Utilisateurs WHERE email = ? OR username = ?");
    $stmt->bindValue("ss", $username, $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
        exit;
    }

    // Login successful
    echo json_encode([
        'success' => true,
        'role' => $user['role'],
        'user_data' => [
            'user_id' => $user['user_id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'created_at' => $user['created_at']
        ]
    ]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Connection failed: ' . $e->getMessage()]);
} finally {
    // Close the connection if necessary
   
    // PDO doesn't have a close() method like MySQLi, but you can unset the connection if you want to release it
    unset($db);
}
?>
