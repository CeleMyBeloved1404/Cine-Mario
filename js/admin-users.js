// --- js/admin-users.js ---

document.addEventListener('DOMContentLoaded', () => {
  // --- MODALES DE BOOTSTRAP ---
  const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
  const modalEliminar = new bootstrap.Modal(document.getElementById('confirmarEliminarUsuario'));

  // --- ELEMENTOS DEL DOM ---
  const tbody = document.getElementById('cuerpoTablaUsuarios');
  const editUserForm = document.getElementById('editUserForm');
  const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');

  // --- "BASE DE DATOS" DE USUARIOS ---
  // Intentamos cargar desde localStorage, si no, usamos datos de ejemplo
  const DB_KEY = 'cineMarioUsers';
  let usuariosDB = JSON.parse(localStorage.getItem(DB_KEY));

  // Si no hay nada en localStorage, creamos datos de ejemplo y los guardamos
  if (!usuariosDB || usuariosDB.length === 0) {
    usuariosDB = [
      { id: 1, username: 'Admin General', email: 'admin@cinemario.com', password: '123', rol: 'Admin' },
      { id: 2, username: 'Cele MyBeloved', email: 'cele@ejemplo.com', password: '123', rol: 'Usuario' },
      { id: 3, username: 'Usuario Prueba', email: 'test@ejemplo.com', password: '123', rol: 'Usuario' }
    ];
    // Guardamos los datos de ejemplo
    localStorage.setItem(DB_KEY, JSON.stringify(usuariosDB));
  }
  
  // --- FUNCIÓN PARA GUARDAR EN LOCALSTORAGE ---
  function guardarDB() {
    localStorage.setItem(DB_KEY, JSON.stringify(usuariosDB));
  }

  // --- FUNCIÓN PARA "PINTAR" LOS USUARIOS EN LA TABLA ---
  function renderizarUsuarios() {
    tbody.innerHTML = ''; // Limpiar tabla
    usuariosDB.forEach(user => {
      const row = document.createElement('tr');
      row.setAttribute('data-id', user.id);
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.email}</td>
        <td>
          <span class="badge ${user.rol === 'Admin' ? 'bg-danger' : 'bg-primary'}">${user.rol}</span>
        </td>
        <td>
          <button class="btn btn-sm btn-warning btn-editar">Editar</button>
          <button class="btn btn-sm btn-danger btn-eliminar">Eliminar</button>
        </td>
      `;
      tbody.appendChild(row);
    });
  }

  // --- LISTENER PRINCIPAL PARA LA TABLA (EDITAR Y ELIMINAR) ---
  tbody.addEventListener('click', (e) => {
    const fila = e.target.closest('tr');
    if (!fila) return;

    const userId = fila.getAttribute('data-id');
    const usuario = usuariosDB.find(u => u.id == userId);

    // --- Botón EDITAR ---
    if (e.target.classList.contains('btn-editar')) {
      // 1. Rellenar el modal con los datos del usuario
      document.getElementById('editUserName').value = usuario.username;
      document.getElementById('editUserEmail').value = usuario.email;
      document.getElementById('editUserRole').value = usuario.rol;
      
      // 2. Guardar el ID en el formulario para saber a quién editamos
      editUserForm.setAttribute('data-editing-id', userId);
      
      // 3. Abrir el modal de edición
      modalEditar.show();
    }

    // --- Botón ELIMINAR ---
    if (e.target.classList.contains('btn-eliminar')) {
      // 1. Poner el nombre del usuario en el modal de confirmación
      const modalBody = document.getElementById('confirmarEliminarUsuario').querySelector('.modal-body');
      modalBody.textContent = `¿Estás seguro de que quieres eliminar a ${usuario.username}?`;

      // 2. Guardar el ID en el botón "Eliminar" del modal
      btnConfirmarDelete.setAttribute('data-id-borrar', userId);
      
      // 3. Abrir el modal de confirmación
      modalEliminar.show();
    }
  });

  // --- LISTENER PARA GUARDAR CAMBIOS (MODAL EDITAR) ---
  editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const userId = editUserForm.getAttribute('data-editing-id');
    
    // 1. Actualizar el usuario en nuestra "base de datos"
    const usuarioIndex = usuariosDB.findIndex(u => u.id == userId);
    if (usuarioIndex > -1) {
      usuariosDB[usuarioIndex].username = document.getElementById('editUserName').value;
      usuariosDB[usuarioIndex].email = document.getElementById('editUserEmail').value;
      usuariosDB[usuarioIndex].rol = document.getElementById('editUserRole').value;
    }
    
    // 2. Guardar en localStorage y volver a pintar
    guardarDB();
    renderizarUsuarios();
    
    // 3. Cerrar el modal
    modalEditar.hide();
  });

  // --- LISTENER PARA CONFIRMAR ELIMINACIÓN (MODAL ELIMINAR) ---
  btnConfirmarDelete.addEventListener('click', () => {
    const userId = btnConfirmarDelete.getAttribute('data-id-borrar');
    
    // 1. Eliminar el usuario de nuestra "base de datos"
    usuariosDB = usuariosDB.filter(u => u.id != userId);
    
    // 2. Guardar en localStorage y volver a pintar
    guardarDB();
    renderizarUsuarios();
    
    // 3. Cerrar el modal
    modalEliminar.hide();
  });


  // --- CARGA INICIAL DE USUARIOS ---
  renderizarUsuarios();
});