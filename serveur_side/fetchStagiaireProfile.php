<?php
require "./Database_init/db_connection.php";

// Allow CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Must return these headers for the preflight
    http_response_code(200);
    exit;
}

// Only allow POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

// Read JSON body
$input = json_decode(file_get_contents("php://input"), true);

if (!isset($input['user_id']) || empty($input['user_id'])) {
    http_response_code(400);
    echo json_encode(["error" => "user_id is required"]);
    exit;
}

$userId = $input['user_id'];

// Fetch stagiaire data
$sql = "
    SELECT * 
    FROM stagiaire_accounts 
        
    WHERE stagiaire_id = :stagiaire_id;
";

$stmt = $db->prepare($sql);
$stmt->bindParam(':stagiaire_id', $userId, PDO::PARAM_STR);
$stmt->execute();

$result = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$result) {
    http_response_code(404);
    echo json_encode(["error" => "Stagiaire not found"]);
    exit;
}

// Send response
echo json_encode([
    "success" => true,
    "user" => $result
]);

?>