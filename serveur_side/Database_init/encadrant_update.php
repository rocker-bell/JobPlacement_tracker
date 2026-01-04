<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

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

        // Update Utilisateurs account_status
        $stmt_user = $db->prepare("
            UPDATE Utilisateurs
            SET account_status = 'Active'
            WHERE user_id = :user_id
        ");
        $stmt_user->execute([':user_id' => $encadrant_id]);

        // === New: Check if Affectation table exists, if not create it ===
        $checkTable = $db->query("SHOW TABLES LIKE 'Affectation'");
        $tableExists = $checkTable->rowCount() > 0;

        if (!$tableExists) {
            // Table doesn't exist, create it
            $createTableSQL = "
                CREATE TABLE Affectation (
                    affectation_id INT AUTO_INCREMENT PRIMARY KEY,
                    encadrant_id INT NOT NULL,
                    offre_id INT DEFAULT NULL,
                    affectation_status VARCHAR(50) DEFAULT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
                )
            ";
            $db->exec($createTableSQL);
        }

        // Insert encadrant into Affectation
        $insertAffect = $db->prepare("
            INSERT INTO Affectation (encadrant_id)
            VALUES (:encadrant_id)
        ");
        $insertAffect->execute([':encadrant_id' => $encadrant_id]);

        echo json_encode(['success' => true, 'message' => 'Encadrant updated, account activated, affectation inserted']);

    } else {
        echo json_encode(['success' => false, 'message' => 'Encadrant not found']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
