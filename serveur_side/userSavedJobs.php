<?php

require("./Database_init/db_connection.php");

// Allow requests from frontend
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Disable output of PHP notices/warnings (optional, for clean JSON)
ini_set('display_errors', 0);
error_reporting(E_ALL);



?>