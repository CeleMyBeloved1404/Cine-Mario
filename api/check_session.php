<?php
session_start(); // Reanuda la sesión existente

if (isset($_SESSION['user_id'])) {
    // El usuario está logueado
    echo json_encode([
        'loggedIn' => true,
        'user' => [
            'id' => $_SESSION['user_id'],
            'username' => $_SESSION['username'],
            'rol' => $_SESSION['rol']
        ]
    ]);
} else {
    // El usuario NO está logueado
    echo json_encode(['loggedIn' => false]);
}
?>