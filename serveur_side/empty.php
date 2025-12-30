<?php

require "./db_connection.php";

// stagoaire country and city [stage country, stage city, address]

$Utilisateurs = "
    CREATE TABLE IF NOT EXISTS Utilisateurs (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid CHAR(36) NOT NULL DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        role ENUM('Stagiaire', 'Entreprise', 'Encadrant', 'Admin') NOT NULL,
        account_status ENUM('Pending', 'Active', 'Verified', 'Blocked') DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
";

// 3. Table StagiaireAccounts (Profil)
$StagiaireAccount = "
    CREATE TABLE IF NOT EXISTS StagiaireAccounts (
        stagiaire_id INT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        cv_path VARCHAR(255),
        photo_path VARCHAR(255),
        FOREIGN KEY (stagiaire_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    );
";




// 4. Table Entreprises (Profil)
$Entreprises = "
    CREATE TABLE IF NOT EXISTS Entreprises (
        entreprise_id INT PRIMARY KEY,
        nom_entreprise VARCHAR(150) NOT NULL,
        description TEXT,
        adresse VARCHAR(255),
        logo_path VARCHAR(255),
        site_web VARCHAR(255),
        -- You MUST verify this column is Unique or Indexed to use it as a Foreign Key later
        UNIQUE(nom_entreprise), 
        FOREIGN KEY (entreprise_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    );
";


// 5. Table Encadrants (Profil Pédagogique)
$Encadrants = "
    CREATE TABLE IF NOT EXISTS Encadrants (
        encadrant_id INT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        agence_id INT,
        nom_d_agence VARCHAR(150) NOT NULL,
        departement VARCHAR(100),
        status_d_encadrant VARCHAR(100),
        FOREIGN KEY (encadrant_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
        FOREIGN KEY (agence_id) REFERENCES Entreprises(entreprise_id),
        -- REMOVE THE FOREIGN KEY ON NAME
        -- FOREIGN KEY (nom_d_agence) REFERENCES Entreprises(nom_entreprise), 
        
        INDEX(agence_id)
    );
";

// 6. Table Offres de Stage
$Offres_Stage = "
    CREATE TABLE IF NOT EXISTS Offres_Stage (
        offre_id INT AUTO_INCREMENT PRIMARY KEY,
        entreprise_id INT NOT NULL,
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

// 7. Table Candidatures
$Candidatures = "
    CREATE TABLE IF NOT EXISTS Candidatures (
        candidature_id INT AUTO_INCREMENT PRIMARY KEY,
        stagiaire_id INT NOT NULL,
        offre_id INT NOT NULL,
        statut ENUM('En_attente', 'Acceptee', 'Refusee') DEFAULT 'En_attente',
        message_motivation TEXT,
        cv_path VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (stagiaire_id) REFERENCES StagiaireAccounts(stagiaire_id),
        FOREIGN KEY (offre_id) REFERENCES Offres_Stage(offre_id)
    );
";

// 8. Table Evaluations
$Evaluations = "
    CREATE TABLE IF NOT EXISTS Evaluations (
        evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
        offre_id INT NOT NULL,
        candidature_id INT NOT NULL,
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

// 9. Table Logs Système
$Logs_Systeme = "
    CREATE TABLE IF NOT EXISTS Logs_Systeme (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
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
        echo "Toutes les tables ont été créées avec succès.";
    }

    // Example of inserting a new user into Utilisateurs table
    // Generate a UUID
    $uuid = generateUuid(); // Use a custom function to generate a UUID
    
    // Insert new user
    $sql = "INSERT INTO Utilisateurs (uuid, email, password_hash, role) VALUES (:uuid, :email, :password_hash, :role)";
    $stmt = $db->prepare($sql);
    $stmt->execute([
        ':uuid' => $uuid,
        ':email' => 'example@example.com',
        ':password_hash' => password_hash('password', PASSWORD_DEFAULT),
        ':role' => 'Stagiaire'
    ]);

} catch (PDOException $e) {
    die("Erreur SQL : " . $e->getMessage());
}

// Function to generate UUID (if you don't want to use a package like ramsey/uuid)
function generateUuid() {
    if (function_exists('com_create_guid')) {
        return trim(com_create_guid(), '{}'); // For Windows users
    } else {
        return sprintf('%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
            mt_rand(0, 0xffff), mt_rand(0, 0xffff),
            mt_rand(0, 0xffff),
            mt_rand(0, 0x0fff) | 0x4000, // Set the version to 4
            mt_rand(0, 0x3fff) | 0x8000,
            mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
        );
    }
}

?>
