<?php
session_start();
session_destroy(); // Destruye toda la información de la sesión
echo json_encode(['success' => true, 'message' => 'Sesión cerrada.']);
?>