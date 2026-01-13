<?php
require("./Database_init/db_connection.php");

// CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable errors for debugging (remove in production)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// UUID function
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // version 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // variant
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Read input JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['offre_id'], $data['user_id'])) {
    echo json_encode([
        "success" => false,
        "message" => "Missing offre_id or user_id"
    ]);
    exit;
}

$offre_id = $data['offre_id'];
$bookmark_user = $data['user_id'];

// Check PDO connection
if (!$pdo) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// Main logic
try {
    // Check if bookmark already exists
    $check = $db->prepare("SELECT bookmark_id FROM bookmark WHERE bookmark_user = ? AND offre_id = ?");
    $check->execute([$bookmark_user, $offre_id]);

    if ($check->rowCount() > 0) {
        // Remove bookmark
        $delete = $db->prepare("DELETE FROM bookmark WHERE bookmark_user = ? AND offre_id = ?");
        $delete->execute([$bookmark_user, $offre_id]);

        echo json_encode([
            "success" => true,
            "bookmarked" => false,
            "message" => "Bookmark removed"
        ]);
    } else {
        // Add bookmark
        $bookmark_id = uuidv4();
        $insert = $db->prepare("INSERT INTO bookmark (bookmark_id, bookmark_user, offre_id) VALUES (?, ?, ?)");
        $insert->execute([$bookmark_id, $bookmark_user, $offre_id]);

        echo json_encode([
            "success" => true,
            "bookmarked" => true,
            "message" => "Bookmark added"
        ]);
    }
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
