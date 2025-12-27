<?php

// 1. Table Utilisateurs (Authentification et Rôles)
$Utilisateurs = "
    CREATE TABLE IF NOT EXISTS Utilisateurs (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        uuid CHAR(36) NOT NULL DEFAULT (UUID()),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        telephone VARCHAR(20),
        role ENUM('Etudiant', 'Entreprise', 'Encadrant', 'Admin') NOT NULL,
        account_status ENUM('Pending', 'Active', 'Verified', 'Blocked') DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
";

// 2. Table Etudiants (Profil)
$Etudiants = "
    CREATE TABLE IF NOT EXISTS Etudiants (
        etudiant_id INT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        cv_path VARCHAR(255),
        photo_path VARCHAR(255),
        FOREIGN KEY (etudiant_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
";

// 3. Table Entreprises (Profil)
$Entreprises = "
    CREATE TABLE IF NOT EXISTS Entreprises (
        entreprise_id INT PRIMARY KEY,
        nom_entreprise VARCHAR(150) NOT NULL,
        description TEXT,
        adresse VARCHAR(255),
        logo_path VARCHAR(255),
        site_web VARCHAR(255),
        FOREIGN KEY (entreprise_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
";

// 4. Table Encadrants (Profil Pédagogique)
$Encadrants = "
    CREATE TABLE IF NOT EXISTS Encadrants (
        encadrant_id INT PRIMARY KEY,
        nom VARCHAR(100) NOT NULL,
        prenom VARCHAR(100) NOT NULL,
        departement VARCHAR(100),
        FOREIGN KEY (encadrant_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
    ) ENGINE=InnoDB;
";

// 5. Table Offres de Stage
$Offres_Stage = "
    CREATE TABLE IF NOT EXISTS Offres_Stage (
        offre_id INT AUTO_INCREMENT PRIMARY KEY,
        entreprise_id INT NOT NULL,
        titre VARCHAR(200) NOT NULL,
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
    ) ENGINE=InnoDB;
";

// 6. Table Candidatures
$Candidatures = "
    CREATE TABLE IF NOT EXISTS Candidatures (
        candidature_id INT AUTO_INCREMENT PRIMARY KEY,
        etudiant_id INT NOT NULL,
        offre_id INT NOT NULL,
        statut ENUM('En_attente', 'Acceptee', 'Refusee') DEFAULT 'En_attente',
        message_motivation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (etudiant_id) REFERENCES Etudiants(etudiant_id),
        FOREIGN KEY (offre_id) REFERENCES Offres_Stage(offre_id),
        UNIQUE KEY unique_candidature (etudiant_id, offre_id)
    ) ENGINE=InnoDB;
";

// 7. Table Stages (Actifs)
$Stages = "
    CREATE TABLE IF NOT EXISTS Stages (
        stage_id INT AUTO_INCREMENT PRIMARY KEY,
        candidature_id INT NOT NULL UNIQUE,
        etudiant_id INT NOT NULL,
        entreprise_id INT NOT NULL,
        encadrant_id INT,
        statut ENUM('En_cours', 'Termine', 'Cloture') DEFAULT 'En_cours',
        date_debut_reelle DATE,
        date_fin_reelle DATE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (candidature_id) REFERENCES Candidatures(candidature_id),
        FOREIGN KEY (etudiant_id) REFERENCES Etudiants(etudiant_id),
        FOREIGN KEY (entreprise_id) REFERENCES Entreprises(entreprise_id),
        FOREIGN KEY (encadrant_id) REFERENCES Encadrants(encadrant_id)
    ) ENGINE=InnoDB;
";

// 8. Table Evaluations
$Evaluations = "
    CREATE TABLE IF NOT EXISTS Evaluations (
        evaluation_id INT AUTO_INCREMENT PRIMARY KEY,
        stage_id INT NOT NULL,
        note_entreprise DECIMAL(4,2),
        commentaire_entreprise TEXT,
        note_pedagogique DECIMAL(4,2),
        commentaire_pedagogique TEXT,
        note_finale DECIMAL(4,2),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (stage_id) REFERENCES Stages(stage_id)
    ) ENGINE=InnoDB;
";

// 9. Table Rapports
$Rapports = "
    CREATE TABLE IF NOT EXISTS Rapports (
        rapport_id INT AUTO_INCREMENT PRIMARY KEY,
        stage_id INT NOT NULL,
        titre VARCHAR(200),
        fichier_path VARCHAR(255) NOT NULL,
        date_depot DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (stage_id) REFERENCES Stages(stage_id)
    ) ENGINE=InnoDB;
";

// 10. Table Logs Système
$Logs_Systeme = "
    CREATE TABLE IF NOT EXISTS Logs_Systeme (
        log_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        action VARCHAR(255) NOT NULL,
        details TEXT,
        ip_address VARCHAR(45),
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES Utilisateurs(user_id)
    ) ENGINE=InnoDB;
";

// --- EXECUTION ---
$tables = [
    $Utilisateurs,
    $Etudiants,
    $Entreprises,
    $Encadrants,
    $Offres_Stage,
    $Candidatures,
    $Stages,
    $Evaluations,
    $Rapports,
    $Logs_Systeme
];

try {
    if (isset($db)) {
        foreach ($tables as $sql) {
            $db->exec($sql);
        }
        echo "Toutes les tables ont été créées avec succès.";
    }
} catch (PDOException $e) {
    die("Erreur SQL : " . $e->getMessage());
}

?>