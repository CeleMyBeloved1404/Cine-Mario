// --- js/configuracion.js (Con guardado de foto) ---

document.addEventListener('DOMContentLoaded', () => {

  // --- OBTENER DATOS Y ELEMENTOS ---
  const DB_KEY = 'cineMarioUsers';
  const profileForm = document.getElementById('profile-form');
  const passwordForm = document.getElementById('password-form');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const profilePicInput = document.getElementById('profile-pic');
  const profilePicPreview = document.getElementById('profile-pic-preview');

  // URL de un placeholder genérico
  const placeholderAvatar = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQyq2rRcrHq_GLOLcFacebookT-n3nNAlGrLRQ0A&s';

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
  // Mostramos la foto guardada (o el placeholder)
  profilePicPreview.src = currentUser.profilePic || placeholderAvatar;

  // --- LÓGICA 0: VISTA PREVIA INMEDIATA AL SELECCIONAR FOTO ---
  profilePicInput.addEventListener('change', () => {
    const file = profilePicInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        // Mostramos la foto que se acaba de seleccionar
        profilePicPreview.src = e.target.result;
      };
      reader.readAsDataURL(file); // Convertir el archivo a base64
    }
  });


  // --- LÓGICA 1: EDITAR PERFIL (Nombre y Foto) ---
  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newUsername = document.getElementById('username').value;
    const file = profilePicInput.files[0];

    // 1. Actualizar el nombre en la BD y Sesión
    usersDB[userIndexInDB].username = newUsername;
    loggedInUserSession.username = newUsername;

    // 2. Si el usuario subió una foto nueva, la procesamos
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result;

        // Guardar la foto (como texto base64) en BD y Sesión
        usersDB[userIndexInDB].profilePic = base64Image;
        loggedInUserSession.profilePic = base64Image;

        // Guardar todo
        saveAndReload();
      };
      reader.readAsDataURL(file); // Inicia la conversión
    } else {
      // Si no subió foto, solo guardamos el nombre
      saveAndReload();
    }
  });

  function saveAndReload() {
    localStorage.setItem(DB_KEY, JSON.stringify(usersDB));
    sessionStorage.setItem('loggedInUser', JSON.stringify(loggedInUserSession));
    
    alert('Perfil actualizado correctamente.');
    location.reload(); // Recargar para que el navbar se actualice
  }

  // --- LÓGICA 2: CAMBIAR CONTRASEÑA ---
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

  // --- LÓGICA 3: DESACTIVAR CUENTA ---
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