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

    // 1️⃣ Start transaction to ensure atomic operation
    $db->beginTransaction();

    // 2️⃣ Fetch user data
    $stmt = $db->prepare("SELECT * FROM Utilisateurs WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode(['success' => false, 'message' => 'User not found']);
        exit;
    }

    // 3️⃣ Insert into holding table
    $holdStmt = $db->prepare("
        INSERT INTO account_on_delete_hold 
        (user_id, username, email, role, deleted_at) 
        VALUES (:user_id, :username, :email, :role, NOW())
    ");
    $holdStmt->bindParam(':user_id', $user['user_id']);
    $holdStmt->bindParam(':username', $user['username']);
    $holdStmt->bindParam(':email', $user['email']);
    $holdStmt->bindParam(':role', $user['role']);
    $holdStmt->execute();

    // 4️⃣ Delete user from main table
    $deleteStmt = $db->prepare("DELETE FROM Utilisateurs WHERE user_id = :user_id");
    $deleteStmt->bindParam(':user_id', $user_id);
    $deleteStmt->execute();

    // 5️⃣ Commit transaction
    $db->commit();

    echo json_encode(['success' => true, 'message' => 'User deleted and moved to hold table successfully']);

} catch (PDOException $e) {
    // Rollback if any error
    if ($db->inTransaction()) {
        $db->rollBack();
    }
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
?>
