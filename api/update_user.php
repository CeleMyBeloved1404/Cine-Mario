<?php
include 'db_connect.php';
session_start();

// Asegurarse de que el usuario esté logueado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // No autorizado
    echo json_encode(['success' => false, 'message' => 'No has iniciado sesión.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));
$action = $data->action ?? ''; // update_role, update_profile, update_password

switch ($action) {
    
    // Caso 1: Un Admin actualiza el rol de un usuario
    case 'update_role':
        include 'auth_admin.php'; // ¡Solo admins!
        
        $user_id_to_update = $data->user_id;
        $new_rol = $data->rol;

        $stmt = $conn->prepare("UPDATE usuarios SET rol = ? WHERE id = ?");
        $stmt->bind_param("si", $new_rol, $user_id_to_update);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Rol actualizado.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar rol.']);
        }
        $stmt->close();
        break;

    // Caso 2: Un usuario actualiza su propio perfil (username)
    case 'update_profile':
        $new_username = $data->username;
        $user_id = $_SESSION['user_id'];

        $stmt = $conn->prepare("UPDATE usuarios SET username = ? WHERE id = ?");
        $stmt->bind_param("si", $new_username, $user_id);
        if ($stmt->execute()) {
            $_SESSION['username'] = $new_username; // Actualizar la sesión
            echo json_encode(['success' => true, 'message' => 'Perfil actualizado.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al actualizar perfil.']);
        }
        $stmt->close();
        break;

    // Caso 3: Un usuario actualiza su propia contraseña
    case 'update_password':
        $user_id = $_SESSION['user_id'];
        $current_password = $data->current_password;
        $new_password = $data->new_password;

        // 1. Obtener la contraseña actual hasheada
        $stmt = $conn->prepare("SELECT password FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (password_verify($current_password, $user['password'])) {
            // 2. Si la contraseña actual es correcta, hashear la nueva
            $new_hashed_password = password_hash($new_password, PASSWORD_BCRYPT);
            
            // 3. Actualizar en la BD
            $stmt_update = $conn->prepare("UPDATE usuarios SET password = ? WHERE id = ?");
            $stmt_update->bind_param("si", $new_hashed_password, $user_id);
            if ($stmt_update->execute()) {
                echo json_encode(['success' => true, 'message' => 'Contraseña actualizada.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar la nueva contraseña.']);
            }
            $stmt_update->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'La contraseña actual es incorrecta.']);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
}

$conn->close();
?>