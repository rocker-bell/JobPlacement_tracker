<?php 
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// ✅ Check request method correctly
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
    exit;
}

// ✅ Validate input
if (!isset($_POST["user_id"]) || empty($_POST["user_id"])) {
    echo json_encode([
        'success' => false,
        'message' => 'user_id is required'
    ]);
    exit;
}

$user_id = $_POST["user_id"];

try {
    // 1️⃣ Check if user exists in Utilisateurs
    $stmt = $db->prepare("SELECT * FROM Utilisateurs WHERE user_id = :id");
    $stmt->bindParam(":id", $user_id, PDO::PARAM_STR);
    $stmt->execute();
    $userdata = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$userdata) {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
        ]);
        exit;
    }

    // 2️⃣ Check if user already has a StagiaireAccounts entry
    $stmt_check = $db->prepare("SELECT * FROM StagiaireAccounts WHERE stagiaire_id = :id");
    $stmt_check->bindParam(":id", $user_id, PDO::PARAM_STR);
    $stmt_check->execute();
    $stagiaire = $stmt_check->fetch(PDO::FETCH_ASSOC);

    if (!$stagiaire) {
        // ✅ Insert new row with default values
        $stmt_insert = $db->prepare("
            INSERT INTO StagiaireAccounts (stagiaire_id, nom, prenom, cv_path, photo_path)
            VALUES (:id, :nom, :prenom, :cv_path, :photo_path)
        ");
        $defaultNom = "Unknown";
        $defaultPrenom = "Unknown";
        $stmt_insert->bindParam(":id", $user_id, PDO::PARAM_STR);
        $stmt_insert->bindParam(":nom", $defaultNom, PDO::PARAM_STR);
        $stmt_insert->bindParam(":prenom", $defaultPrenom, PDO::PARAM_STR);
        $stmt_insert->bindValue(":cv_path", null, PDO::PARAM_NULL);
        $stmt_insert->bindValue(":photo_path", null, PDO::PARAM_NULL);
        $stmt_insert->execute();

        $stagiaire = [
            "stagiaire_id" => $user_id,
            "nom" => $defaultNom,
            "prenom" => $defaultPrenom,
            "cv_path" => null,
            "photo_path" => null
        ];
    }

    echo json_encode([
        'success' => true,
        'message' => 'User organized into StagiaireAccounts successfully',
        'user_data' => $userdata,
        'stagiaire_data' => $stagiaire
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>
