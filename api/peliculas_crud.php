<?php
include 'db_connect.php'; 
session_start();

$action = $_GET['action'] ?? '';

// Verificamos si el usuario está logueado (para acciones públicas)
if (!isset($_SESSION['user_id']) && $action === 'read_public') {
    http_response_code(401); // No autorizado
    echo json_encode(['success' => false, 'message' => 'No has iniciado sesión.']);
    exit;
}

switch ($action) {
    
    // --- CREATE (Protegido por Admin) ---
    case 'create':
        include 'auth_admin.php'; // Solo Admins pueden crear
        
        $upload_dir = '../images/peliculas/';
        $file_extension = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
        $file_name = uniqid() . '-' . time() . '.' . $file_extension;
        $target_path = $upload_dir . $file_name;
        $relative_path = '../images/peliculas/' . $file_name;

        if (move_uploaded_file($_FILES['image']['tmp_name'], $target_path)) {
            $data = $_POST;
            $id_director = !empty($data['id_director']) ? $data['id_director'] : NULL;

            $stmt = $conn->prepare("INSERT INTO peliculas (titulo, sinopsis, categoria, tipo, duracion, ano, imagen_url, id_director) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("sssssisi", 
                $data['title'], $data['synopsis'], $data['category'], 
                $data['type'], $data['duration'], $data['year'], 
                $relative_path, $id_director
            );
            
            if ($stmt->execute()) {
                echo json_encode(['success' => true, 'message' => 'Contenido añadido.']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Error al guardar en BD: ' . $stmt->error]);
            }
            $stmt->close();
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al subir el archivo de imagen.']);
        }
        break;

    // --- READ (Protegido por Admin - es el que usa admin-films.js) ---
    case 'read':
        include 'auth_admin.php'; // Solo Admins
        
        $sql = "SELECT p.*, d.nombre AS director_nombre 
                FROM peliculas p
                LEFT JOIN directores d ON p.id_director = d.id_director
                ORDER BY p.id DESC";
        
        $result = $conn->query($sql);
        $peliculas = [];
        while ($row = $result->fetch_assoc()) {
            $peliculas[] = $row;
        }
        echo json_encode(['success' => true, 'peliculas' => $peliculas]);
        break;

    // --- ¡NUEVA ACCIÓN! READ PÚBLICO (Para peliculas.html y series.html) ---
    case 'read_public':
        // No necesita auth_admin.php, ya está protegido por protector.js en el frontend
        
        $sql = "SELECT p.*, d.nombre AS director_nombre 
                FROM peliculas p
                LEFT JOIN directores d ON p.id_director = d.id_director
                ORDER BY p.ano DESC"; // Ordenamos por año (más relevante)
        
        $result = $conn->query($sql);
        $peliculas = [];
        while ($row = $result->fetch_assoc()) {
            $peliculas[] = $row;
        }
        echo json_encode(['success' => true, 'peliculas' => $peliculas]);
        break;

    // --- DELETE (Protegido por Admin) ---
    case 'delete':
        include 'auth_admin.php'; // Solo Admins
        
        $data = json_decode(file_get_contents('php://input'));
        $id = $data->id;

        $stmt = $conn->prepare("DELETE FROM peliculas WHERE id = ?");
        $stmt->bind_param("i", $id);
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Contenido eliminado.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al eliminar: ' . $stmt->error]);
        }
        $stmt->close();
        break;
        
    // --- GET DIRECTORS (Protegido por Admin) ---
    case 'get_directors':
        include 'auth_admin.php'; // Solo Admins
        
        $result = $conn->query("SELECT id_director, nombre FROM directores ORDER BY nombre ASC");
        $directores = [];
        while ($row = $result->fetch_assoc()) {
            $directores[] = $row;
        }
        echo json_encode(['success' => true, 'directores' => $directores]);
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
}

$conn->close();
?>