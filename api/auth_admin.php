<?php
// Este script comprueba si el usuario logueado es un Admin.
// Lo incluiremos en otros archivos.

if (session_status() === PHP_SESSION_NONE) {
    session_start(); // Asegura que la sesión esté iniciada
}

// Si no hay sesión, o si el rol no es 'Admin', bloquear el acceso.
if (!isset($_SESSION['rol']) || $_SESSION['rol'] !== 'Admin') {
    // Enviar un error 403 (Prohibido) y detener el script
    http_response_code(403);
    echo json_encode(['success' => false, 'message' => 'Acceso denegado. Se requiere rol de Administrador.']);
    exit; // Detiene la ejecución
}
?>