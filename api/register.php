<?php
include 'db_connect.php';

// Leer los datos JSON enviados desde el frontend
$data = json_decode(file_get_contents('php://input'));

$username = $data->username;
$email = $data->email;
$password = $data->password;

// --- ¡SEGURIDAD! Hashear la contraseña ---
// Usamos el algoritmo BCRYPT, el estándar de PHP
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// --- ¡SEGURIDAD! Usar "Prepared Statements" para evitar Inyección SQL ---
$stmt = $conn->prepare("INSERT INTO usuarios (username, email, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $email, $hashed_password);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Usuario registrado exitosamente.']);
} else {
    // Manejar error (ej. email duplicado)
    echo json_encode(['success' => false, 'message' => 'Error al registrar: ' . $stmt->error]);
}

$stmt->close();
$conn->close();
?>