<?php

require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$entreprise_id  = $_POST['entreprise_id'] ?? null;
$nom_entreprise = $_POST['nom_entreprise'] ?? null;
$description    = $_POST['description'] ?? null;
$adresse        = $_POST['adresse'] ?? null;
$site_web       = $_POST['site_web'] ?? null;

if (!$entreprise_id) {
    echo json_encode(['success' => false, 'message' => 'entreprise_id required']);
    exit;
}

try {
    // Start transaction (important)
    $db->beginTransaction();

    // 1️⃣ Update Entreprises
    $stmtEntreprise = $db->prepare("
        UPDATE Entreprises SET
            nom_entreprise = :nom_entreprise,
            description = :description,
            adresse = :adresse,
            site_web = :site_web
        WHERE entreprise_id = :entreprise_id
    ");

    $stmtEntreprise->execute([
        ':entreprise_id' => $entreprise_id,
        ':nom_entreprise' => $nom_entreprise,
        ':description' => $description,
        ':adresse' => $adresse,
        ':site_web' => $site_web,
    ]);

    // 2️⃣ Update Utilisateurs account_status
    $stmtUser = $db->prepare("
        UPDATE Utilisateurs
        SET account_status = 'Active'
        WHERE user_id = :user_id
    ");

    $stmtUser->execute([
        ':user_id' => $entreprise_id
    ]);

    // Commit both updates
    $db->commit();

    echo json_encode([
        'success' => true,
        'message' => 'Entreprise updated and user activated successfully'
    ]);

} catch (PDOException $e) {
    $db->rollBack();

    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
