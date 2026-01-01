<?php 
require "./Database_init/db_connection.php";

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}

if (!isset($_POST["user_id"]) || empty($_POST["user_id"])) {
    echo json_encode(['success' => false, 'message' => 'user_id is required']);
    exit;
}

$user_id = $_POST["user_id"];

try {
    $stmt = $db->prepare("SELECT * FROM StagiaireAccounts WHERE stagiaire_id = :id");
    $stmt->bindParam(":id", $user_id, PDO::PARAM_STR);
    $stmt->execute();
    $userdata = $stmt->fetch(PDO::FETCH_ASSOC);

    // If user doesn’t exist, create a blank stagiaire record
    if (!$userdata) {
        $stmtInsert = $db->prepare("INSERT INTO StagiaireAccounts (stagiaire_id, nom, prenom) VALUES (:id, '', '')");
        $stmtInsert->bindParam(':id', $user_id);
        $stmtInsert->execute();

        $userdata = [
            'stagiaire_id' => $user_id,
            'nom' => '',
            'prenom' => '',
            'cv_path' => null,
            'photo_path' => null
        ];
    }

    echo json_encode([
        'success' => true,
        'message' => 'User data retrieved successfully',
        'user_data' => $userdata
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Database error',
        'error' => $e->getMessage()
    ]);
}
?>
