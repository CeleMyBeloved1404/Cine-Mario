// --- js/series.js ---
// (Adaptado y CORREGIDO desde peliculas.js)

// --- BOTÓN MUTE ---
const video = document.querySelector('.hero-video');
const muteBtn = document.getElementById('muteBtn');

if (muteBtn && video) {
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.classList.toggle('muted', video.muted);
  });
}

// --- BOTÓN PLAY ---
document.querySelectorAll('.btn-play').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.play();
  });
});

// --- RELLENAR CARRUSELES (Datos de ejemplo para Series) ---
const imagenesPorGenero = {
  'fila-series-tendencia': ["tendencia1.jpg", "tendencia2.jpg", "tendencia3.jpg"],
  'fila-series-accion': ["accion1.jpg", "accion2.jpg", "accion3.jpg"],
  'fila-series-comedia': ["comedia1.jpg", "comedia2.jpg", "comedia3.jpg"],
  'fila-series-terror': ["terror1.jpg", "terror2.jpg", "terror3.jpg"],
  'fila-series-animacion': ["animacion1.jpg", "animacion2.jpeg", "animacion3.jpg"],
  'fila-series-drama': ["drama1.jpg", "drama2.jpg", "drama3.jpg"],
};

Object.entries(imagenesPorGenero).forEach(([id, lista]) => {
  const carrusel = document.getElementById(id);
  if (!carrusel) return;

  lista.forEach(nombre => {
    const div = document.createElement('div');
    div.className = 'pelicula'; // Reutilizamos la clase .pelicula
    div.innerHTML = `
      <img src="../images/peliculas/${nombre}" 
           loading="lazy" 
           alt="Póster serie">
    `;
    carrusel.appendChild(div);
  });
});

// --- DATOS DEL MODAL (Datos de ejemplo para Series) ---
const series = [
  {
    id: "animacion1",
    imagen: "../images/peliculas/animacion1.jpg",
    trailer: "../videos/kimetsu-trailer.mp4", 
    duracion: "3 Temporadas",
    director: "Haruo Sotozaki", // "Director" ahora es "Creador"
    sinopsis: "Un joven se convierte en un cazador de demonios después de que su familia es asesinada."
  },
  {
    id: "animacion2",
    imagen: "../images/peliculas/animacion2.jpeg",
    trailer: "../videos/placeholder.mp4", 
    duracion: "1 Temporada",
    director: "Tim Burton",
    sinopsis: "Un hombre pone accidentalmente un anillo de bodas en el dedo de una novia cadáver."
  }
];
  
// --- LÓGICA DEL MODAL ---
document.addEventListener("click", (e) => {
  const img = e.target.closest(".pelicula img");
  if (!img) return;

  const nombre = img.src.split("/").pop();
  const serie = series.find(p => p.imagen.includes(nombre));

  if (serie) {
    mostrarModal(serie);
  }
});

function mostrarModal(serie) {
  const modal = document.getElementById("modalPelicula");
  const trailer = document.getElementById("trailer");
  const duracion = document.getElementById("duracion");
  const director = document.getElementById("director"); // Creador
  const sinopsis = document.getElementById("sinopsis");

  trailer.src = serie.trailer;
  duracion.textContent = serie.duracion;
  director.textContent = serie.director;
  sinopsis.textContent = serie.sinopsis;

  modal.style.display = "block";
}

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

// --- SCROLL CON RUEDA MOUSE ---
document.querySelectorAll('.carrusel').forEach(carrusel => {
  carrusel.addEventListener('wheel', e => {
    e.preventDefault();
    carrusel.scrollLeft += e.deltaY * 2;
  });
});

// --- AUTOPLAY VIDEO DEL HERO ---
if (video) {
  video.muted = true;
  video.play().catch(() => console.log('Autoplay bloqueado'));
}

// --- SELECCIÓN DE PELÍCULA ---
document.addEventListener('click', e => {
  const pelicula = e.target.closest('.pelicula');
  if (!pelicula) return;

  // Quitar selección previa
  document.querySelectorAll('.pelicula.seleccionada').forEach(p => {
    p.classList.remove('seleccionada');
  });
});

// --- NAVEGACIÓN DROPDOWN GÉNERO ---
// (Esta lógica estaba en peliculas.js y es necesaria)
document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// NOTA: La llave '}' extra que estaba aquí en peliculas.js ha sido eliminada.