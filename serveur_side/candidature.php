<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ✅ Function to generate UUID v4
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

// Check if request contains form data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$stagiaire_id = $_POST['user_id'] ?? null;
$offre_id = $_POST['offre_id'] ?? null;
$message_motivation = $_POST['message_motivation'] ?? null;

// Validate required fields
if (!$stagiaire_id || !$offre_id) {
    echo json_encode(['success' => false, 'message' => 'user_id and offre_id are required']);
    exit;
}

// Handle CV upload
$cv_path = null;
if (isset($_FILES['cv_file']) && $_FILES['cv_file']['error'] === UPLOAD_ERR_OK) {
    $upload_dir = __DIR__ . '/uploads/cv/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $filename = basename($_FILES['cv_file']['name']);
    $ext = pathinfo($filename, PATHINFO_EXTENSION);
    $new_filename = uniqid('cv_') . '.' . $ext;
    $target_file = $upload_dir . $new_filename;

    if (move_uploaded_file($_FILES['cv_file']['tmp_name'], $target_file)) {
        $cv_path = 'uploads/cv/' . $new_filename; // Relative path to store in DB
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload CV']);
        exit;
    }
}

// Generate candidature_id
$candidature_id = uuidv4();

try {
    $stmt = $db->prepare("
        INSERT INTO Candidatures (candidature_id, stagiaire_id, offre_id, message_motivation, cv_path)
        VALUES (:candidature_id, :stagiaire_id, :offre_id, :message_motivation, :cv_path)
    ");

    $stmt->bindParam(':candidature_id', $candidature_id);
    $stmt->bindParam(':stagiaire_id', $stagiaire_id);
    $stmt->bindParam(':offre_id', $offre_id);
    $stmt->bindParam(':message_motivation', $message_motivation);
    $stmt->bindParam(':cv_path', $cv_path);

    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Candidature submitted successfully',
            'candidature' => [
                'candidature_id' => $candidature_id,
                'stagiaire_id' => $stagiaire_id,
                'offre_id' => $offre_id,
                'message_motivation' => $message_motivation,
                'cv_path' => $cv_path,
                'statut' => 'En_attente',
                'created_at' => date('Y-m-d H:i:s')
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to insert candidature']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
