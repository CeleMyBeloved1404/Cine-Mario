// --- js/protector.js (Conectado a PHP) ---
// Este script debe cargarse en el <head> de las páginas protegidas

// Esto es una forma simple de hacerlo síncrono,
// NO es la mejor práctica, pero funciona para este script en el <head>
(function() {
    let loggedIn = false;
    
    // 1. Creamos una solicitud síncrona (bloqueante)
    const xhr = new XMLHttpRequest();
    // (Usamos '../api/' porque este script solo se usa dentro de /pages/)
    xhr.open('GET', '../api/check_session.php', false); // 'false' la hace síncrona
    
    try {
        xhr.send();
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            loggedIn = data.loggedIn;
        }
    } catch (e) {
        console.error('Fallo el protector de rutas', e);
    }

    // 2. Si no está logueado, lo expulsamos
    if (!loggedIn) {
        alert('Acceso denegado. Debes iniciar sesión para ver esta página.');
        window.location.href = 'login.html';
    }
})();