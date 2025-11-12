<?php
include 'db_connect.php';
session_start(); // ¡Iniciamos la sesión!

$data = json_decode(file_get_contents('php://input'));
$email = $data->email;
$password = $data->password;

$stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 1) {
    $user = $result->fetch_assoc();

    // --- ¡SEGURIDAD! Verificar la contraseña hasheada ---
    if (password_verify($password, $user['password'])) {
        
        // ¡Contraseña correcta! Guardamos los datos en la SESIÓN de PHP
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['rol'] = $user['rol'];
        // (No guardes la contraseña)

        echo json_encode([
            'success' => true,
            'user' => [
                'username' => $user['username'],
                'email' => $user['email'],
                'rol' => $user['rol']
            ]
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado.']);
}

$stmt->close();
$conn->close();
?>