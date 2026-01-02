<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Only allow GET
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get stagiaire_id from query params
$stagiaire_id = $_POST['stagiaire_id'] ?? null;

// Validate
if (!$stagiaire_id) {
    echo json_encode(['success' => false, 'message' => 'stagiaire_id is required']);
    exit;
}

try {
    $stmt = $db->prepare("
        SELECT 
            candidature_id,
            stagiaire_id,
            offre_id,
            statut,
            message_motivation,
            cv_path,
            created_at,
            updated_at
        FROM Candidatures
        WHERE stagiaire_id = :stagiaire_id
        ORDER BY created_at DESC
    ");

    $stmt->bindParam(':stagiaire_id', $stagiaire_id);
    $stmt->execute();

    $candidatures = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'count' => count($candidatures),
        'candidatures' => $candidatures
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
