<?php
require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents("php://input"), true);

$encadrant_id = $data['encadrant_id'] ?? null;
$stage_id     = $data['stage_id'] ?? null;
$status       = $data['affectation_status'] ?? 'Active';

// UUID generator
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // Set the version to 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // Set the variant to RFC4122
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

$affectation_id = uuidv4();


if (!$encadrant_id || !$stage_id) {
    echo json_encode(['success' => false, 'message' => 'encadrant_id and stage_id are required']);
    exit;
}

try {
    // Check if encadrant exists
    $stmtCheck = $db->prepare("SELECT * FROM Affectation WHERE encadrant_id = :encadrant_id");
    $stmtCheck->execute([':encadrant_id' => $encadrant_id]);
    $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

        if ($existing) {
    // Encadrant exists
    if (is_null($existing['offre_id'])) {
        // Generate a new UUID for affectation_id
        $affectation_id = uuidv4();

        // Update existing row with the new stage AND new affectation_id
        $stmtUpdate = $db->prepare("UPDATE Affectation 
                                    SET affectation_id = :affectation_id,
                                        offre_id = :offre_id, 
                                        affectation_status = :status, 
                                        updated_at = NOW()
                                    WHERE encadrant_id = :encadrant_id");
        $stmtUpdate->execute([
            ':affectation_id' => $affectation_id,
            ':offre_id' => $stage_id,
            ':status' => $status,
            ':encadrant_id' => $encadrant_id
        ]);

        echo json_encode(['success' => true, 'message' => 'Encadrant assigned to stage successfully']);
    } else {
        // Already assigned
        echo json_encode(['success' => false, 'message' => 'Failed to assign encadrant: This encadrant is already assigned to a stage']);
    }
}

    else {
        // Insert new row
        
        $stmtInsert = $db->prepare("INSERT INTO Affectation (affectation_id, encadrant_id, offre_id, affectation_status) 
                                    VALUES (:affectation_id, :encadrant_id, :offre_id, :status)");
        $stmtInsert->execute([
            ':affectation_id' => $affectation_id,
            ':encadrant_id' => $encadrant_id,
            ':offre_id' => $stage_id,
            ':status' => $status
        ]);

        echo json_encode(['success' => true, 'message' => 'Encadrant assigned to stage successfully']);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}
