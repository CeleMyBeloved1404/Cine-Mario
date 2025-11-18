// --- js/peliculas.js (Conectado a la Base de Datos) ---

// --- 1. FUNCIÓN PRINCIPAL PARA CARGAR TODO ---
document.addEventListener('DOMContentLoaded', () => {
  cargarContenidoDePeliculas();
});

async function cargarContenidoDePeliculas() {
  try {
    // 1.1. Llamar a la nueva acción 'read_public'
    const response = await fetch('../api/peliculas_crud.php?action=read_public');
    const data = await response.json();

    if (data.success) {
      // 1.2. Filtrar para obtener SOLO las que son 'Película'
      const todasLasPeliculas = data.peliculas.filter(item => item.tipo === 'Película');
      
      // 1.3. Clasificar por categoría
      const categorias = {
        fila1: todasLasPeliculas.filter(p => p.categoria === 'Animación').slice(0, 7), // "Tendencias" de ejemplo
        fila2: todasLasPeliculas.filter(p => p.categoria === 'Acción'),
        fila3: todasLasPeliculas.filter(p => p.categoria === 'Comedia'),
        fila4: todasLasPeliculas.filter(p => p.categoria === 'Terror'),
        fila5: todasLasPeliculas.filter(p => p.categoria === 'Animación'),
        fila6: todasLasPeliculas.filter(p => p.categoria === 'Drama'),
      };

      // 1.4. Rellenar todos los carruseles
      for (const idCarrusel in categorias) {
        popularCarrusel(idCarrusel, categorias[idCarrusel]);
      }

    } else {
      console.error('Error al cargar películas:', data.message);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

// --- 2. FUNCIÓN PARA RELLENAR UN CARRUSEL ---
function popularCarrusel(idElemento, listaPeliculas) {
  const carrusel = document.getElementById(idElemento);
  if (!carrusel) return; // Si no encuentra el carrusel, no hace nada

  carrusel.innerHTML = ''; // Limpiar carrusel
  
  if (listaPeliculas.length === 0) {
    carrusel.innerHTML = '<p style="color: #555; margin-left: 10px;">No hay títulos en esta categoría.</p>';
    return;
  }

  listaPeliculas.forEach(peli => {
    const div = document.createElement('div');
    div.className = 'pelicula';
    // Guardamos los datos en el HTML para el modal
    div.setAttribute('data-trailer-url', peli.trailer_url || ''); // (Necesitarás añadir trailer_url a tu BD)
    div.setAttribute('data-duracion', peli.duracion);
    div.setAttribute('data-director', peli.director_nombre || 'Desconocido');
    div.setAttribute('data-sinopsis', peli.sinopsis);
    
    div.innerHTML = `
      <img src="${peli.imagen_url}" 
           loading="lazy" 
           alt="Póster de ${peli.titulo}">
    `;
    carrusel.appendChild(div);
  });
}


// --- 3. LÓGICA DEL MODAL ---
// (Modificada para leer los atributos 'data-*' del div.pelicula)
document.addEventListener("click", (e) => {
  const peliculaDiv = e.target.closest(".pelicula");
  if (!peliculaDiv) return;

  // Los datos ya no están en un array JS, están en el HTML
  const pelicula = {
    trailer: peliculaDiv.getAttribute('data-trailer-url'),
    duracion: peliculaDiv.getAttribute('data-duracion'),
    director: peliculaDiv.getAttribute('data-director'),
    sinopsis: peliculaDiv.getAttribute('data-sinopsis')
  };

  mostrarModal(pelicula);
});

function mostrarModal(pelicula) {
  const modal = document.getElementById("modalPelicula");
  const trailer = document.getElementById("trailer");
  const duracion = document.getElementById("duracion");
  const director = document.getElementById("director");
  const sinopsis = document.getElementById("sinopsis");

  // Asignamos los datos
  trailer.src = pelicula.trailer ? pelicula.trailer : ''; // (Añade 'trailer_url' a tu BD)
  duracion.textContent = pelicula.duracion || 'N/A';
  director.textContent = pelicula.director || 'N/A';
  sinopsis.textContent = pelicula.sinopsis || 'Sin sinopsis disponible.';

  modal.style.display = "block";
}

// --- 4. LÓGICA DE UI (Sin cambios) ---

// Cerrar modal (X)
document.querySelector(".cerrar").addEventListener("click", () => {
  const modal = document.getElementById("modalPelicula");
  modal.style.display = "none";
  document.getElementById("trailer").src = ""; // Detiene video
});
// Cerrar modal (clic afuera)
window.addEventListener("click", (e) => {
  const modal = document.getElementById("modalPelicula");
  if (e.target === modal) {
    modal.style.display = "none";
    document.getElementById("trailer").src = "";
  }
});
// Scroll con rueda
document.querySelectorAll('.carrusel').forEach(carrusel => {
  carrusel.addEventListener('wheel', e => {
    e.preventDefault();
    carrusel.scrollLeft += e.deltaY * 2;
  });
});
// Botón Mute
const video = document.querySelector('.hero-video');
const muteBtn = document.getElementById('muteBtn');
if (muteBtn && video) {
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.classList.toggle('muted', video.muted);
  });
}
// Botón Play
document.querySelectorAll('.btn-play').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.play();
  });
});
// Autoplay Hero
if (video) {
  video.muted = true;
  video.play().catch(() => console.log('Autoplay bloqueado'));
}
// Navegación dropdown
document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});