<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// 🔥 PREFLIGHT CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require "./Database_init/db_connection.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['title'], $data['subject'])) {
    http_response_code(400);
    echo json_encode(["message" => "Données manquantes"]);
    exit;
}

$title = trim($data['title']);
$subject = trim($data['subject']);

if (empty($title) || empty($subject)) {
    http_response_code(422);
    echo json_encode(["message" => "Champs vides"]);
    exit;
}

function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$anonce_id = uuidv4();

$sql = "INSERT INTO anonce (anonce_id, title, subject)
        VALUES (:anonce_id, :title, :subject)";

$stmt = $db->prepare($sql);
$stmt->execute([
    ':anonce_id' => $anonce_id,
    ':title' => $title,
    ':subject' => $subject
]);

echo json_encode([
    "message" => "Annonce créée avec succès",
    "anonce_id" => $anonce_id
]);


?>