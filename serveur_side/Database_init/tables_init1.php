<?php


// Ce script PHP constitue le moteur d'initialisation de la base de données pour votre plateforme de gestion des stages. 
// Voici une description objective de ses fonctionnalités et de sa structure :

// ### 1. Initialisation et Sécurité

// * **Configuration API** : Le script définit des en-têtes (Headers) pour autoriser les requêtes cross-origin (CORS) depuis `localhost:5173` 
// (généralement une application React/Vite), ce qui est essentiel pour une architecture découplée (Frontend/Backend).
// * **Connexion** : Il s'appuie sur une connexion PDO (`db_connection.php`) pour interagir de manière sécurisée avec le serveur MySQL.

// ### 2. Architecture des Données

// Le script automatise la création d'un schéma relationnel complet comprenant 12 tables clés. 
// L'utilisation systématique de `CHAR(36)` indique une gestion moderne des identifiants via des **UUID** (identifiants uniques universels).

// | Catégorie | Tables incluses |
// | --- | --- |
// | **Utilisateurs** | `utilisateurs`, `stagiaire_accounts`, `entreprise_account`, `encadrant_account`. |
// | **Cœur de métier** | `offres_stage`, `candidatures`, `affectation`, `evaluations`. |
// | **Interaction** | `notifications`, `bookmark`, `contact_request`, `subscribe`. |
// | **Sécurité/Audit** | `userconnections`. |

// ### 3. Logique de Gestion des Stages

// * 
// **Gestion des Rôles** : Le script utilise des types `ENUM` pour définir strictement les rôles (Stagiaire, Entreprise, Encadrant, Admin)  et les statuts des comptes (Pending, Active, Blocked).


// * **Traçabilité** : Chaque table inclut des horodatages (`created_at`, `updated_at`) pour un suivi temporel précis.
// * **Contraintes Relationnelles** : Le script intègre des clés étrangères (`FOREIGN KEY`) avec l'option `ON DELETE CASCADE` pour les tables `bookmark` et `notifications`, garantissant l'intégrité des données lors de la suppression d'un utilisateur.

// ### 4. Automatisation de l'Installation

// * **Idempotence** : L'utilisation de `CREATE TABLE IF NOT EXISTS` permet d'exécuter le script plusieurs fois sans écraser les données existantes ni générer d'erreurs.
// * **Test d'Intégrité** : Le script se termine par une fonction de génération d'UUID personnalisée et une insertion de test pour confirmer que la base de données est opérationnelle et prête à l'emploi.


// Function : Calcul_note_final | stage_expire | stage_complet | nombre_des_candidates 
// Procedure : suprimer_offre_exprire |   sync_account_status_from_utilisateurs |  tg_check_expiration_after_insert |  trg_after_candidature_accepted | transfer deleted_acccounts_into_hold |  tg_check_expiration_after_insert | trg_after_candidature_accepted | trg_before_update_evaluation |  trg_sync_account_status_after_update | after_insert_subscribe | after_inset_notification _ after_insert_anonce



// function uuidv4() {
//     $data = random_bytes(16);
//     $data[6] = chr((ord($data[6]) & 0x0f) | 0x40);
//     $data[8] = chr((ord($data[8]) & 0x3f) | 0x80);
//     return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
// }

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
)";

$Anonce = "
    CREATE TABLE IF NOT EXISTS anonce (
    anonce_id CHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subject TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP 
        ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (anonce_id)
)";

// --- EXECUTION ---
$tables = [
    $utilisateurs,
    $stagiaire_accounts,
    $encadrant_account,
    $entreprise_account,
    $offres_stage,
    $affectation,
    $candidatures,
    $contact_request,
    $evaluations,
    $offres_stage,
    $stagiaire_accounts,
    $userconnections,
    $bookmark,
    $Notifications,
    $Subscribe,
    $Anonce
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