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

// $input = json_decode(file_get_contents("php://input"), true);
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
    // ✅ Correct SQL
    $stmt = $db->prepare("
        SELECT * 
        FROM Utilisateurs 
        WHERE user_id = :id
    ");

    // ✅ Correct bindParam
    $stmt->bindParam(":id", $user_id, PDO::PARAM_STR);

    $stmt->execute();
    $userdata = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($userdata) {
        echo json_encode([
            'success' => true,
            'message' => 'User data retrieved successfully',
            'user_data' => $userdata
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'User not found'
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
