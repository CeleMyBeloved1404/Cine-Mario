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
