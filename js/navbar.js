// navbar.js — comportamiento del navbar (scroll + menú móvil)

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("miNavbar");
  const menuToggle = document.getElementById("menuToggle");
  const navLinks = document.querySelector(".nav-links");

  // Efecto al hacer scroll
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY > 80;
    navbar.classList.toggle("scrolled", scrolled);
  });

  // Menú móvil
  menuToggle?.addEventListener("click", () => {
    navLinks.classList.toggle("active");
  });
});
