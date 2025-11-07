// --- js/index.js (VERSIÓN LIMPIA) ---
// Este script solo maneja la lógica del botón "Explorar ahora" en index.html

document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Encontrar el botón "Explorar ahora" por su ID
  const exploreBtn = document.getElementById('explore-btn');
  
  if (exploreBtn) {
    // 2. Revisar la sesión del usuario
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      // 3. (Meta 2) Si está logueado, cambia el enlace a "peliculas.html"
      exploreBtn.href = './pages/peliculas.html';
    } else {
      // 4. (Meta 2) Si NO está logueado, se asegura que el enlace sea "login.html"
      exploreBtn.href = './pages/login.html';
    }
  }
});