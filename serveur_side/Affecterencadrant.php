<?php
// require "./Database_init/db_connection.php";
// header("Access-Control-Allow-Origin: http://localhost:5173");
// header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
// header("Access-Control-Allow-Headers: Content-Type, Authorization");
// header('Content-Type: application/json');

// ini_set('display_errors', 1);
// error_reporting(E_ALL);

// $data = json_decode(file_get_contents("php://input"), true);

// $encadrant_id = $data['encadrant_id'] ?? null;
// $stage_id     = $data['stage_id'] ?? null;
// $status       = $data['affectation_status'] ?? 'Active';

// // UUID generator
// function uuidv4() {
//     $data = random_bytes(16);
//     $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // Set the version to 4
//     $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // Set the variant to RFC4122
//     return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
// }

// $affectation_id = uuidv4();


// if (!$encadrant_id || !$stage_id) {
//     echo json_encode(['success' => false, 'message' => 'encadrant_id and stage_id are required']);
//     exit;
// }


// try {
//     // Check if encadrant is already assigned to this offre
//     $stmtCheck = $db->prepare("
//         SELECT * 
//         FROM Affectation 
//         WHERE encadrant_id = :encadrant_id AND offre_id = :offre_id
//     ");
//     $stmtCheck->execute([
//         ':encadrant_id' => $encadrant_id,
//         ':offre_id' => $stage_id
//     ]);
//     $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

//     if ($existing) {
//         // Already assigned to this stage
//         echo json_encode([
//             'success' => false,
//             'message' => 'This encadrant is already assigned to this stage'
//         ]);
//     } else {
//         // Insert new affectation with a new UUID
//         $affectation_id = uuidv4();
//         $stmtInsert = $db->prepare("
//             INSERT INTO Affectation (affectation_id, encadrant_id, offre_id, affectation_status) 
//             VALUES (:affectation_id, :encadrant_id, :offre_id, :status)
//         ");
//         $stmtInsert->execute([
//             ':affectation_id' => $affectation_id,
//             ':encadrant_id' => $encadrant_id,
//             ':offre_id' => $stage_id,
//             ':status' => $status
//         ]);

//         echo json_encode([
//             'success' => true,
//             'message' => 'Encadrant assigned to stage successfully'
//         ]);
//     }

// } catch (PDOException $e) {
//     echo json_encode([
//         'success' => false,
//         'message' => 'Database error',
//         'error' => $e->getMessage()
//     ]);
// }



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
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

if (!$encadrant_id || !$stage_id) {
    echo json_encode(['success' => false, 'message' => 'encadrant_id and stage_id are required']);
    exit;
}

try {
    // Check if encadrant exists in Affectation (even with empty stage)
    $stmtCheck = $db->prepare("
        SELECT * 
        FROM Affectation 
        WHERE encadrant_id = :encadrant_id
        LIMIT 1
    ");
    $stmtCheck->execute([':encadrant_id' => $encadrant_id]);
    $existing = $stmtCheck->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // If encadrant exists but offre_id is empty/null, update it
        if (empty($existing['offre_id'])) {
            $stmtUpdate = $db->prepare("
                UPDATE Affectation
                SET offre_id = :offre_id, affectation_status = :status, updated_at = NOW()
                WHERE affectation_id = :affectation_id
            ");
            $stmtUpdate->execute([
                ':offre_id' => $stage_id,
                ':status' => $status,
                ':affectation_id' => $existing['affectation_id']
            ]);

            echo json_encode([
                'success' => true,
                'message' => 'Encadrant updated with new stage successfully'
            ]);
        } else {
            // Encadrant already assigned to some stage
            echo json_encode([
                'success' => false,
                'message' => 'This encadrant is already assigned to a stage'
            ]);
        }
    } else {
        // Insert new affectation
        $affectation_id = uuidv4();
        $stmtInsert = $db->prepare("
            INSERT INTO Affectation (affectation_id, encadrant_id, offre_id, affectation_status) 
            VALUES (:affectation_id, :encadrant_id, :offre_id, :status)
        ");
        $stmtInsert->execute([
            ':affectation_id' => $affectation_id,
            ':encadrant_id' => $encadrant_id,
            ':offre_id' => $stage_id,
            ':status' => $status
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Encadrant assigned to stage successfully'
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>



