<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Lire encadrant_id depuis JSON (fetch JS)
$input = json_decode(file_get_contents('php://input'), true);
$encadrant_id = $input['encadrant_id'] ?? null;

if (!$encadrant_id) {
    echo json_encode([
        'success' => false,
        'message' => 'encadrant_id manquant'
    ]);
    exit;
}

try {
    $stmt = $db->prepare("
        SELECT *
        FROM affectation
        WHERE encadrant_id = :encadrant_id
          AND LOWER(affectation_status) = 'active'
        ORDER BY created_at DESC
    ");

    $stmt->bindParam(':encadrant_id', $encadrant_id);
    $stmt->execute();

    $affectations = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!$affectations) {
        echo json_encode([
            'success' => false,
            'message' => 'Il n’y a pas d’affectation pour le moment'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'user_data' => $affectations
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur',
        'error' => $e->getMessage()
    ]);
}


?>