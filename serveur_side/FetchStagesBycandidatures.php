<?php
require("./Database_init/db_connection.php");

// CORS headers
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    // 1️⃣ Count candidatures per stage city
    $stmt = $db->prepare("
        SELECT os.emplacement AS city, COUNT(c.candidature_id) AS candidatures
        FROM offres_stage os
        LEFT JOIN Candidatures c ON os.offre_id = c.offre_id
        GROUP BY os.emplacement
    ");
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $result
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error: ' . $e->getMessage()
    ]);
}

$db = null;
?>
