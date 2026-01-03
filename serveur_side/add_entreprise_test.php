<?php
require "./Database_init/db_connection.php"; // Your DB connection

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Get POST data safely
    $entreprise_id   = $_POST['entreprise_id'] ?? null;
    $nom_entreprise  = $_POST['nom_entreprise'] ?? null;
    $description     = $_POST['description'] ?? null;
    $adresse         = $_POST['adresse'] ?? null;
    $logo_path       = "./Uploads/test.png"; // default logo
    $site_web        = $_POST['site_web'] ?? null;

    // Validate required fields
    if (!$entreprise_id || !$nom_entreprise) {
        echo json_encode(['success' => false, 'message' => 'Missing required fields']);
        exit;
    }

    try {
        // Check if the user exists in Utilisateurs (foreign key constraint)
        $checkUser = $db->prepare("SELECT * FROM Utilisateurs WHERE user_id = :user_id");
        $checkUser->bindParam(':user_id', $entreprise_id);
        $checkUser->execute();
        $userExists = $checkUser->fetch(PDO::FETCH_ASSOC);

        if (!$userExists) {
            echo json_encode(['success' => false, 'message' => 'User does not exist. Cannot add entreprise.']);
            exit;
        }

        // Prepare insertion into Entreprises
        $stmt = $db->prepare("INSERT INTO Entreprises (entreprise_id, nom_entreprise, description, adresse, logo_path, site_web)
                              VALUES (:entreprise_id, :nom_entreprise, :description, :adresse, :logo_path, :site_web)");
        $stmt->bindParam(':entreprise_id', $entreprise_id);
        $stmt->bindParam(':nom_entreprise', $nom_entreprise);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':adresse', $adresse);
        $stmt->bindParam(':logo_path', $logo_path);
        $stmt->bindParam(':site_web', $site_web);

        if ($stmt->execute()) {
            echo json_encode([
                'success' => true,
                'message' => 'Enterprise inserted successfully',
                'data' => [
                    'entreprise_id' => $entreprise_id,
                    'nom_entreprise' => $nom_entreprise,
                    'description' => $description,
                    'adresse' => $adresse,
                    'logo_path' => $logo_path,
                    'site_web' => $site_web
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to insert entreprise']);
        }

    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
