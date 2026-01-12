<?php
require "./Database_init/db_connection.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// ✅ get submitted query
$query = trim($_POST['query'] ?? null);

if (!$query) {
    echo json_encode(['success' => false, 'message' => 'No search query provided']);
    exit;
}

try {
    $stmt = $db->prepare("
        SELECT *
        FROM encadrant_account
        WHERE TRIM(encadrant_id) = :query
           OR TRIM(agence_id) = :query
           OR TRIM(nom_d_agence) = :query
        LIMIT 1
    ");

    $stmt->bindParam(':query', $query);
    $stmt->execute();

    $encadrant = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($encadrant) {
        echo json_encode([
            'success' => true,
            'user_data' => $encadrant
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Encadrant not found'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
