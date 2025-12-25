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