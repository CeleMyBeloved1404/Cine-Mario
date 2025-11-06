
// 2. MENÚ MÓVIL
const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('active');
  });
}

// 3. BOTÓN MUTE (morado galáctico #7A1CAC)
const video = document.querySelector('.hero-video');
const muteBtn = document.getElementById('muteBtn');

if (muteBtn && video) {
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    muteBtn.classList.toggle('muted', video.muted);
  });
}

// 4. BOTÓN PLAY → sonido ON
document.querySelectorAll('.btn-play').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!video) return;
    video.muted = false;
    video.currentTime = 0;
    video.play();
  });
});

// 5. RELLENAR CARRUSELES (pósters reales de TMDB)
const imagenesPorGenero = {
  fila1: ["tendencia1.jpg", "tendencia2.jpg", "tendencia3.jpg"],
  fila2: ["accion1.jpg", "accion2.jpg", "accion3.jpg", "accion4.jpg", "accion5.jpg", "accion6.jpg", "accion7.jpg"],
  fila3: ["comedia1.jpg", "comedia2.jpg", "comedia3.jpg"],
  fila4: ["terror1.jpg", "terror2.jpg", "terror3.jpg"],
  fila5: ["animacion1.jpg", "animacion2.jpeg", "animacion3.jpg", "animacion4.jpg", "animacion5.jpg", "animacion6.jpg"],
  fila6: ["drama1.jpg", "drama2.jpg", "drama3.jpg"],
};

Object.entries(imagenesPorGenero).forEach(([id, lista]) => {
  const carrusel = document.getElementById(id);
  if (!carrusel) return;

  lista.forEach(nombre => {
    const div = document.createElement('div');
    div.className = 'pelicula';
    div.innerHTML = `
      <img src="../images/peliculas/${nombre}" 
           loading="lazy" 
           alt="Póster película">
    `;
    carrusel.appendChild(div);
  });
});
const peliculas = [
  {
    id: "animacion1",
    imagen: "../images/peliculas/animacion1.jpg",
    trailer: "../videos/kimetsu-trailer.mp4",
    duracion: "1h 32min",
    director: "Jennifer Yuh Nelson",
    sinopsis: "Po debe enfrentarse a un nuevo enemigo que amenaza el Valle de la Paz."
  },
  {
    id: "animacion2",
    imagen: "../images/peliculas/animacion2.jpeg",
    trailer: "../images/peliculas/animacion2.jpeg",
    duracion: "1h 45min",
    director: "Byron Howard, Jared Bush",
    sinopsis: "En una ciudad donde los animales viven como humanos, un zorro y una coneja forman una inesperada alianza."
  }
  ];
  // Mostrar modal al hacer clic en imagen
document.addEventListener("click", (e) => {
  const img = e.target.closest(".pelicula img");
  if (!img) return;

  // Buscar la película correspondiente por nombre de archivo
  const nombre = img.src.split("/").pop(); // ej: animacion1.jpg
  const pelicula = peliculas.find(p => p.imagen.includes(nombre));

  if (pelicula) {
    mostrarModal(pelicula);
  }
});

function mostrarModal(pelicula) {
  const modal = document.getElementById("modalPelicula");
  const trailer = document.getElementById("trailer");
  const duracion = document.getElementById("duracion");
  const director = document.getElementById("director");
  const sinopsis = document.getElementById("sinopsis");

  trailer.src = pelicula.trailer;
  duracion.textContent = pelicula.duracion;
  director.textContent = pelicula.director;
  sinopsis.textContent = pelicula.sinopsis;

  modal.style.display = "block";
}

// Cerrar modal
document.querySelector(".cerrar").addEventListener("click", () => {
  const modal = document.getElementById("modalPelicula");
  modal.style.display = "none";
  document.getElementById("trailer").src = ""; // Detiene video
});

// Cerrar modal haciendo clic fuera del contenido
window.addEventListener("click", (e) => {
  const modal = document.getElementById("modalPelicula");
  if (e.target === modal) {
    modal.style.display = "none";
    document.getElementById("trailer").src = "";
  }
});
// 6. SCROLL CON RUEDA MOUSE
document.querySelectorAll('.carrusel').forEach(carrusel => {
  carrusel.addEventListener('wheel', e => {
    e.preventDefault();
    carrusel.scrollLeft += e.deltaY * 2;
  });
});

// 7. BONUS: auto-reproducir tráiler al cargar (mute ON)
if (video) {
  video.muted = true;
  video.play().catch(() => console.log('Autoplay bloqueado'));
}
document.querySelectorAll('.dropdown-menu a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
document.addEventListener('click', e => {
  const pelicula = e.target.closest('.pelicula');
  if (!pelicula) return;

  // Quitar selección previa
  document.querySelectorAll('.pelicula.seleccionada').forEach(p => {
    p.classList.remove('seleccionada');
  });

});