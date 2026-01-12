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

$offre_id = $_POST['offre_id'] ?? null;

if (!$offre_id) {
    echo json_encode(['success' => false, 'message' => 'Missing offre_id']);
    exit;
}

try {
    $stmt = $db->prepare("
        SELECT c.*, s.nom, s.prenom, s.cv_path, s.photo_path
        FROM Candidatures c
        JOIN stagiaire_accounts s ON c.stagiaire_id = s.stagiaire_id
        WHERE c.offre_id = :offre_id
    ");
    $stmt->bindParam(':offre_id', $offre_id);
    $stmt->execute();
    $candidatures = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'candidatures' => $candidatures]);

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
