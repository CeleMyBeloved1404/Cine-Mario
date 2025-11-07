// --- js/auth.js (Simplificado, SIN foto) ---

document.addEventListener('DOMContentLoaded', () => {
  const navLinksList = document.getElementById('nav-links-list'); 
  if (!navLinksList) {
    return;
  }

  const loggedInUser = JSON.parse(sessionStorage.getItem('loggedInUser'));

  const isInsidePages = window.location.pathname.includes('/pages/');
  const basePath = isInsidePages ? '' : 'pages/';
  const rootPath = isInsidePages ? '../' : '';

  let linksHTML = '';

  if (loggedInUser) {
    // --- Usuario HA INICIADO SESIÓN ---
    
    if (loggedInUser.rol === 'Admin') {
      linksHTML += `<li><a href="${basePath}admin-films.html">Admin Panel</a></li>`;
    }
    
    // --- INICIO CAMBIO: HTML del Dropdown de Perfil ---
    
    // 1. Crear la inicial del avatar
    const userInitial = loggedInUser.username ? loggedInUser.username[0].toUpperCase() : '?';
    const avatarHTML = `<div class="navbar-avatar">${userInitial}</div>`;

    // 2. Crear el botón del dropdown
    linksHTML += `
      <li class="dropdown">
        <a href="#" class="dropdown-btn perfil-btn">
          ${avatarHTML}
          <span>${loggedInUser.username} ▾</span>
        </a>
        <ul class="dropdown-menu">
          <li><a href="${basePath}perfil.html">Mi Perfil</a></li>
          <li><a href="${basePath}configuracion.html">Configuración</a></li>
          <li><a href="${basePath}contacto.html">Contacto</a></li>
          <li class="dropdown-divider"></li>
          <li><a href="#" id="logout-btn">Cerrar Sesión</a></li>
        </ul>
      </li>
    `;
    // --- FIN CAMBIO ---
    
    navLinksList.innerHTML += linksHTML;
    
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('loggedInUser');
        alert('Has cerrado sesión.');
        window.location.href = `${rootPath}index.html`; 
      });
    }

  } else {
    // --- Usuario NO ha iniciado sesión ---
    linksHTML = `<li><a href="${basePath}login.html" class="login-btn">Login</a></li>`;
    navLinksList.innerHTML += linksHTML;
  }
});