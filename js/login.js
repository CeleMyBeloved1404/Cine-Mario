// --- js/login.js ---

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form'); // Asume que solo hay un form
  const DB_KEY = 'cineMarioUsers'; // La misma "base de datos"

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Obtener valores
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Email y contraseña son obligatorios.');
      return;
    }

    // 2. Obtener usuarios
    const usuarios = JSON.parse(localStorage.getItem(DB_KEY)) || [];

    // 3. Buscar al usuario
    const usuarioEncontrado = usuarios.find(user => user.email === email && user.password === password);

    if (usuarioEncontrado) {
      // 4. ¡ÉXITO! Creamos la "sesión"
      // sessionStorage se borra solo cuando se cierra el navegador
      sessionStorage.setItem('loggedInUser', JSON.stringify(usuarioEncontrado));
      
      // 5. Redirigir según el rol
      if (usuarioEncontrado.rol === 'Admin') {
        alert('Inicio de sesión exitoso. Bienvenido, Admin.');
        window.location.href = 'admin-films.html'; // Redirigir al panel de admin
      } else {
        alert('Inicio de sesión exitoso. Bienvenido a Cine Mario.');
        window.location.href = 'peliculas.html'; // Redirigir a la página principal
      }
    } else {
      // 5. FRACASO
      alert('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
    }
  });
});