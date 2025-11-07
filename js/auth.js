// --- js/auth.js (VERSIÓN FINAL) ---
// Este script maneja el navbar en TODAS las páginas

document.addEventListener('DOMContentLoaded', () => {
  const navLinksList = document.getElementById('nav-links-list'); 
  if (!navLinksList) {
    // Si la página no tiene el <ul> (ej. login/registro), no hacemos nada
    return;
  }

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  // --- Lógica de Rutas Mejorada ---
  // Verificamos si estamos en la raíz (index) o dentro de /pages/
  const isInsidePages = window.location.pathname.includes('/pages/');
  
  // Definimos las rutas correctas
  const basePath = isInsidePages ? '' : 'pages/'; // Si estoy en pages/, la ruta es '' (ej. login.html)
  const rootPath = isInsidePages ? '../' : '';     // Si estoy en pages/, la raíz es '../' (ej. ../index.html)
  // --- Fin Lógica de Rutas ---

  let linksHTML = '';

  if (loggedInUser) {
    // --- (Meta 1) Usuario HA INICIADO SESIÓN ---
    // Se muestra el desplegable de Perfil
    
    // 1. Link al Panel de Admin (fuera del dropdown)
    if (loggedInUser.rol === 'Admin') {
      linksHTML += `<li><a href="${basePath}admin-films.html">Admin Panel</a></li>`;
    }
    
    // 2. El nuevo Dropdown de Perfil
    linksHTML += `
      <li class="dropdown">
        <a href="#" class="dropdown-btn perfil-btn">${loggedInUser.username} ▾</a>
        <ul class="dropdown-menu">
          <li><a href="${basePath}perfil.html">Mi Perfil</a></li>
          <li><a href="${basePath}configuracion.html">Configuración</a></li>
          <li><a href="${basePath}contacto.html">Contacto</a></li>
          <li class="dropdown-divider"></li>
          <li><a href="#" id="logout-btn">Cerrar Sesión</a></li>
        </ul>
      </li>
    `;
    
    // Inyectamos el HTML
    navLinksList.innerHTML += linksHTML;
    
    // 3. Añadimos el listener para el botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInUser');
        alert('Has cerrado sesión.');
        window.location.href = `${rootPath}index.html`; // Redirige al index
      });
    }

  } else {
    // --- (Meta 1) Usuario NO ha iniciado sesión ---
    // Se muestra el botón de Login
    linksHTML = `<li><a href="${basePath}login.html" class="login-btn">Login</a></li>`;
    navLinksList.innerHTML += linksHTML;
  }
});