<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request']);
    exit;
}

$encadrant_id = $_POST['encadrant_id'] ?? null;
if (!$encadrant_id) {
    echo json_encode(['success' => false, 'message' => 'encadrant_id required']);
    exit;
}

// Build dynamic update (PATCH-style)
$fields = [];
$params = [':encadrant_id' => $encadrant_id];

if (!empty($_POST['nom'])) {
    $fields[] = "nom = :nom";
    $params[':nom'] = $_POST['nom'];
}

if (!empty($_POST['prenom'])) {
    $fields[] = "prenom = :prenom";
    $params[':prenom'] = $_POST['prenom'];
}

if (!empty($_POST['agence_id'])) {
    $fields[] = "agence_id = :agence_id";
    $params[':agence_id'] = $_POST['agence_id'];
}

if (!empty($_POST['nom_d_agence'])) {
    $fields[] = "nom_d_agence = :nom_d_agence";
    $params[':nom_d_agence'] = $_POST['nom_d_agence'];
}

if (!empty($_POST['departement'])) {
    $fields[] = "departement = :departement";
    $params[':departement'] = $_POST['departement'];
}

// Photo upload
if (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . '/uploads/photo/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $ext = pathinfo($_FILES['photo_file']['name'], PATHINFO_EXTENSION);
    $new_filename = uniqid('photo_') . '.' . $ext;
    $target = $upload_dir . $new_filename;

    if (move_uploaded_file($_FILES['photo_file']['tmp_name'], $target)) {
        $fields[] = "photo_path = :photo_path";
        $params[':photo_path'] = 'uploads/photo/' . $new_filename;
    }
}

// Always set status
$fields[] = "status_d_encadrant = 'Active'";

if (empty($fields)) {
    echo json_encode(['success' => false, 'message' => 'No data to update']);
    exit;
}

$sql = "
    UPDATE encadrant_account
    SET " . implode(', ', $fields) . "
    WHERE encadrant_id = :encadrant_id
";

try {
    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    echo json_encode(['success' => true, 'message' => 'Encadrant updated successfully']);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}

?>