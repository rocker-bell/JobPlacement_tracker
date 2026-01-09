<?php
require("./Database_init/db_connection.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

$stagiaire_id = $_POST['stagiaire_id'] ?? null;
if (!$stagiaire_id) {
    echo json_encode(['success' => false, 'message' => 'Stagiaire ID missing']);
    exit;
}

try {
    // 1️⃣ Fetch all candidatures of the stagiaire
    $candidatures_stmt = $db->prepare("
        SELECT c.candidature_id, c.offre_id, c.statut 
        FROM Candidatures c
        WHERE c.stagiaire_id = :stagiaire_id
    ");
    $candidatures_stmt->bindValue(':stagiaire_id', $stagiaire_id);
    $candidatures_stmt->execute();
    $candidatures = $candidatures_stmt->fetchAll(PDO::FETCH_ASSOC);

    $total_applications = count($candidatures);
    $accepted_applications = 0;
    $refused_applications = 0;
    $pending_applications = 0;
    $viewed_applications = 0;
    $unviewed_applications = 0;

    // Collect offre_ids for evaluation/affectation checks
    $offre_ids = [];

    foreach ($candidatures as $c) {
        $offre_ids[] = $c['offre_id'];
        switch ($c['statut']) {
            case 'Acceptee': $accepted_applications++; break;
            case 'Refusee': $refused_applications++; break;
            case 'En_attente': $pending_applications++; break;
        }
        if (!empty($c['viewed']) && $c['viewed'] == 1) {
            $viewed_applications++;
        } else {
            $unviewed_applications++;
        }
    }

    // 2️⃣ Count affectations for stagiaire's offres
    if (!empty($offre_ids)) {
        $in_query = implode(',', array_fill(0, count($offre_ids), '?'));

        $affect_stmt = $db->prepare("
            SELECT COUNT(*) AS total_affectations
            FROM Affectation
            WHERE offre_id IN ($in_query)
        ");
        $affect_stmt->execute($offre_ids);
        $total_affectations = (int)$affect_stmt->fetch(PDO::FETCH_ASSOC)['total_affectations'];

        // 3️⃣ Pending evaluations: evaluations for these offres but note_finale is NULL
        $eval_stmt = $db->prepare("
            SELECT COUNT(*) AS pending_evaluations
            FROM evaluations
            WHERE offre_id IN ($in_query)
            AND note_finale IS NULL
        ");
        $eval_stmt->execute($offre_ids);
        $pending_evaluations = (int)$eval_stmt->fetch(PDO::FETCH_ASSOC)['pending_evaluations'];
    } else {
        $total_affectations = 0;
        $pending_evaluations = 0;
    }

    // Return JSON
    echo json_encode([
        'success' => true,
        'total_applications' => $total_applications,
        'accepted_applications' => $accepted_applications,
        'refused_applications' => $refused_applications,
        'pending_applications' => $pending_applications,
        'viewed_applications' => $viewed_applications,
        'unviewed_applications' => $unviewed_applications,
        'total_affectations' => $total_affectations,
        'pending_evaluations' => $pending_evaluations
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
