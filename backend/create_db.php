<?php
try {
    $db = new PDO('mysql:host=127.0.0.1', 'root', '');
    $db->exec('CREATE DATABASE IF NOT EXISTS skshop');
    echo "Database created or exists\n";
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
