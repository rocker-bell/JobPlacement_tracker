<?php
require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'] ?? null;
$date = $data['date'] ?? null; // optional: fetch notifications after this timestamp

if (!$user_id) {
    echo json_encode([
        "success" => false,
        "message" => "user_id is required"
    ]);
    exit;
}

try {
    if ($date) {
        // Fetch notifications after the given timestamp
        $stmt = $db->prepare("
            SELECT * FROM notifications 
            WHERE receiver_id = :user_id AND created_at > :date
            ORDER BY created_at DESC
        ");
        $stmt->execute([
            ':user_id' => $user_id,
            ':date' => $date
        ]);
    } else {
        // Fetch all notifications
        $stmt = $db->prepare("
            SELECT * FROM notifications 
            WHERE receiver_id = :user_id
            ORDER BY created_at DESC
        ");
        $stmt->execute([':user_id' => $user_id]);
    }

    $notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true,
        "notifications" => $notifications
    ]);

} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error",
        "error" => $e->getMessage()
    ]);
}
?>
