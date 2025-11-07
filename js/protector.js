// --- js/protector.js ---
// Este script protege las rutas privadas

// 1. Obtener el usuario del sessionStorage
const loggedInUser = sessionStorage.getItem('loggedInUser');

// 2. Comprobar si NO existe
if (!loggedInUser) {
    // 3. Si no existe, expulsar al usuario
    alert('Acceso denegado. Debes iniciar sesión para ver esta página.');
    
    // 4. Redirigir a login.html
    // (Como este script se cargará desde 'pages/peliculas.html', 
    // la ruta 'login.html' es correcta)
    window.location.href = 'login.html';
}