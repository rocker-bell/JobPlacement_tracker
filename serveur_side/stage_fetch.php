<?php
require "./Database_init/db_connection.php";
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $entreprise_id = $_POST['entreprise_id'] ?? null;

    if (!$entreprise_id) {
        echo json_encode(['success' => false, 'message' => 'No entreprise_id provided']);
        exit;
    }

    $stmt = $db->prepare("SELECT * FROM Offres_Stage WHERE entreprise_id = :entreprise_id");
    $stmt->bindParam(':entreprise_id', $entreprise_id);
    $stmt->execute();
    $stages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'stages' => $stages]);
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>
