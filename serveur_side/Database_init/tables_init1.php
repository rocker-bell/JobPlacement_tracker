<?php
require "./Database_init/db_connection.php"; 


header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);


$affectation = "CREATE TABLE IF NOT EXISTS affectation (
    affectation_id char(36) DEFAULT NULL,
    encadrant_id char(36) DEFAULT NULL,
    offre_id char(36) DEFAULT NULL,
    affectation_status varchar(50) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE (affectation_id),
    KEY (encadrant_id)
);";

$candidatures = "CREATE TABLE IF NOT EXISTS candidatures (
    candidature_id char(36) NOT NULL,
    stagiaire_id char(36) NOT NULL,
    offre_id char(36) NOT NULL,
    statut enum('En_attente','Acceptee','Refusee') DEFAULT 'En_attente',
    message_motivation text,
    cv_path varchar(255) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (candidature_id),
    KEY (stagiaire_id),
    KEY (offre_id)
);";

$contact_request = "CREATE TABLE IF NOT EXISTS contact_request (
    contact_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(150) NOT NULL,
    contact varchar(30) DEFAULT NULL,
    subject varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contact_id)
);";

$encadrant_account = "CREATE TABLE IF NOT EXISTS encadrant_account (
    contact_id int NOT NULL AUTO_INCREMENT,
    first_name varchar(100) NOT NULL,
    last_name varchar(100) NOT NULL,
    email varchar(150) NOT NULL,
    contact varchar(30) DEFAULT NULL,
    subject varchar(255) NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (contact_id)
);";

$entreprise_account = "CREATE TABLE IF NOT EXISTS entreprise_account (
    entreprise_id char(36) NOT NULL,
    email varchar(255) NOT NULL,
    username varchar(50) NOT NULL,
    password_hash varchar(255) NOT NULL,
    telephone varchar(20) DEFAULT NULL,
    role enum('Stagiaire','Entreprise','Encadrant','Admin') NOT NULL DEFAULT 'Stagiaire',
    account_status enum('Pending','Active','Verified','Blocked') NOT NULL DEFAULT 'Pending',
    nom_entreprise varchar(150) DEFAULT NULL,
    description text,
    adresse varchar(255) DEFAULT NULL,
    logo_path varchar(255) DEFAULT NULL,
    site_web varchar(255) DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date date DEFAULT NULL,
    PRIMARY KEY (entreprise_id),
    UNIQUE (email),
    UNIQUE (username),
    UNIQUE (nom_entreprise)
);";

$evaluations = "CREATE TABLE IF NOT EXISTS evaluations (
    evaluation_id char(36) NOT NULL,
    offre_id char(36) NOT NULL,
    candidature_id char(36) NOT NULL,
    note_entreprise decimal(4,2) DEFAULT NULL,
    commentaire_entreprise text,
    note_pedagogique decimal(4,2) DEFAULT NULL,
    commentaire_pedagogique text,
    encadrant_pedagogique varchar(100) DEFAULT NULL,
    note_finale decimal(4,2) DEFAULT NULL,
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (evaluation_id),
    KEY (offre_id),
    KEY (candidature_id)
);";

$offres_stage = "CREATE TABLE IF NOT EXISTS offres_stage (
    offre_id char(36) NOT NULL,
    entreprise_id char(36) NOT NULL,
    type_de_stage varchar(100) DEFAULT NULL,
    titre varchar(200) NOT NULL,
    stage_categorie varchar(100) NOT NULL,
    description text NOT NULL,
    competences_requises text,
    date_debut date DEFAULT NULL,
    duree_semaines int DEFAULT NULL,
    nombre_places int DEFAULT 1,
    emplacement varchar(100) DEFAULT NULL,
    statut enum('Ouverte','Fermée','Expirée') DEFAULT 'Ouverte',
    created_at datetime DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (offre_id),
    KEY (entreprise_id)
);";

$stagiaire_accounts = "CREATE TABLE IF NOT EXISTS stagiaire_accounts (
    stagiaire_id char(36) NOT NULL,
    email varchar(255) NOT NULL,
    username varchar(50) NOT NULL,
    password_hash varchar(255) NOT NULL,
    telephone varchar(20) DEFAULT NULL,
    role enum('Stagiaire','Entreprise','Encadrant','Admin') NOT NULL DEFAULT 'Stagiaire',
    account_status enum('Pending','Active','Verified','Blocked') NOT NULL DEFAULT 'Pending',
    nom varchar(100) NOT NULL,
    prenom varchar(100) NOT NULL,
    cv_path varchar(255) DEFAULT NULL,
    photo_path varchar(255) DEFAULT NULL,
    emplacement varchar(200) DEFAULT NULL,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date date DEFAULT NULL,
    PRIMARY KEY (stagiaire_id),
    UNIQUE (email),
    UNIQUE (username)
);";

$userconnections = "CREATE TABLE IF NOT EXISTS userconnections (
    id char(36) NOT NULL DEFAULT (uuid()),
    user_id char(36) NOT NULL,
    connect_at datetime NOT NULL,
    disconnected_at datetime DEFAULT NULL,
    ip_address varchar(45) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY (user_id)
);";

$utilisateurs = "CREATE TABLE IF NOT EXISTS utilisateurs (
    user_id char(36) NOT NULL,
    email varchar(255) NOT NULL,
    username varchar(50) NOT NULL,
    password_hash varchar(255) NOT NULL,
    telephone varchar(20) DEFAULT NULL,
    role enum('Stagiaire','Entreprise','Encadrant','Admin') NOT NULL DEFAULT 'Stagiaire',
    account_status enum('Pending','Active','Verified','Blocked') NOT NULL DEFAULT 'Pending',
    verification_token char(64) DEFAULT NULL,
    token_created_at datetime DEFAULT NULL,
    token_expires_at datetime DEFAULT NULL,
    token_used tinyint(1) DEFAULT 0,
    created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id),
    UNIQUE (email),
    UNIQUE (username),
    UNIQUE (verification_token)
);";

$bookmark = '
CREATE TABLE IF NOT EXISTS bookmark (
    bookmark_id CHAR(36) NOT NULL PRIMARY KEY,
    bookmark_user CHAR(36) NOT NULL,
    offre_id CHAR(36) NOT NULL,
    type ENUM(\'Bookmark\', \'none\') DEFAULT \'none\',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bookmark_user) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
    FOREIGN KEY (offre_id) REFERENCES offres_stage(offre_id) ON DELETE CASCADE
)';

$Notifications = "
CREATE TABLE IF NOT EXISTS notifications (
    notification_id CHAR(36) NOT NULL,
    notification_content VARCHAR(255) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (notification_id),
    CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES utilisateurs(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_receiver FOREIGN KEY (receiver_id) REFERENCES utilisateurs(user_id) ON DELETE CASCADE
);";

$Subscribe = "
    CREATE TABLE subscribe (
    subscribe_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


"

// --- EXECUTION ---
$tables = [
    $affectation,
    $candidatures,
    $contact_request,
    $encadrant_account,
    $entreprise_account,
    $evaluations,
    $offres_stage,
    $stagiaire_accounts,
    $userconnections,
    $utilisateurs,
    $Notifications
];

try {
    if (isset($db)) {
        foreach ($tables as $sql) {
            $db->exec($sql);
        }
        echo "Toutes les tables ont été créées avec succès.<br>";
    }

    // --- INSERT EXAMPLE ---
    $uuid = generateUuid(); 
    
    $sql = "INSERT INTO utilisateurs (user_id, email, username, password_hash, role) 
            VALUES (:id, :email, :user, :pass, :role)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':id' => $uuid,
        ':email' => 'test_' . time() . '@domain.com',
        ':user' => 'user_' . time(),
        ':pass' => password_hash('password', PASSWORD_DEFAULT),
        ':role' => 'Stagiaire'
    ]);
    
    echo "Utilisateur test inséré ID: " . $uuid;

} catch (PDOException $e) {
    die("Erreur SQL : " . $e->getMessage());
}

function generateUuid() {
    return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
}
?>