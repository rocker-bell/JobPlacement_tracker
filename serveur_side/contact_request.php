<?php
header("Content-Type: application/json");

// --- Database config ---
$host = "localhost";
$db   = "your_database_name";
$user = "your_db_user";
$pass = "your_db_password";

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
        ]
    );
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]);
    exit;
}

// --- Read POST data ---
$firstName = trim($_POST['first_name'] ?? '');
$lastName  = trim($_POST['last_name'] ?? '');
$email     = trim($_POST['email'] ?? '');
$contact   = trim($_POST['contact'] ?? '');
$subject   = trim($_POST['subject'] ?? '');

// --- Validation ---
if (
    empty($firstName) ||
    empty($lastName) ||
    empty($email) ||
    empty($subject)
) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Missing required fields"
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Invalid email address"
    ]);
    exit;
}

// --- Insert into DB ---
$sql = "INSERT INTO contact_requests 
        (first_name, last_name, email, contact, subject)
        VALUES (:first_name, :last_name, :email, :contact, :subject)";

$stmt = $pdo->prepare($sql);

try {
    $stmt->execute([
        ":first_name" => $firstName,
        ":last_name"  => $lastName,
        ":email"      => $email,
        ":contact"    => $contact,
        ":subject"    => $subject
    ]);

    echo json_encode([
        "success" => true,
        "message" => "Contact request submitted successfully"
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Failed to save contact request"
    ]);
}
