<?php

header('Content-Type: application/json');
$host = 167.235.134.36;
$user = "user";
$password = "password";
$database = "monitoring_system";

$conn = new mysqli($host, $user, $password, $database);