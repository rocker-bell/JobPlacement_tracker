<?php
require("./Database_init/db_connection.php");

// Allow requests from frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Disable output of PHP notices/warnings (optional, for clean JSON)
ini_set('display_errors', 0);
error_reporting(E_ALL);

// Only POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        "success" => false,
        "message" => "Invalid request method"
    ]);
    exit;
}

// Fetch data safely
$input = json_decode(file_get_contents('php://input'), true);

$offre_id = $input['offre_id'] ?? null;
$entreprise_id = $input['entreprise_id'] ?? null;
$type_de_stage = $input['type_de_stage'] ?? null;
$titre = $input['titre'] ?? null;
$stage_categorie = $input['stage_categorie'] ?? null;
$description = $input['description'] ?? null;
$competences_requises = $input['competences_requises'] ?? null;
$date_debut = $input['date_debut'] ?? null;
$duree_semaines = $input['duree_semaines'] ?? null;
$nombre_places = $input['nombre_places'] ?? 1;
$emplacement = $input['emplacement'] ?? null;
$statut = $input['statut'] ?? 'Ouverte';


// Validate required fields
$required = [
    'offre_id' => $offre_id,
    'entreprise_id' => $entreprise_id,
    'type_de_stage' => $type_de_stage,
    'titre' => $titre,
    'stage_categorie' => $stage_categorie,
    'description' => $description
];

foreach ($required as $field => $value) {
    if (!$value) {
        echo json_encode([
            "success" => false,
            "message" => "Missing required field: $field"
        ]);
        exit;
    }
}

try {
    $stmt = $db->prepare("
        UPDATE Offres_Stage 
        SET 
            type_de_stage = :type_de_stage,
            titre = :titre,
            stage_categorie = :stage_categorie,
            description = :description,
            competences_requises = :competences_requises,
            date_debut = :date_debut,
            duree_semaines = :duree_semaines,
            nombre_places = :nombre_places,
            emplacement = :emplacement,
            statut = :statut,
            updated_at = NOW()
        WHERE 
            offre_id = :offre_id AND entreprise_id = :entreprise_id
    ");

    // Bind variables
    $stmt->bindParam(':type_de_stage', $type_de_stage);
    $stmt->bindParam(':titre', $titre);
    $stmt->bindParam(':stage_categorie', $stage_categorie);
    $stmt->bindParam(':description', $description);
    $stmt->bindParam(':competences_requises', $competences_requises);
    $stmt->bindParam(':date_debut', $date_debut);
    $stmt->bindParam(':duree_semaines', $duree_semaines);
    $stmt->bindParam(':nombre_places', $nombre_places);
    $stmt->bindParam(':emplacement', $emplacement);
    $stmt->bindParam(':statut', $statut);
    $stmt->bindParam(':offre_id', $offre_id);
    $stmt->bindParam(':entreprise_id', $entreprise_id);

    $stmt->execute();

    echo json_encode([
        "success" => true,
        "message" => "Stage mis à jour avec succès"
    ]);
} catch (PDOException $e) {
    echo json_encode([
        "success" => false,
        "message" => "Database error: " . $e->getMessage()
    ]);
}
