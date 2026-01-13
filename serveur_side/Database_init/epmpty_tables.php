<?php
// star - bookmark work

$reviews = 'CREATE TABLE IF NOT EXISTS reviews (
    review_id CHAR(36) NOT NULL PRIMARY KEY,
    reviewer_id CHAR(36) NOT NULL,
    offre_id CHAR(36) NOT NULL,
    typece ENUM('Like', 'Dislike', 'none') DEFAULT 'none',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reviewer_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
    FOREIGN KEY (offre_id) REFERENCES offres_stage(offre_id) ON DELETE CASCADE
)';

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

 $Messages = '
CREATE TABLE IF NOT EXISTS messages (
    message_id CHAR(36) NOT NULL PRIMARY KEY,
    message_content VARCHAR(300) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES Utilisateurs(user_id) ON DELETE CASCADE
)';

⃣$Notifications = '
CREATE TABLE IF NOT EXISTS notifications (
    notification_id CHAR(36) NOT NULL PRIMARY KEY,
    notification_content VARCHAR(255) NOT NULL,
    sender_id CHAR(36) NOT NULL,
    receiver_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES messages(sender_id) ON DELETE CASCADE,
    FOREIGN KEY (receiver_id) REFERENCES messages(receiver_id) ON DELETE CASCADE
)';

$StagiaireAccounts = '
    CREATE TABLE stagiaire_accounts (
    stagiaire_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role ENUM('Stagiaire','Entreprise','Encadrant','Admin') NOT NULL DEFAULT 'Stagiaire',
    account_status ENUM('Pending','Active','Verified','Blocked') NOT NULL DEFAULT 'Pending',

    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    cv_path VARCHAR(255),
    photo_path VARCHAR(255),
    emplacement VARCHAR(200),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date DATE NULL,

    PRIMARY KEY (stagiaire_id),
    UNIQUE KEY uq_stagiaire_email (email),
    UNIQUE KEY uq_stagiaire_username (username)
);

'

$encadrants = '
CREATE TABLE encadrant_account (
    encadrant_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role ENUM('Stagiaire','Entreprise','Encadrant','Admin') NOT NULL DEFAULT 'Stagiaire',
    account_status ENUM('Pending','Active','Verified','Blocked') NOT NULL DEFAULT 'Pending',

    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    agence_id CHAR(36),
    nom_d_agence VARCHAR(150) NOT NULL,
    departement VARCHAR(100),
    status_d_encadrant VARCHAR(100),
    photo_path VARCHAR(255),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date DATE NULL,

    PRIMARY KEY (encadrant_id),
    UNIQUE KEY uq_encadrant_email (email),
    UNIQUE KEY uq_encadrant_username (username),
    KEY idx_encadrant_agence (agence_id)
);

'

$entreprise = '
CREATE TABLE entreprise_account (
    entreprise_id CHAR(36) NOT NULL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    telephone VARCHAR(20),
    role ENUM('Stagiaire','Entreprise','Encadrant','Admin') NOT NULL DEFAULT 'Stagiaire',
    account_status ENUM('Pending','Active','Verified','Blocked') NOT NULL DEFAULT 'Pending',

    nom_entreprise VARCHAR(150) UNIQUE,
    description TEXT,
    adresse VARCHAR(255),
    logo_path VARCHAR(255),
    site_web VARCHAR(255),

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date DATE NULL,

    PRIMARY KEY (entreprise_id),
    UNIQUE KEY uq_entreprise_email (email),
    UNIQUE KEY uq_entreprise_username (username)
);

'
1

DELIMITER $$

CREATE TRIGGER trg_sync_account_status_after_update
AFTER UPDATE ON utilisateurs
FOR EACH ROW
BEGIN
    IF NEW.account_status <> OLD.account_status THEN
        CALL sync_account_status_from_utilisateurs(NEW.user_id);
    END IF;
END$$

DELIMITER ;


2

DELIMITER $$

CREATE TRIGGER after_utilisateurs_insert
AFTER INSERT ON utilisateurs
FOR EACH ROW
BEGIN
    -- Stagiaire
    IF NEW.role = 'Stagiaire' THEN
        INSERT INTO stagiaire_accounts (
            stagiaire_id,
            email,
            username,
            password_hash,
            telephone,
            role,
            account_status,
            nom,
            prenom
        )
        VALUES (
            NEW.user_id,
            NEW.email,
            NEW.username,
            NEW.password_hash,
            NEW.telephone,
            NEW.role,
            NEW.account_status,
            'Unknown',
            'Unknown'
        );

    -- Encadrant
    ELSEIF NEW.role = 'Encadrant' THEN
        INSERT INTO encadrant_account (
            encadrant_id,
            email,
            username,
            password_hash,
            telephone,
            role,
            account_status,
            nom,
            prenom,
            nom_d_agence
        )
        VALUES (
            NEW.user_id,
            NEW.email,
            NEW.username,
            NEW.password_hash,
            NEW.telephone,
            NEW.role,
            NEW.account_status,
            'Unknown',
            'Unknown',
            'Unknown'
        );

    -- Entreprise (singular, match your enum!)
    ELSEIF NEW.role = 'Entreprise' THEN
        INSERT INTO entreprise_account (
            entreprise_id,
            email,
            username,
            password_hash,
            telephone,
            role,
            account_status,
            nom_entreprise
        )
        VALUES (
            NEW.user_id,
            NEW.email,
            NEW.username,
            NEW.password_hash,
            NEW.telephone,
            NEW.role,
            NEW.account_status,
            'Unknown'
        );

    -- Admin: do nothing
    ELSEIF NEW.role = 'Admin' THEN
        SET @dummy = 1;

    END IF;
END$$

DELIMITER ;


3 - DELIMITER $$

CREATE TRIGGER after_insert_stagiaire_account
AFTER INSERT ON stagiaire_accounts
FOR EACH ROW
BEGIN
    UPDATE utilisateurs
    SET password_hash = NEW.password_hash
    WHERE user_id = NEW.stagiaire_id;
END$$

DELIMITER ;



5 -

DELIMITER $$

CREATE TRIGGER trg_insert_affectation
AFTER INSERT ON encadrants
FOR EACH ROW
BEGIN
    -- Insert into Affectation only if encadrant_id doesn't already exist
    INSERT IGNORE INTO Affectation (encadrant_id)
    VALUES (NEW.encadrant_id);
END$$

DELIMITER ;


4 - procedure 

DELIMITER $$

CREATE PROCEDURE sync_account_status_from_utilisateurs(IN p_user_id CHAR(36))
BEGIN
    DECLARE v_role VARCHAR(50);
    DECLARE v_account_status VARCHAR(50);

    -- Get role and account_status
    SELECT role, account_status
    INTO v_role, v_account_status
    FROM utilisateurs
    WHERE user_id = p_user_id;

    IF v_role IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'User not found';
    END IF;

    -- Update according to role
    IF v_role = 'Stagiaire' THEN
        UPDATE stagiaire_accounts
        SET account_status = v_account_status
        WHERE stagiaire_id = p_user_id;

    ELSEIF v_role = 'Entreprise' THEN
        UPDATE entreprise_account
        SET account_status = v_account_status
        WHERE entreprise_id = p_user_id;

    ELSEIF v_role = 'Encadrant' THEN
        UPDATE encadrant_account
        SET account_status = v_account_status
        WHERE encadrant_id = p_user_id;

    ELSEIF v_role = 'Admin' THEN
        -- Admin does not have a separate table, nothing to update
        SET @dummy = 1;

    ELSE
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Unknown role';
    END IF;
END$$

DELIMITER ;






?>