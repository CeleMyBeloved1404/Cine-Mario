// --- js/registro.js (Conectado a PHP) ---

document.addEventListener('DOMContentLoaded', () => {
  const registroForm = document.querySelector('form');

  registroForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Evitamos que el formulario se envíe por HTML

    // 1. Obtener valores
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // 2. Enviar los datos al backend (PHP)
    try {
      const response = await fetch('../api/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          email: email,
          password: password
        })
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.href = 'login.html'; // Redirigir al login
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('Hubo un problema al conectar con el servidor.');
    }
  });
});