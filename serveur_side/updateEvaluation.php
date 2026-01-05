<?php
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Treat empty strings as null
$evaluation_id = (isset($data['evaluation_id']) && trim($data['evaluation_id']) !== '') ? $data['evaluation_id'] : null;
$candidature_id = $data['candidature_id'] ?? null;
$offre_id = $data['offre_id'] ?? null;
$note_entreprise = $data['note_entreprise'] !== "" ? $data['note_entreprise'] : null;
$commentaire_entreprise = $data['commentaire_entreprise'] ?? '';
$note_pedagogique = $data['note_pedagogique'] !== "" ? $data['note_pedagogique'] : null;
$commentaire_pedagogique = $data['commentaire_pedagogique'] ?? '';
$encadrant_pedagogique = $data['encadrant_pedagogique'] ?? '';
$note_finale = $data['note_finale'] !== "" ? $data['note_finale'] : null;

if (!$candidature_id || !$offre_id) {
    echo json_encode([
        'success' => false,
        'message' => 'candidature_id and offre_id are required'
    ]);
    exit;
}

// UUID v4 generator
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

try {
    // Check if evaluation exists
    $stmt = $db->prepare("SELECT * FROM evaluations WHERE candidature_id = :candidature_id");
    $stmt->execute([':candidature_id' => $candidature_id]);
    $existing = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // Update existing evaluation
        $evalId = $existing['evaluation_id'];
        $update = $db->prepare("
            UPDATE evaluations SET
                note_entreprise = :note_entreprise,
                commentaire_entreprise = :commentaire_entreprise,
                note_pedagogique = :note_pedagogique,
                commentaire_pedagogique = :commentaire_pedagogique,
                encadrant_pedagogique = :encadrant_pedagogique,
                note_finale = :note_finale,
                updated_at = NOW()
            WHERE evaluation_id = :evaluation_id
        ");
        $update->execute([
            ':note_entreprise' => $note_entreprise,
            ':commentaire_entreprise' => $commentaire_entreprise,
            ':note_pedagogique' => $note_pedagogique,
            ':commentaire_pedagogique' => $commentaire_pedagogique,
            ':encadrant_pedagogique' => $encadrant_pedagogique,
            ':note_finale' => $note_finale,
            ':evaluation_id' => $evalId
        ]);

        // Fetch updated row
        $stmt->execute([':candidature_id' => $candidature_id]);
        $evaluation = $stmt->fetch(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => true,
            'message' => 'Evaluation updated successfully',
            'evaluation' => $evaluation
        ]);
        exit;
    }

    // Create new evaluation
    $evaluation_id = uuidv4();
    $insert = $db->prepare("
        INSERT INTO evaluations (
            evaluation_id,
            candidature_id,
            offre_id,
            note_entreprise,
            commentaire_entreprise,
            note_pedagogique,
            commentaire_pedagogique,
            encadrant_pedagogique,
            note_finale,
            created_at,
            updated_at
        ) VALUES (
            :evaluation_id,
            :candidature_id,
            :offre_id,
            :note_entreprise,
            :commentaire_entreprise,
            :note_pedagogique,
            :commentaire_pedagogique,
            :encadrant_pedagogique,
            :note_finale,
            NOW(),
            NOW()
        )
    ");
    $insert->execute([
        ':evaluation_id' => $evaluation_id,
        ':candidature_id' => $candidature_id,
        ':offre_id' => $offre_id,
        ':note_entreprise' => $note_entreprise,
        ':commentaire_entreprise' => $commentaire_entreprise,
        ':note_pedagogique' => $note_pedagogique,
        ':commentaire_pedagogique' => $commentaire_pedagogique,
        ':encadrant_pedagogique' => $encadrant_pedagogique,
        ':note_finale' => $note_finale
    ]);

    // Fetch the newly created evaluation
    $stmt->execute([':candidature_id' => $candidature_id]);
    $evaluation = $stmt->fetch(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'message' => 'Evaluation created successfully',
        'evaluation' => $evaluation
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
