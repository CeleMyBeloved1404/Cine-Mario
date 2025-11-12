// --- js/login.js (Conectado a PHP) ---

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) {
      alert('Email y contraseña son obligatorios.');
      return;
    }

    // 1. Enviar datos al backend (PHP)
    try {
      const response = await fetch('../api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: email, password: password })
      });

      const result = await response.json();

      if (result.success) {
        // ¡ÉXITO! El backend creó la sesión.
        // Ya no necesitamos guardar nada en sessionStorage/localStorage.
        
        // 2. Redirigir según el rol
        if (result.user.rol === 'Admin') {
          alert('Inicio de sesión exitoso. Bienvenido, Admin.');
          window.location.href = 'admin-films.html';
        } else {
          alert('Inicio de sesión exitoso. Bienvenido a Cine Mario.');
          window.location.href = 'peliculas.html';
        }
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Hubo un problema al conectar con el servidor.');
    }
  });
});