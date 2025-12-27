<?php

require "./db_connection.php";

try {

    // 1️⃣ Create table
    $sql = "
        CREATE TABLE IF NOT EXISTS TESTTABLE (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title TEXT NOT NULL,
            created_date DATE NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ";

    $User_Table = '
        CREATE TABLE IF NOT EXISTS UserAccount (
                id INT auto increment 
                AccountId INT UUIDV4,
                FirstName VarChar(),
                LastName VarCHar(),
                phoneNumber VarChar(),
                Role VarCHar() - default [agent - entreprise - admin -encadrantPedagogique]
                email varchar() -
                AccountStatus - default [Pending, Active, Verified, blocked-banned],
                session_time,
                CreatedAt datetime date.now(),
                upgraded_at TEXT,    

            
        )

    ';

    $AgentInfo = '
        create Table if not exists UserAccountInfo (
            id
            userId reference User_table(AccountId),
            image,
            CV_documents,
            derniere_candidature

            
        
        )
    ';

    $EncadrantInfo = "
        createTable if not exists Encadrantpedagogique (
            id,
           ENcadrantID reference AccountId,
            Entreprise,
            RoleDansL'entreprise,
            
            image,
            createdAt,
            upgradedAt

        )
        
    
    ";

    $Entreprise = "
        CREATE TABLE IF NOT EXISTS ENTREPRISE (
            '
                id
                EntrepriseID reference AccountID,
                Name,
                logo,
                description,
                emplacement,
                nombre,
                EncadrantValider
                createdAt,
                upgradedAt

            '
        )

    ";

    $stages = "
            ceate table if not exists Stages (
                id
                StageId,
                Entreorire
                Title,
                Type_candidature,
                date_debut,
                date_fin,
                description,
                competence_requis
                nom_d'entrepris
                emplacement,
                status
                emplacement,
                createdAT,
                upgradedAt

            )
    ";

    $Candidature= "
        create table if not exists (
            id
            StageId
            AgentId
            EncadrantId,
            status
            createdAt,
            UpgradedAt
        )
    ";

    $evaluations = "create table if not exists (
            id,
            EvaluationID
            stageId,
            EntrepriseId,
            EncadrantID,
            AgendId,
            status,
            description,
            createdAt,
            u[gradedAr
    )";


    $rapport "create table if not exists  (
        id
        rapoortid reference evaluation id
        decisiond'evalsution
        description
        createdat,
        upgradedat

    
    )";

    $admin "create table if not ecists  (
        id
        UserId reference AccountId
        image
        role
        status

    )"

    $db->exec($sql);
    echo "Table created successfully.<br>";

    // 2️⃣ Sample data
    $testtable_sample = [
        "title" => "title test",
        "created_date" => date("Y-m-d"),
    ];

    // 3️⃣ Prepare INSERT statement
    $stmt = $db->prepare("
        INSERT INTO TESTTABLE (title, created_date)
        VALUES (:title, :created_date)
    ");

    // 4️⃣ Bind parameters
    $stmt->bindParam(":title", $testtable_sample["title"]);
    $stmt->bindParam(":created_date", $testtable_sample["created_date"]);

    // 5️⃣ Execute
    $stmt->execute();

    echo "Data inserted successfully.";

} catch (PDOException $e) {
    die("ERROR: " . $e->getMessage());
}

?>