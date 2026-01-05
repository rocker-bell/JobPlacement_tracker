<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


try {
    if (!isset($_POST['query']) || empty(trim($_POST['query']))) {
        echo json_encode([
            'success' => false,
            'message' => 'Search query is empty'
        ]);
        exit;
    }

    $query = '%' . trim($_POST['query']) . '%';

    $stmt = $db->prepare("
        SELECT *
        FROM Offres_Stage
        WHERE titre LIKE :query
           OR description LIKE :query
        ORDER BY created_at DESC
    ");

    $stmt->bindParam(':query', $query, PDO::PARAM_STR);
    $stmt->execute();

    $stages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'query_data' => $stages
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error'
    ]);
}
