// index.js - Todo funcional
let current = 0;
const slides = document.querySelectorAll('.slide');
const total = slides.length;

document.getElementById('next').addEventListener('click', () => {
  current = (current + 1) % total;
  update();
});
document.getElementById('prev').addEventListener('click', () => {
  current = (current - 1 + total) % total;
  update();
});

// Navbar + menú móvil
window.addEventListener('scroll', () => {
  document.getElementById('miNavbar').classList.toggle('scrolled', scrollY > 80);
});
document.getElementById('menuToggle')?.addEventListener('click', () => {
  document.querySelector('.nav-links').classList.toggle('active');
});
