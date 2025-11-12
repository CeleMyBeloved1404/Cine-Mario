<?php
include 'db_connect.php';
include 'auth_admin.php'; // ¡Protegido! Solo los admins pueden ver esto.

// Seleccionamos todos los usuarios excepto la contraseña
$result = $conn->query("SELECT id, username, email, rol FROM usuarios");

$users = [];
while ($row = $result->fetch_assoc()) {
    $users[] = $row;
}

echo json_encode(['success' => true, 'users' => $users]);

$conn->close();
?>