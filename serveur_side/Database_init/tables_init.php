<?php

require "./db_connection.php";

// 1. Table Utilisateurs (Root Table)
// - user_id is now the UUID (CHAR 36).
// - No AUTO_INCREMENT. You must provide the ID on INSERT.
$Utilisateurs = "
    CREATE TABLE IF NOT EXISTS Utilisateurs (
        user_id CHAR(36) NOT NULL PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        role ENUM('Stagiaire', 'Entreprise', 'Encadrant', 'Admin') NOT NULL,
        account_status ENUM('Pending', 'Active', 'Verified', 'Blocked') DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
";

// 2. Table StagiaireAccounts
// - PK is CHAR(36) because it matches Utilisateurs.user_id
$StagiaireAccount = "
    CREATE TABLE IF NOT EXISTS StagiaireAccounts (
        stagiaire_id CHAR(36) NOT NULL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        cv_path VARCHAR(255),
        photo_path VARCHAR(255),
        FOREIGN KEY (stagiaire_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    );
";

// 3. Table Entreprises
// - PK is CHAR(36)
$Entreprises = "
    CREATE TABLE IF NOT EXISTS Entreprises (
        entreprise_id CHAR(36) NOT NULL PRIMARY KEY,
        nom_entreprise VARCHAR(150) NOT NULL,
        description TEXT,
        adresse VARCHAR(255),
        logo_path VARCHAR(255),
        site_web VARCHAR(255),
        UNIQUE(nom_entreprise), 
        FOREIGN KEY (entreprise_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    );
";



// $Entreprises = "
// CREATE TABLE IF NOT EXISTS Entreprises (
//     entreprise_id CHAR(36) NOT NULL PRIMARY KEY,
    
//     -- User-related fields
//     email VARCHAR(255) NOT NULL UNIQUE,
//     password_hash VARCHAR(255) NOT NULL,
//     telephone VARCHAR(20),
//     role ENUM('Entreprise') NOT NULL DEFAULT 'Entreprise',
//     account_status ENUM('Pending', 'Active', 'Verified', 'Blocked') DEFAULT 'Pending',
//     created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
//     updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
//     -- Enterprise-specific fields
//     nom_entreprise VARCHAR(150) NOT NULL UNIQUE,
//     description TEXT,
//     adresse VARCHAR(255),
//     logo_path VARCHAR(255),
//     site_web VARCHAR(255)
// );
// ";


// 4. Table Encadrants
// - PK is CHAR(36)
// - agence_id must be CHAR(36) to reference Entreprises
$Encadrants = "
    CREATE TABLE IF NOT EXISTS Encadrants (
        encadrant_id CHAR(36) NOT NULL PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        agence_id CHAR(36), 
        nom_d_agence VARCHAR(150) NOT NULL,
        departement VARCHAR(100),
        status_d_encadrant VARCHAR(100),
        
        FOREIGN KEY (encadrant_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
        FOREIGN KEY (agence_id) REFERENCES Entreprises(entreprise_id),
        
        INDEX(agence_id)
    );
";

// 5. Table Offres de Stage
// - offre_id remains INT AUTO_INCREMENT (Transaction table)
// - entreprise_id becomes CHAR(36)
$Offres_Stage = "
    CREATE TABLE IF NOT EXISTS Offres_Stage (
        offre_id CHAR(36) NOT NULL PRIMARY KEY,
        entreprise_id CHAR(36) NOT NULL,
        type_de_stage VARCHAR(100),
        titre VARCHAR(200) NOT NULL,
        stage_categorie VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        competences_requises TEXT,
        date_debut DATE,
        duree_semaines INT,
        nombre_places INT DEFAULT 1,
        emplacement VARCHAR(100),
        statut ENUM('Ouverte', 'Fermée', 'Expirée') DEFAULT 'Ouverte',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (entreprise_id) REFERENCES Entreprises(entreprise_id)
    );
";

// 6. Table Candidatures
// - stagiaire_id becomes CHAR(36)
$Candidatures = "
    CREATE TABLE IF NOT EXISTS Candidatures (
        candidature_id CHAR(36) NOT NULL PRIMARY KEY,
        stagiaire_id CHAR(36) NOT NULL,
        offre_id CHAR(36) NOT NULL,
        statut ENUM('En_attente', 'Acceptee', 'Refusee') DEFAULT 'En_attente',
        message_motivation TEXT,
        cv_path VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (stagiaire_id) REFERENCES StagiaireAccounts(stagiaire_id),
        FOREIGN KEY (offre_id) REFERENCES Offres_Stage(offre_id)
        )

";

// 7. Table Evaluations
// - References Offres (INT) and Candidatures (INT)
$Evaluations = "
    CREATE TABLE IF NOT EXISTS Evaluations (
        evaluation_id CHAR(36) NOT NULL PRIMARY KEY,
        offre_id CHAR(36) NOT NULL,
        candidature_id CHAR(36) NOT NULL,
        note_entreprise DECIMAL(4,2),
        commentaire_entreprise TEXT,
        note_pedagogique DECIMAL(4,2),
        commentaire_pedagogique TEXT,
        encadrant_pedagogique VARCHAR(100),
        note_finale DECIMAL(4,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (offre_id) REFERENCES Offres_Stage(offre_id),
        FOREIGN KEY (candidature_id) REFERENCES Candidatures(candidature_id)
    );
";

// 8. Table Logs Système
// - user_id becomes CHAR(36)
$Logs_Systeme = "
    CREATE TABLE IF NOT EXISTS Logs_Systeme (
        log_id CHAR(36) NOT NULL PRIMARY KEY,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (log_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    );
";

// --- EXECUTION ---
$tables = [
    $Utilisateurs,
    $StagiaireAccount,
    $Entreprises,
    $Encadrants,
    $Offres_Stage,
    $Candidatures,
    $Evaluations,
    $Logs_Systeme
];

try {
    if (isset($db)) {
        foreach ($tables as $sql) {
            $db->exec($sql);
        }
        echo "Toutes les tables ont été créées avec succès.<br>";
    }

    // --- INSERT EXAMPLE ---
    // Since user_id is NOT auto_increment, we must provide it.
    
    $uuid = generateUuid(); 
    $email = 'user_' . time() . '@test.com';
    
    // Note: We insert into 'user_id', not 'uuid'
    $sql = "INSERT INTO Utilisateurs (user_id, email, password_hash, role) VALUES (:id, :email, :password_hash, :role)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':id' => $uuid,
        ':email' => $email,
        ':password_hash' => password_hash('password', PASSWORD_DEFAULT),
        ':role' => 'Stagiaire'
    ]);
    
    echo "Nouvel utilisateur inséré avec ID: " . $uuid;

} catch (PDOException $e) {
    die("Erreur SQL : " . $e->getMessage());
}

// Helper Function: Generate UUID v4
function generateUuid() {
    if (function_exists('com_create_guid')) {
        return trim(com_create_guid(), '{}');
    } else {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000,
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}

?>