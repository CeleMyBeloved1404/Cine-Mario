// --- js/registro.js ---

document.addEventListener('DOMContentLoaded', () => {
  const registroForm = document.querySelector('form'); // Asume que solo hay un form
  const DB_KEY = 'cineMarioUsers'; // Nuestra "base de datos"

  registroForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Obtener valores del formulario
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!username || !email || !password) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    // 2. Obtener la "base de datos" de localStorage
    // Si no existe, crea un array vacío
    let usuarios = JSON.parse(localStorage.getItem(DB_KEY)) || [];

    // 3. Verificar si el email ya está registrado
    const usuarioExistente = usuarios.find(user => user.email === email);
    if (usuarioExistente) {
      alert('El correo electrónico ya está registrado.');
      return;
    }

    // 4. Crear el nuevo usuario (añadimos un rol por defecto)
    const nuevoUsuario = {
      id: Date.now(), // ID único simple
      username: username,
      email: email,
      password: password, // NOTA: En un backend real, NUNCA guardes contraseñas en texto plano.
      rol: 'Usuario' // Rol por defecto
    };
    
    // 5. Agregar el nuevo usuario y guardar en localStorage
    usuarios.push(nuevoUsuario);
    localStorage.setItem(DB_KEY, JSON.stringify(usuarios));

    // 6. Informar al usuario y redirigir
    alert('¡Registro exitoso! Ahora serás redirigido al login.');
    window.location.href = 'login.html'; // Redirige a la página de login
  });
});