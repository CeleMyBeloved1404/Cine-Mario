// --- js/series.js (Conectado a la Base de Datos) ---

// --- 1. FUNCIÓN PRINCIPAL PARA CARGAR TODO ---
document.addEventListener('DOMContentLoaded', () => {
  cargarContenidoDeSeries();
});

async function cargarContenidoDeSeries() {
  try {
    // 1.1. Llamar a la acción 'read_public'
    const response = await fetch('../api/peliculas_crud.php?action=read_public');
    const data = await response.json();

    if (data.success) {
      // 1.2. Filtrar para obtener SOLO las que son 'Serie'
      const todasLasSeries = data.peliculas.filter(item => item.tipo === 'Serie');
      
      // 1.3. Clasificar por categoría
      const categorias = {
        'fila-series-tendencia': todasLasSeries.filter(p => p.categoria === 'Animación').slice(0, 7), // "Tendencias" de ejemplo
        'fila-series-accion': todasLasSeries.filter(p => p.categoria === 'Acción'),
        'fila-series-comedia': todasLasSeries.filter(p => p.categoria === 'Comedia'),
        'fila-series-terror': todasLasSeries.filter(p => p.categoria === 'Terror'),
        'fila-series-animacion': todasLasSeries.filter(p => p.categoria === 'Animación'),
        'fila-series-drama': todasLasSeries.filter(p => p.categoria === 'Drama'),
      };

      // 1.4. Rellenar todos los carruseles
      for (const idCarrusel in categorias) {
        popularCarrusel(idCarrusel, categorias[idCarrusel]);
      }

    } else {
      console.error('Error al cargar series:', data.message);
    }
  } catch (error) {
    console.error('Error de conexión:', error);
  }
}

// --- 2. FUNCIÓN PARA RELLENAR UN CARRUSEL ---
function popularCarrusel(idElemento, listaSeries) {
  const carrusel = document.getElementById(idElemento);
  if (!carrusel) return;

  carrusel.innerHTML = ''; // Limpiar carrusel
  
  if (listaSeries.length === 0) {
    carrusel.innerHTML = '<p style="color: #555; margin-left: 10px;">No hay títulos en esta categoría.</p>';
    return;
  }

  listaSeries.forEach(serie => {
    const div = document.createElement('div');
    div.className = 'pelicula'; // Reutilizamos la clase .pelicula
    // Guardamos los datos en el HTML para el modal
    div.setAttribute('data-trailer-url', serie.trailer_url || ''); 
    div.setAttribute('data-duracion', serie.duracion);
    div.setAttribute('data-director', serie.director_nombre || 'Desconocido');
    div.setAttribute('data-sinopsis', serie.sinopsis);
    
    div.innerHTML = `
      <img src="${serie.imagen_url}" 
           loading="lazy" 
           alt="Póster de ${serie.titulo}">
    `;
    carrusel.appendChild(div);
  });
}


// --- 3. LÓGICA DEL MODAL ---
document.addEventListener("click", (e) => {
  const serieDiv = e.target.closest(".pelicula");
  if (!serieDiv) return;

  const serie = {
    trailer: serieDiv.getAttribute('data-trailer-url'),
    duracion: serieDiv.getAttribute('data-duracion'),
    director: serieDiv.getAttribute('data-director'),
    sinopsis: serieDiv.getAttribute('data-sinopsis')
  };

  mostrarModal(serie);
});

function mostrarModal(serie) {
  const modal = document.getElementById("modalPelicula");
  const trailer = document.getElementById("trailer");
  const duracion = document.getElementById("duracion");
  const director = document.getElementById("director"); // (Este ID es 'director' en tu HTML de series)
  const sinopsis = document.getElementById("sinopsis");

  trailer.src = serie.trailer ? serie.trailer : '';
  duracion.textContent = serie.duracion || 'N/A';
  director.textContent = serie.director || 'N/A';
  sinopsis.textContent = serie.sinopsis || 'Sin sinopsis disponible.';

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