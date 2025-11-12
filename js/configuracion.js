// --- js/configuracion.js (Conectado a PHP) ---

document.addEventListener('DOMContentLoaded', () => {

  // --- OBTENER ELEMENTOS ---
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const usernameInput = document.getElementById('username');

  // 1. Rellenar el formulario con los datos de la sesión
  // (check_session.php ya se ejecutó en auth.js,
  // pero necesitamos los datos del usuario aquí de nuevo)
  
  // Usamos el 'user' de la sesión que guardó check_session
  // (Nota: Esto es una simplificación, js/auth.js debería guardar esto)
  // Vamos a pedir los datos a la sesión de nuevo
  
  (async () => {
      try {
        const response = await fetch('../api/check_session.php');
        const data = await response.json();
        if (data.loggedIn) {
            usernameInput.value = data.user.username;
        }
      } catch (e) { console.error('Error cargando datos de usuario'); }
  })();


  // --- LÓGICA 1: EDITAR PERFIL (Nombre de usuario) ---
  profileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newUsername = usernameInput.value;
    
    try {
      const response = await fetch('../api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_profile',
          username: newUsername
        })
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        // Recargamos la página para que el navbar (auth.js) muestre el nuevo nombre
        location.reload();
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  });

  // --- LÓGICA 2: CAMBIAR CONTRASEÑA ---
  passwordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const current_password = document.getElementById('current-password').value;
    const new_password = document.getElementById('new-password').value;
    const confirm_password = document.getElementById('confirm-password').value;

    if (new_password !== confirm_password) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }
    
    try {
      const response = await fetch('../api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_password',
          current_password: current_password,
          new_password: new_password
        })
      });
      const result = await response.json();
      
      alert(result.message); // Informa éxito o fracaso
      if (result.success) {
        passwordForm.reset(); // Limpiar los campos
      }

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
    }
  });

  // --- LÓGICA 3: DESACTIVAR CUENTA ---
  btnConfirmDelete.addEventListener('click', async () => {
    const password = document.getElementById('delete-confirm-password').value;
    if (!password) {
      alert('Por favor, ingresa tu contraseña para confirmar.');
      return;
    }

    try {
      const response = await fetch('../api/delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'self_delete',
          password: password
        })
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.href = '../index.html'; // Redirigir a la página de inicio
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Error al desactivar cuenta:', error);
    }
  });

});