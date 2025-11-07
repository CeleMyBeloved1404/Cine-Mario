// --- js/configuracion.js (Simplificado, SIN foto) ---

document.addEventListener('DOMContentLoaded', () => {

  // --- OBTENER DATOS Y ELEMENTOS ---
  const DB_KEY = 'cineMarioUsers';
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');

  // CAMBIO: Eliminadas las referencias a profilePicInput y profilePicPreview
  // CAMBIO: Eliminado el placeholderAvatar

  // 1. Obtener la sesión actual
  const loggedInUserSession = JSON.parse(sessionStorage.getItem('loggedInUser'));
  if (!loggedInUserSession) return;

  // 2. Obtener la "Base de Datos" COMPLETA
  let usersDB = JSON.parse(localStorage.getItem(DB_KEY)) || [];

  // 3. Encontrar el índice del usuario actual en la BD
  const userIndexInDB = usersDB.findIndex(user => user.id === loggedInUserSession.id);
  if (userIndexInDB === -1) {
    console.error('Error fatal: El usuario de la sesión no se encuentra en la BD.');
    return;
  }
  const currentUser = usersDB[userIndexInDB];

  // 4. Rellenar el formulario con los datos actuales
  document.getElementById('username').value = currentUser.username;
  // CAMBIO: Eliminada la línea que rellenaba profilePicPreview.src

  // CAMBIO: Eliminada la LÓGICA 0 (Vista previa)


  // --- LÓGICA 1: EDITAR PERFIL (Solo Nombre) ---
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('username').value;
    
    // 1. Actualizar el nombre en la BD y Sesión
    usersDB[userIndexInDB].username = newUsername;
    loggedInUserSession.username = newUsername;

    // CAMBIO: Eliminada toda la lógica de 'if (file)' y 'FileReader'
    
    // 2. Guardar y recargar
    saveAndReload();
  });

  function saveAndReload() {
    localStorage.setItem(DB_KEY, JSON.stringify(usersDB));
    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUserSession));
    
    alert('Perfil actualizado correctamente.');
    location.reload(); // Recargar para que el navbar se actualice
  }

  // --- LÓGICA 2: CAMBIAR CONTRASEÑA (Sin cambios) ---
  passwordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (newPassword !== confirmPassword) {
      alert('Las nuevas contraseñas no coinciden.');
      return;
    }
    if (currentUser.password !== currentPassword) {
      alert('La contraseña actual es incorrecta.');
      return;
    }
    
    usersDB[userIndexInDB].password = newPassword;
    localStorage.setItem(DB_KEY, JSON.stringify(usersDB));
    alert('Contraseña cambiada exitosamente.');
    passwordForm.reset();
  });

  // --- LÓGICA 3: DESACTIVAR CUENTA (Sin cambios) ---
  btnConfirmDelete.addEventListener('click', () => {
    const confirmPassword = document.getElementById('delete-confirm-password').value;
    if (confirmPassword !== currentUser.password) {
      alert('Contraseña incorrecta. Desactivación cancelada.');
      return;
    }

    usersDB.splice(userIndexInDB, 1);
    localStorage.setItem(DB_KEY, JSON.stringify(usersDB));
    sessionStorage.removeItem('loggedInUser');

    alert('Tu cuenta ha sido desactivada. Serás redirigido al inicio.');
    window.location.href = '../index.html';
  });

});