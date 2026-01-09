<?php
require("./Database_init/db_connection.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$encadrant_id = $_POST['encadrant_id'] ?? null;
if (!$encadrant_id) {
    echo json_encode(['success' => false, 'message' => 'Encadrant ID missing']);
    exit;
}

try {
    /* 1️⃣ Total affectations */
    $stmt = $db->prepare("
        SELECT COUNT(*) AS total_affectations
        FROM affectation
        WHERE encadrant_id = :encadrant_id
    ");
    $stmt->bindValue(':encadrant_id', $encadrant_id);
    $stmt->execute();
    $total_affectations = $stmt->fetch(PDO::FETCH_ASSOC)['total_affectations'];

    /* 2️⃣ Pending evaluations */
    $stmt = $db->prepare("
        SELECT COUNT(*) AS pending_evaluations
        FROM evaluations e
        JOIN affectation a ON e.offre_id = a.offre_id
        WHERE a.encadrant_id = :encadrant_id
        AND e.note_finale IS NULL
    ");
    $stmt->bindValue(':encadrant_id', $encadrant_id);
    $stmt->execute();
    $pending_evaluations = $stmt->fetch(PDO::FETCH_ASSOC)['pending_evaluations'];

    /* 3️⃣ Applicants accepted */
    $stmt = $db->prepare("
        SELECT COUNT(*) AS accepted_applicants
        FROM Candidatures c
        JOIN affectation a ON c.offre_id = a.offre_id
        WHERE a.encadrant_id = :encadrant_id
        AND c.statut = 'Acceptee'
    ");
    $stmt->bindValue(':encadrant_id', $encadrant_id);
    $stmt->execute();
    $accepted_applicants = $stmt->fetch(PDO::FETCH_ASSOC)['accepted_applicants'];

    /* 4️⃣ Applicants refused */
    $stmt = $db->prepare("
        SELECT COUNT(*) AS refused_applicants
        FROM Candidatures c
        JOIN affectation a ON c.offre_id = a.offre_id
        WHERE a.encadrant_id = :encadrant_id
        AND c.statut = 'Refusee'
    ");
    $stmt->bindValue(':encadrant_id', $encadrant_id);
    $stmt->execute();
    $refused_applicants = $stmt->fetch(PDO::FETCH_ASSOC)['refused_applicants'];

    /* 5️⃣ Applicants still pending */
    $stmt = $db->prepare("
        SELECT COUNT(*) AS pending_applicants
        FROM Candidatures c
        JOIN affectation a ON c.offre_id = a.offre_id
        WHERE a.encadrant_id = :encadrant_id
        AND c.statut = 'En_attente'
    ");
    $stmt->bindValue(':encadrant_id', $encadrant_id);
    $stmt->execute();
    $pending_applicants = $stmt->fetch(PDO::FETCH_ASSOC)['pending_applicants'];

    echo json_encode([
        'success' => true,
        'total_affectations' => $total_affectations,
        'pending_evaluations' => $pending_evaluations,
        'accepted_applicants' => $accepted_applicants,
        'refused_applicants' => $refused_applicants,
        'pending_applicants' => $pending_applicants
    ]);

} catch(PDOException $e) {
    echo json_encode(['success'=>false,'message'=>'Database error: '.$e->getMessage()]);
}


?>