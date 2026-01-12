<?php
require "./Database_init/db_connection.php";

// 🔥 CORS
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get POST data
$entreprise_id  = $_POST['entreprise_id'] ?? null;
$email          = $_POST['email'] ?? $email;
$username       = $_POST['username'] ?? $username;
$telephone      = $_POST['telephone'] ?? $telephone;
$nom_entreprise = $_POST['nom_entreprise'] ?? $nom_entreprise;
$description    = $_POST['description'] ?? $description;
$adresse        = $_POST['adresse'] ?? $adresse;
$site_web       = $_POST['site_web'] ?? $site_web;

if (!$entreprise_id) {
    echo json_encode(['success' => false, 'message' => 'entreprise_id is required']);
    exit;
}

// Handle file upload
$logo_path = null;
if (isset($_FILES['logo']) && $_FILES['logo']['error'] === UPLOAD_ERR_OK) {
    $uploadDir = __DIR__ . "/uploads/logos/";
    if (!file_exists($uploadDir)) mkdir($uploadDir, 0755, true);

    $tmpName = $_FILES['logo']['tmp_name'];
    $fileName = uniqid() . "_" . basename($_FILES['logo']['name']);
    $destination = $uploadDir . $fileName;

    if (move_uploaded_file($tmpName, $destination)) {
        $logo_path = "uploads/logos/" . $fileName;
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to upload logo']);
        exit;
    }
}

try {
    $db->beginTransaction();

    // Build SQL
    $sql = "UPDATE entreprise_account SET
                email = :email,
                username = :username,
                telephone = :telephone,
                nom_entreprise = :nom_entreprise,
                description = :description,
                adresse = :adresse,
                site_web = :site_web";

    $params = [
        ':email' => $email,
        ':username' => $username,
        ':telephone' => $telephone,
        ':nom_entreprise' => $nom_entreprise,
        ':description' => $description,
        ':adresse' => $adresse,
        ':site_web' => $site_web,
        ':entreprise_id' => $entreprise_id
    ];

    if ($logo_path) {
        $sql .= ", logo_path = :logo_path";
        $params[':logo_path'] = $logo_path;
    }

    $sql .= " WHERE entreprise_id = :entreprise_id";

    $stmt = $db->prepare($sql);
    $stmt->execute($params);

    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Entreprise updated successfully',
        'logo_path' => $logo_path ?? null
    ]);

} catch (PDOException $e) {
    $db->rollBack();
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>
