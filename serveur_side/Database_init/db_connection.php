<?php



$hostname = "localhost";
$username = "root";
$password = "admin";
$port = 3306;
$dbname = "JOBCONNECT";

try {
    // 1️⃣ Connect to MySQL server (no database yet)
    $dsn = "mysql:host=$hostname;port=$port;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 2️⃣ Create database
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");

    // 3️⃣ Connect to the database
    $dsnDb = "mysql:host=$hostname;port=$port;dbname=$dbname;charset=utf8mb4";
    $db = new PDO($dsnDb, $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // echo "Database created and connected successfully.";

} catch (PDOException $e) {
    die("DATABASE ERROR: " . $e->getMessage());
}


?>