// --- js/contacto.js ---

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // 1. Prevenimos el envío real del formulario
      e.preventDefault(); 
      
      // 2. Simulamos el éxito
      alert('¡Mensaje enviado! (Simulación Frontend)\n\nGracias por contactarnos, te responderemos a la brevedad.');
      
      // 3. Limpiamos el formulario
      contactForm.reset();
    });
  }
});