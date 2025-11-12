<?php
// Configuración de la base de datos
define('DB_HOST', 'localhost'); // O la dirección de tu host de MySQL
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'cinemario');

// Crear la conexión
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Establecer el header para que la respuesta sea JSON
header('Content-Type: application/json');
?>