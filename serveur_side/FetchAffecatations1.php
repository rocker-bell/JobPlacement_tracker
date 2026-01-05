<?php

require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        'success' => false,
        'message' => 'Méthode non autorisée'
    ]);
    exit;
}

if (!isset($_POST["encadrant_id"])) {
    echo json_encode([
        'success' => false,
        'message' => 'encadrant_id manquant'
    ]);
    exit;
}

$encadrant_id = $_POST["encadrant_id"];

try {
    $stmt = $db->prepare("
        SELECT *
        FROM affectation
        WHERE encadrant_id = :encadrant_id
    ");

    $stmt->bindParam(":encadrant_id", $encadrant_id);
    $stmt->execute();

    $affectation = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$affectation) {
        echo json_encode([
            'success' => false,
            'message' => 'Aucune affectation trouvée'
        ]);
        exit;
    }

    echo json_encode([
        'success' => true,
        'message' => 'Affectation récupérée avec succès',
        'user_data' => $affectation
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Erreur serveur',
        'error' => $e->getMessage()
    ]);
}
