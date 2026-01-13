<?php

require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);


$offre_id = $data['offre_id'] ?? null; // ex: $_GET['offre_id']

$sql = "SELECT note_finale FROM evaluations WHERE offre_id = :offre_id";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':offre_id', $offre_id);
$stmt->execute();

$result = $stmt->fetch(PDO::FETCH_ASSOC);

if ($result) {
    echo "Note finale : " . $result['note_finale'];
} else {
    echo "Aucune évaluation trouvée.";
}
?>
