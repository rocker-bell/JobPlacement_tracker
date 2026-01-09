<?php

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

ini_set('display_errors', 1);
error_reporting(E_ALL);

require "./Database_init/db_connection.php";

/* =========================
   PHPMailer includes
========================= */
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require './PHPMailer/Exception.php';
require './PHPMailer/PHPMailer.php';
require './PHPMailer/SMTP.php';

/* =========================
   UUID v4 generator
========================= */
function uuidv4() {
    $data = random_bytes(16);
    $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
    $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

/* =========================
   Send verification email
========================= */
function sendVerificationEmail($toEmail, $username, $token) {
    $mail = new PHPMailer(true);

    try {
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'rockbell8@gmail.com';     // <-- CHANGE
        $mail->Password   = 'iucb ercv ugme czsm';// <-- APP PASSWORD
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port       = 587;

        $mail->setFrom('rockbell8@gmail.com', 'phpmail');
        $mail->addAddress($toEmail, $username);

        $verifyLink = "http://localhost:5173/verify?token={$token}";

        $mail->isHTML(true);
        $mail->Subject = 'Verify your email';
        $mail->Body = "
            <h2>Hello {$username}</h2>
            <p>Please verify your email by clicking the link below:</p>
            <a href='{$verifyLink}'>Verify Email</a>
            <p>This link will expire in 24 hours.</p>
        ";
        $mail->AltBody = "Hello {$username}, verify your email: {$verifyLink}";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return $mail->ErrorInfo;
    }
}

/* =========================
   Read JSON input
========================= */
$data = json_decode(file_get_contents("php://input"), true);

$username     = trim($data['username'] ?? '');
$email        = trim($data['email'] ?? '');
$phonenumber  = trim($data['registerPhoneNumber'] ?? '');
$password     = $data['password'] ?? '';
$role         = $data['role'] ?? 'Stagiaire';

if (!$username || !$email || !$password || !$phonenumber) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

/* =========================
   Uniqueness checks
========================= */
$checkEmail = $db->prepare("SELECT 1 FROM Utilisateurs_ WHERE email = :email");
$checkEmail->execute([':email' => $email]);
if ($checkEmail->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

$checkUsername = $db->prepare("SELECT 1 FROM Utilisateurs_ WHERE username = :username");
$checkUsername->execute([':username' => $username]);
if ($checkUsername->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Username already taken']);
    exit;
}

/* =========================
   Create verification token
========================= */
$verificationToken = bin2hex(random_bytes(32));
$expiresAt = date('Y-m-d H:i:s', strtotime('+24 hours'));

/* =========================
   Insert user with Pending status
========================= */
$user_id   = uuidv4();
$createdAt = date('Y-m-d H:i:s');
$hash      = password_hash($password, PASSWORD_DEFAULT);

$stmt = $db->prepare("
    INSERT INTO Utilisateurs_ (
        user_id, email, username, password_hash,
        telephone, role, account_status, verification_token, 
        token_created_at, token_expires_at, created_at, updated_at
    ) VALUES (
        :user_id, :email, :username, :password_hash,
        :telephone, :role, :account_status, :verification_token, 
        :token_created_at, :token_expires_at, :created_at, :updated_at
    )
");

$stmt->execute([
    ':user_id'        => $user_id,
    ':email'          => $email,
    ':username'       => $username,
    ':password_hash'  => $hash,
    ':telephone'      => $phonenumber,
    ':role'           => $role,
    ':account_status' => 'Pending',
    ':verification_token' => $verificationToken,
    ':token_created_at' => $createdAt,
    ':token_expires_at' => $expiresAt,
    ':created_at'     => $createdAt,
    ':updated_at'     => $createdAt
]);

/* =========================
   Send verification email
========================= */
$emailResult = sendVerificationEmail($email, $username, $verificationToken);

/* =========================
   Response to frontend
========================= */
echo json_encode([
    'success'     => true,
    'message'     => 'Registration successful. Please check your email to verify your account.',
    'email_sent'  => $emailResult === true,
    'user_id'     => $user_id
]);
