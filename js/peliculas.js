
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
const posters = [
  "8cdWjvZQUExUUTzyp4t6EDMUBj4", "1XDDXPXGiI8id7MrUxK36ke7gkX",
  "zVMyvNowgbsBALG27hJ4mG0u61A", "fY3SWsHQmL3cYfkROH7jnnZ4O0r",
  "9x1UPWBQ4bB8vZ7Z3aW8L9pQ5tR", "m1p2PYG3t1j7vB8kL5nX9qW2eR4",
  "h3k2jP9mN6vC7xZ8pQ1wE3rT5yU", "kL9pQ2wE4rT6yU8iO0P1aS3dF5g",
  "6KEb5mvq1qBgW0ptN9kzkqYfF7z"
];

[1,2,3,4].forEach(n => {
  const fila = document.getElementById('fila' + n);
  if (!fila) return;

  posters.forEach(code => {
    const div = document.createElement('div');
    div.className = 'pelicula';
    div.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500/${code}.jpg" 
           loading="lazy" 
           alt="Póster película">
    `;
    fila.appendChild(div);
  });
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