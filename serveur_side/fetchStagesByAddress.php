<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

$stagiaire_id = $_POST['stagiaire_id'] ?? null;

if (!$stagiaire_id) {
    echo json_encode(['success' => false, 'message' => 'Missing stagiaire_id']);
    exit;
}

try {
    // 1. Get stagiaire's emplacement
    $stmt = $db->prepare("SELECT emplacement FROM StagiaireAccounts WHERE stagiaire_id = :stagiaire_id");
    $stmt->bindParam(':stagiaire_id', $stagiaire_id);
    $stmt->execute();
    $stagiaire = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$stagiaire || empty($stagiaire['emplacement'])) {
        echo json_encode(['success' => false, 'message' => 'Emplacement not found']);
        exit;
    }

    $emplacement = $stagiaire['emplacement'];

    // 2. Fetch stages matching the emplacement
    $stmt2 = $db->prepare("SELECT * FROM offres_stage WHERE emplacement = :emplacement");
    $stmt2->bindParam(':emplacement', $emplacement);
    $stmt2->execute();
    $stages = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'stages' => $stages]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
