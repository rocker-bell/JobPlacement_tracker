<?php
// 🔥 CORS — MUST BE FIRST (no spaces, no output before this)
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require "./Database_init/db_connection.php";

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);

if (empty($input['user_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

$userId = $input['user_id'];

// Fetch encadrant data
$sql = "
    SELECT * from encadrant_account 
        
    WHERE encadrant_id = :encadrant_id
";

$stmt = $db->prepare($sql);
$stmt->bindParam(':encadrant_id', $userId, PDO::PARAM_STR);
$stmt->execute();

$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    http_response_code(404);
    echo json_encode(["error" => "Encadrant not found"]);
    exit;
}

// Send response
echo json_encode([
    "success" => true,
    "user" => $result
]);
