<?php
include 'db_connect.php';
session_start();

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'No has iniciado sesión.']);
    exit;
}

$data = json_decode(file_get_contents('php://input'));
$action = $data->action ?? ''; // admin_delete, self_delete

switch ($action) {

    // Caso 1: Un Admin borra a otro usuario
    case 'admin_delete':
        include 'auth_admin.php'; // ¡Solo admins!
        $user_id_to_delete = $data->user_id;

        $stmt = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $user_id_to_delete);
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Usuario eliminado.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar usuario.']);
        }
        $stmt->close();
        break;

    // Caso 2: Un usuario desactiva su propia cuenta
    case 'self_delete':
        $user_id = $_SESSION['user_id'];
        $password = $data->password;

        // 1. Verificar la contraseña
        $stmt = $conn->prepare("SELECT password FROM usuarios WHERE id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $result = $stmt->get_result();
        $user = $result->fetch_assoc();

        if (password_verify($password, $user['password'])) {
            // 2. Si es correcta, borrar
            $stmt_delete = $conn->prepare("DELETE FROM usuarios WHERE id = ?");
            $stmt_delete->bind_param("i", $user_id);
            if ($stmt_delete->execute()) {
                session_destroy(); // Destruir la sesión
                echo json_encode(['success' => true, 'message' => 'Cuenta desactivada.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al desactivar la cuenta.']);
            }
            $stmt_delete->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta.']);
        }
        $stmt->close();
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
}

$conn->close();
?>