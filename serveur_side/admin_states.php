<?php
// require("./Database_init/db_connection.php");

// header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
// header("Access-Control-Allow-Headers: Content-Type");
// header("Content-Type: application/json");

// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// /* ====== 1️⃣ Count stages by status ====== */
// $stages_stmt = $db->prepare("
//     SELECT
//         COALESCE(SUM(CASE WHEN statut = 'Ouverte' THEN 1 ELSE 0 END), 0) AS ouverte_count,
//         COALESCE(SUM(CASE WHEN statut = 'Fermée' THEN 1 ELSE 0 END), 0) AS fermee_count,
//         COALESCE(SUM(CASE WHEN statut = 'Expirée' THEN 1 ELSE 0 END), 0) AS expiree_count
//     FROM offres_stage
// ");
// $stages_stmt->execute();
// $stages_counts = $stages_stmt->fetch(PDO::FETCH_ASSOC);

// /* ====== 2️⃣ Count all applicants ====== */
// $applicants_stmt = $db->prepare("
//     SELECT COUNT(*) AS applicants
//     FROM Candidatures c
//     JOIN offres_stage os ON c.offre_id = os.offre_id
// ");
// $applicants_stmt->execute();
// $applicants_count = $applicants_stmt->fetch(PDO::FETCH_ASSOC)['applicants'];

// /* offre stage */

// $StageOffre_stmt = $db->prepare(
//     "   
//         SELECT COUNT(*) AS total_Stageoffres
//         FROM offres_stage
//     "
// );
// $StageOffre_stmt->execute();
// $StageOffre_count = $StageOffre_stmt->fetch(PDO::FETCH_ASSOC)['total_Stageoffres'];

// // verifiedAccounts


// $VerifiiedUsers_stmt =  $db->prepare(
//     "
//         select count(*) from Utilisateurs where account_status = 'Verified'
//     "


// );
// $VerifiiedUsers_stmt->execute();
// $VerifiiedUsers_count = $VerifiiedUsers_stmt->fetch(PDO::FETCH_ASSOC)['total_Stageoffres'];

// // Active Accounts

// $ActiveAccounts_stmt =  $db->prepare(
//     "
//         SELECT COUNT(DISTINCT u.user_id) AS active_accounts
//             FROM Utilisateurs u
//         JOIN UserConnections co ON co.user_id = u.user_id
//         WHERE u.account_status = 'Verified' AND co.disconnected_at IS NULL

//     "


// );
// $VerifiiedUsers_stmt->execute();
// $$VerifiiedUsers_count = $VerifiiedUsers_stmt->fetch(PDO::FETCH_ASSOC)['total_Stageoffres'];


// /* ====== 3️⃣ Count all encadrants ====== */
// $encadrants_stmt = $db->prepare("
//     SELECT COUNT(DISTINCT e.encadrant_id) AS encadrants_count
//     FROM encadrants e
//     JOIN Affectation a ON e.encadrant_id = a.encadrant_id
//     JOIN offres_stage os ON a.offre_id = os.offre_id
// ");
// $encadrants_stmt->execute();
// $encadrants_count = $encadrants_stmt->fetch(PDO::FETCH_ASSOC)['encadrants_count'];

// /* ====== 4️⃣ Compute ratio ====== */
// $active_stages = (int)$stages_counts['ouverte_count'];
// $ratio = $active_stages > 0 ? round($applicants_count / $active_stages, 2) : 0;

// /* ====== 5️⃣ Return JSON ====== */
// echo json_encode([
//     'success' => true,
//     'stages' => [
//         'ouverte' => (int)$stages_counts['ouverte_count'],
//         'fermee' => (int)$stages_counts['fermee_count'],
//         'expiree' => (int)$stages_counts['expiree_count'],
//     ],
//     'encadrants_count' => (int)$encadrants_count,
//     'applicants_count' => (int)$applicants_count,
//     'ratio' => $ratio
// ]);


require("./Database_init/db_connection.php");

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

/* ====== 1️⃣ Count stages by status ====== */
$stages_stmt = $db->prepare("
    SELECT
        COALESCE(SUM(CASE WHEN statut = 'Ouverte' THEN 1 ELSE 0 END), 0) AS ouverte_count,
        COALESCE(SUM(CASE WHEN statut = 'Fermée' THEN 1 ELSE 0 END), 0) AS fermee_count,
        COALESCE(SUM(CASE WHEN statut = 'Expirée' THEN 1 ELSE 0 END), 0) AS expiree_count
    FROM offres_stage
");
$stages_stmt->execute();
$stages_counts = $stages_stmt->fetch(PDO::FETCH_ASSOC);

/* ====== 2️⃣ Count all applicants ====== */
$applicants_stmt = $db->prepare("
    SELECT COUNT(*) AS applicants
    FROM Candidatures c
    JOIN offres_stage os ON c.offre_id = os.offre_id
");
$applicants_stmt->execute();
$applicants_count = (int)$applicants_stmt->fetch(PDO::FETCH_ASSOC)['applicants'];

/* ====== 3️⃣ Count total stage offers ====== */
$StageOffre_stmt = $db->prepare("SELECT COUNT(*) AS total_Stageoffres FROM offres_stage");
$StageOffre_stmt->execute();
$StageOffre_count = (int)$StageOffre_stmt->fetch(PDO::FETCH_ASSOC)['total_Stageoffres'];

/* ====== 4️⃣ Count verified accounts ====== */
$VerifiedUsers_stmt = $db->prepare("
    SELECT COUNT(*) AS verified_users
    FROM Utilisateurs
    WHERE account_status = 'Verified'
");
$VerifiedUsers_stmt->execute();
$VerifiedUsers_count = (int)$VerifiedUsers_stmt->fetch(PDO::FETCH_ASSOC)['verified_users'];

/* ====== 5️⃣ Count active accounts (currently connected) ====== */
$ActiveAccounts_stmt = $db->prepare("
   SELECT COUNT(DISTINCT u.user_id) AS active_accounts
FROM Utilisateurs u
JOIN UserConnections co ON co.user_id = u.user_id
WHERE u.account_status = 'Verified' 
  AND co.connect_at IS NOT NULL
  AND co.disconnected_at IS NULL;

");
$ActiveAccounts_stmt->execute();
$ActiveAccounts_count = (int)$ActiveAccounts_stmt->fetch(PDO::FETCH_ASSOC)['active_accounts'];

/* ====== 6️⃣ Count all encadrants ====== */
$encadrants_stmt = $db->prepare("
    SELECT COUNT(DISTINCT e.encadrant_id) AS encadrants_count
    FROM encadrant_account e
    JOIN Affectation a ON e.encadrant_id = a.encadrant_id
    JOIN offres_stage os ON a.offre_id = os.offre_id
");
$encadrants_stmt->execute();
$encadrants_count = (int)$encadrants_stmt->fetch(PDO::FETCH_ASSOC)['encadrants_count'];

/* ====== 7️⃣ Compute ratio ====== */
$active_stages = (int)$stages_counts['ouverte_count'];
$ratio = $active_stages > 0 ? round($applicants_count / $active_stages, 2) : 0;

/* ====== 8️⃣ Return JSON ====== */
echo json_encode([
    'success' => true,
    'stages' => [
        'ouverte' => (int)$stages_counts['ouverte_count'],
        'fermee' => (int)$stages_counts['fermee_count'],
        'expiree' => (int)$stages_counts['expiree_count'],
    ],
    'encadrants_count' => $encadrants_count,
    'applicants_count' => $applicants_count,
    'ratio' => $ratio,
    'total_stage_offres' => $StageOffre_count,
    'verified_users' => $VerifiedUsers_count,
    'active_accounts' => $ActiveAccounts_count
]);


?>
