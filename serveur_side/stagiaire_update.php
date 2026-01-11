<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check request method
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$stagiaire_id = $_POST['stagiaire_id'] ?? null;
$nom = $_POST['nom'] ?? null;
$prenom = $_POST['prenom'] ?? null;
$emplacement = $_POST['emplacement'] ?? null;

if (!$stagiaire_id) {
    echo json_encode(['success' => false, 'message' => 'Missing stagiaire_id']);
    exit;
}

// Handle optional file uploads
$cv_path = null;
if (isset($_FILES['cv_file']) && $_FILES['cv_file']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . '/uploads/cv/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $filename = basename($_FILES['cv_file']['name']);
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $new_filename = uniqid('cv_') . '.' . $ext;
    $target_file = $upload_dir . $new_filename;

    if (move_uploaded_file($_FILES['cv_file']['tmp_name'], $target_file)) {
        $cv_path = 'uploads/cv/' . $new_filename;
    }
}

$photo_path = null;
if (isset($_FILES['photo_file']) && $_FILES['photo_file']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . '/uploads/photo/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $filename = basename($_FILES['photo_file']['name']);
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $new_filename = uniqid('photo_') . '.' . $ext;
    $target_file = $upload_dir . $new_filename;

    if (move_uploaded_file($_FILES['photo_file']['tmp_name'], $target_file)) {
        $photo_path = 'uploads/photo/' . $new_filename;
    }
}

try {
    // Check if stagiaire exists
    $stmt_check = $db->prepare("SELECT * FROM StagiaireAccounts WHERE stagiaire_id = :stagiaire_id");
    $stmt_check->bindParam(':stagiaire_id', $stagiaire_id);
    $stmt_check->execute();
    $existing = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // Update existing stagiaire
        $stmt_update = $db->prepare("
            UPDATE StagiaireAccounts
            SET nom = :nom,
                prenom = :prenom,
                emplacement = :emplacement,
                cv_path = COALESCE(:cv_path, cv_path),
                photo_path = COALESCE(:photo_path, photo_path)
            WHERE stagiaire_id = :stagiaire_id
        ");
        $stmt_update->bindParam(':nom', $nom);
        $stmt_update->bindParam(':prenom', $prenom);
         $stmt_update->bindParam(':emplacement', $emplacement);
        $stmt_update->bindParam(':cv_path', $cv_path);
        $stmt_update->bindParam(':photo_path', $photo_path);
        $stmt_update->bindParam(':stagiaire_id', $stagiaire_id);

        $stmt_update->execute();

        echo json_encode(['success' => true, 'message' => 'Stagiaire updated successfully']);

    } else {
        echo json_encode(['success' => false, 'message' => 'Stagiaire not found']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
