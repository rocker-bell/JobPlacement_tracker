<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

try {
    $job = isset($_POST['job']) ? trim($_POST['job']) : '';
    $location = isset($_POST['location']) ? trim($_POST['location']) : '';

    if ($job === '' && $location === '') {
        echo json_encode([
            'success' => false,
            'message' => 'Job and location are empty'
        ]);
        exit;
    }

    $jobQuery = '%' . $job . '%';
    $locationQuery = '%' . $location . '%';

    $sql = "
        SELECT *
        FROM Offres_Stage
        WHERE 1=1
    ";

    if ($job !== '') {
        $sql .= " AND (titre LIKE :job OR description LIKE :job)";
    }

    if ($location !== '') {
        $sql .= " AND emplacement LIKE :location";
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $db->prepare($sql);

    if ($job !== '') {
        $stmt->bindParam(':job', $jobQuery, PDO::PARAM_STR);
    }

    if ($location !== '') {
        $stmt->bindParam(':location', $locationQuery, PDO::PARAM_STR);
    }

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


?>


