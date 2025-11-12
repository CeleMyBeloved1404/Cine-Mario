// --- js/auth.js (Con CRUD de Admin en el Perfil) ---

// Usamos una función asíncrona autoejecutable
(async () => {
  const navLinksList = document.getElementById('nav-links-list'); 
  if (!navLinksList) return;

  // 1. Determinar rutas
  const isInsidePages = window.location.pathname.includes('/pages/');
  const basePath = isInsidePages ? '' : 'pages/';
  const rootPath = isInsidePages ? '../' : '';
  const apiPath = isInsidePages ? '../api/' : 'api/';

  let loggedInUser = null;

  // 2. Preguntar al servidor quiénes somos
  try {
    const response = await fetch(`${apiPath}check_session.php`);
    const data = await response.json();
    if (data.loggedIn) {
      loggedInUser = data.user;
    }
  } catch (error) {
    console.error('Error chequeando la sesión:', error);
  }

  // 3. Construir el Navbar
  let linksHTML = '';

  if (loggedInUser) {
    // --- Usuario SÍ está logueado ---
    
    // (Esta sección fue eliminada de aquí)
    // if (loggedInUser.rol === 'Admin') { ... }

    const userInitial = loggedInUser.username ? loggedInUser.username[0].toUpperCase() : '?';
    const avatarHTML = `<div class="navbar-avatar">${userInitial}</div>`;

    // --- INICIO DE LA MODIFICACIÓN ---

    // 1. Construir el HTML del menú desplegable dinámicamente
    let dropdownMenuHTML = '<ul class="dropdown-menu">';

    // 2. AÑADIR SECCIÓN DE ADMIN (SI CORRESPONDE)
   if (loggedInUser.rol.toUpperCase() === 'ADMIN') {
      dropdownMenuHTML += `
        <li><a href="${basePath}admin-films.html">Admin Películas</a></li>
        <li><a href="${basePath}admin-users.html">Admin Usuarios</a></li>
        <li class="dropdown-divider"></li>
      `;
    }

    // 3. AÑADIR SECCIÓN DE USUARIO (Siempre)
    dropdownMenuHTML += `
        <li><a href="${basePath}perfil.html">Mi Perfil</a></li>
        <li><a href="${basePath}configuracion.html">Configuración</a></li>
        <li><a href="${basePath}contacto.html">Contacto</a></li>
        <li class="dropdown-divider"></li>
        <li><a href="#" id="logout-btn">Cerrar Sesión</a></li>
      </ul>
    `;
    
    // 4. Construir el botón de perfil y adjuntar el menú
    linksHTML += `
      <li class="dropdown">
        <a href="#" class="dropdown-btn perfil-btn">
          ${avatarHTML}
          <span>${loggedInUser.username} ▾</span>
        </a>
        ${dropdownMenuHTML}
      </li>
    `;
    // --- FIN DE LA MODIFICACIÓN ---
    
    navLinksList.innerHTML += linksHTML;
    
    // 5. Lógica de Logout
    const logoutBtn = document.getElementById('logout-btn');
    if(logoutBtn) {
      logoutBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        await fetch(`${apiPath}logout.php`);
        alert('Has cerrado sesión.');
        window.location.href = `${rootPath}index.html`; 
      });
    }

  } else {
    // --- Usuario NO está logueado ---
    linksHTML = `<li><a href="${basePath}login.html" class="login-btn">Login</a></li>`;
    navLinksList.innerHTML += linksHTML;
  }
})();