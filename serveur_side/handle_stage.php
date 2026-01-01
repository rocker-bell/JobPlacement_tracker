<?php
require "./Database_init/db_connection.php"; // Assuming this file contains the MySQL connection setup.

header("Access-Control-Allow-Origin: http://localhost:5173");  // Allow React app URL
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Generate a UUID v4
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);  // Set version to 4
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);  // Set variant to 10xx
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Get POST data (make sure to sanitize this data to avoid SQL injection)
    $StageId = uuidv4();
    $EntrepriseId = $_POST["entreprise_id"];  // Assuming you will have an entreprise_id to relate to the stage.
    $TypeStage = $_POST["type_stage"];
    $TitreStage = $_POST["titre_stage"];
    $CategorieStage = $_POST["categorie_stage"];
    $DescriptionStage = $_POST["description_stage"];
    $CompetenceStage = $_POST["competence_requise"];
    $DebutStage = $_POST["debut_stage"];
    $DurreStage = $_POST['duree_semaines'];
    $Emplacement = $_POST["emplacement"];
    $NombredePlace = $_POST["nombre_place"];

    // Prepare MySQL query for insertion into the Offres_Stage table
    $stmt = $db->prepare("INSERT INTO Offres_Stage (offre_id, entreprise_id, type_de_stage, titre, stage_categorie, description, competences_requises, date_debut, duree_semaines, nombre_places, emplacement, statut) 
                          VALUES (:offre_id, :entreprise_id, :type_de_stage, :titre, :stage_categorie, :description, :competences_requises, :date_debut, :duree_semaines, :nombre_places, :emplacement, 'Ouverte')");

    // Bind parameters to the prepared statement
    $stmt->bindParam(":offre_id", $StageId);
    $stmt->bindParam(":entreprise_id", $EntrepriseId);
    $stmt->bindParam(":type_de_stage", $TypeStage);
    $stmt->bindParam(":titre", $TitreStage);
    $stmt->bindParam(":stage_categorie", $CategorieStage);
    $stmt->bindParam(":description", $DescriptionStage);
    $stmt->bindParam(":competences_requises", $CompetenceStage);
    $stmt->bindParam(":date_debut", $DebutStage);
    $stmt->bindParam(":duree_semaines", $DurreStage);
    $stmt->bindParam(":nombre_places", $NombredePlace);
    $stmt->bindParam(":emplacement", $Emplacement);

    // Execute the prepared statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Stage added successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to add stage']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}

?>