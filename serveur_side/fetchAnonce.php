<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// PREFLIGHT
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require "./Database_init/db_connection.php";

$sql = "SELECT anonce_id, title, subject, created_at
        FROM anonce
        ORDER BY created_at DESC";

$stmt = $db->query($sql);
$anonces = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($anonces);
