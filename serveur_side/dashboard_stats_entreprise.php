<?php
require("./Database_init/db_connection.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Get entreprise_id from POST
$entreprise_id = $_POST['entreprise_id'] ?? null;
if (!$entreprise_id) {
    echo json_encode(['success' => false, 'message' => 'Entreprise ID missing']);
    exit;
}

/* ====== 1️⃣ Count active stages ====== */
$stages_stmt = $db->prepare("
    SELECT COUNT(*) AS active_stages
    FROM offres_stage
    WHERE entreprise_id = :entreprise_id
    AND statut = 'Ouverte'
");
$stages_stmt->bindValue(':entreprise_id', $entreprise_id);
$stages_stmt->execute();
$active_stages = $stages_stmt->fetch(PDO::FETCH_ASSOC)['active_stages'];

/* ====== 2️⃣ Count applicants ====== */
$applicants_stmt = $db->prepare("
    SELECT COUNT(*) AS applicants
    FROM Candidatures c
    JOIN offres_stage os ON c.offre_id = os.offre_id
    WHERE os.entreprise_id = :entreprise_id
");
$applicants_stmt->bindValue(':entreprise_id', $entreprise_id);
$applicants_stmt->execute();
$applicants_count = $applicants_stmt->fetch(PDO::FETCH_ASSOC)['applicants'];

/* ====== 3️⃣ Count encadrants ====== */
// Assuming encadrants assigned to stages via Affectation
$encadrants_stmt = $db->prepare("
    SELECT COUNT(DISTINCT e.encadrant_id) AS encadrants_count
    FROM encadrant_account e
    JOIN Affectation a ON e.encadrant_id = a.encadrant_id
    JOIN offres_stage os ON a.offre_id = os.offre_id
    WHERE os.entreprise_id = :entreprise_id
");
$encadrants_stmt->bindValue(':entreprise_id', $entreprise_id);
$encadrants_stmt->execute();
$encadrants_count = $encadrants_stmt->fetch(PDO::FETCH_ASSOC)['encadrants_count'];

/* ====== 4️⃣ Compute ratio ====== */
$ratio = $active_stages > 0 ? round($applicants_count / $active_stages, 2) : 0;

/* ====== 5️⃣ Return JSON ====== */
echo json_encode([
    'success' => true,
    'encadrants_count' => $encadrants_count,
    'active_stages' => $active_stages,
    'applicants_count' => $applicants_count,
    'ratio' => $ratio
]);

?>