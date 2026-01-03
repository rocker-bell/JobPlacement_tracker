<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

// Get POST data
$encadrant_id     = $_POST['encadrant_id'] ?? null;
$nom              = $_POST['nom'] ?? null;
$prenom           = $_POST['prenom'] ?? null;
$agence_id        = $_POST['agence_id'] ?? null;
$nom_d_agence     = $_POST['nom_d_agence'] ?? null;
$departement      = $_POST['departement'] ?? null;
$status_d_encadrant = "Active";

if (!$encadrant_id) {
    echo json_encode(['success' => false, 'message' => 'encadrant_id required']);
    exit;
}

try {
    // Check if encadrant exists
    $stmt_check = $db->prepare("SELECT * FROM Encadrants WHERE encadrant_id = :encadrant_id");
    $stmt_check->bindParam(':encadrant_id', $encadrant_id);
    $stmt_check->execute();
    $existing = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // Update existing encadrant
        $stmt_update = $db->prepare("
            UPDATE Encadrants
            SET nom = :nom,
                prenom = :prenom,
                agence_id = :agence_id,
                nom_d_agence = :nom_d_agence,
                departement = :departement,
                status_d_encadrant = :status_d_encadrant
            WHERE encadrant_id = :encadrant_id
        ");

        $stmt_update->execute([
            ':nom' => $nom,
            ':prenom' => $prenom,
            ':agence_id' => $agence_id,
            ':nom_d_agence' => $nom_d_agence,
            ':departement' => $departement,
            ':status_d_encadrant' => $status_d_encadrant,
            ':encadrant_id' => $encadrant_id
        ]);

        // ✅ Set account_status in Utilisateurs to 'Active'
        $stmt_user = $db->prepare("
            UPDATE Utilisateurs
            SET account_status = 'Active'
            WHERE user_id = :user_id
        ");
        $stmt_user->execute([':user_id' => $encadrant_id]);

        echo json_encode(['success' => true, 'message' => 'Encadrant updated and account activated']);

    } else {
        echo json_encode(['success' => false, 'message' => 'Encadrant not found']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
