<?php
include 'db_connect.php'; // Tu conector de BD
session_start();

// Determinar la acción a realizar
$action = $_GET['action'] ?? '';

// Proteger todas las acciones de este CRUD solo para Admins
include 'auth_admin.php';

switch ($action) {
    
    // --- CREATE (Crear Película) ---
    case 'create':
        $data = json_decode(file_get_contents('php://input'));
        
        $stmt = $conn->prepare("INSERT INTO peliculas (titulo, sinopsis, categoria, tipo, duracion, ano, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssssis", 
            $data->title, 
            $data->synopsis, 
            $data->category, 
            $data->type, 
            $data->duration, 
            $data->year, 
            $data->image
        );
        
        if ($stmt->execute()) {
            echo json_encode(['success' => true, 'message' => 'Contenido añadido.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error al guardar: ' . $stmt->error]);
        }
        $stmt->close();
        break;

    // --- READ (Leer todas las Películas) ---
    case 'read':
        $result = $conn->query("SELECT * FROM peliculas ORDER BY id DESC");
        $peliculas = [];
        while ($row = $result->fetch_assoc()) {
            $peliculas[] = $row;
        }
        echo json_encode(['success' => true, 'peliculas' => $peliculas]);
        break;

    // --- DELETE (Borrar Película) ---
    case 'delete':
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

    // (Aquí podrías añadir el 'update' en el futuro)
        
    default:
        echo json_encode(['success' => false, 'message' => 'Acción no válida.']);
}

$conn->close();
?>