// --- js/perfil.js (Simplificado, SIN foto) ---

document.addEventListener('DOMContentLoaded', () => {

  // 1. Obtener los "hooks" del HTML
  const avatarEl = document.getElementById('profile-avatar'); 
  const usernameEl = document.getElementById('profile-username');
  const emailEl = document.getElementById('profile-email');
  const gridEl = document.getElementById('watched-grid-container');

  // 2. Obtener los datos del usuario de la sesión
  const user = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!user) return; // Protegido

  // 4. "Pintar" la información del perfil
  if (usernameEl) {
    usernameEl.textContent = user.username;
  }
  if (emailEl) {
    emailEl.textContent = user.email;
  }

  // --- CAMBIO: Lógica del Avatar Simplificada ---
  if (avatarEl && user.username) {
    // Si NO hay foto, mostrar la inicial
    avatarEl.textContent = user.username[0].toUpperCase();
  }
  // --- FIN CAMBIO ---

  // 5. "Pintar" el catálogo de "Series Vistas" (datos de ejemplo)
  const mockVistas = [
    { title: 'Spider-Man', img: '../images/peliculas/animacion5.jpg' },
    { title: 'Demon Slayer', img: '../images/peliculas/animacion1.jpg' },
    { title: 'Rambo', img: '../images/peliculas/accion4.jpg' },
    { title: 'Corpse Bride', img: '../images/peliculas/animacion2.jpeg' },
    { title: 'John Wick', img: '../images/peliculas/accion3.jpg' }
  ];

  if (gridEl) {
    gridEl.innerHTML = ''; // Limpiar
    mockVistas.forEach(item => {
      const card = document.createElement('div');
      card.className = 'watched-card';
      card.innerHTML = `<img src="${item.img}" alt="${item.title}">`;
      gridEl.appendChild(card);
    });
  }
});