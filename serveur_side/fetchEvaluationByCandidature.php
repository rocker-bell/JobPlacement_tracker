<?php
require "./Database_init/db_connection.php";
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$data = json_decode(file_get_contents("php://input"), true);
$candidature_id = $data['candidature_id'] ?? null;
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40); // Set the version to 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80); // Set the variant to RFC4122
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}


if (!$candidature_id) {
    echo json_encode(['success' => false, 'message' => 'candidature_id is required']);
    exit;
}

try {
    $stmt = $db->prepare("SELECT * FROM Evaluations WHERE candidature_id = :candidature_id");
    $stmt->execute([':candidature_id' => $candidature_id]);
    $evaluation = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($evaluation) {
        echo json_encode(['success' => true, 'evaluation' => $evaluation]);
    } else {
        // No evaluation yet, return empty but include the candidature_id
        echo json_encode([
            'success' => true,
            'evaluation' => [
                'evaluation_id' => uuidv4(),
                'candidature_id' => $candidature_id,
                'offre_id' => null,
                'note_entreprise' => null,
                'commentaire_entreprise' => '',
                'note_pedagogique' => null,
                'commentaire_pedagogique' => '',
                'encadrant_pedagogique' => '',
                'note_finale' => null
            ]
        ]);
    }

} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error', 'error' => $e->getMessage()]);
}

?>