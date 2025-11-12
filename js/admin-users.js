// --- js/admin-users.js (Conectado a PHP) ---

document.addEventListener('DOMContentLoaded', () => {
  const tbody = document.getElementById('cuerpoTablaUsuarios');
  const modalEditar = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
  const modalEliminar = new bootstrap.Modal(document.getElementById('confirmarEliminarUsuario'));
  const editUserForm = document.getElementById('editUserForm');
  const btnConfirmarDelete = document.getElementById('btn-confirmar-delete');

  let currentEditingUserId = null;
  let currentDeletingUserId = null;

  // --- FUNCIÓN PARA CARGAR Y "PINTAR" LOS USUARIOS DESDE LA BD ---
  async function renderizarUsuarios() {
    try {
      const response = await fetch('../api/get_users.php');
      if (response.status === 403) { // Error de Admin
          alert('Acceso denegado. No tienes permisos de administrador.');
          window.location.href = 'peliculas.html';
          return;
      }
      const data = await response.json();

      if (data.success) {
        tbody.innerHTML = ''; // Limpiar tabla
        data.users.forEach(user => {
          const row = document.createElement('tr');
          // Guardamos los datos en el elemento para usarlos después
          row.setAttribute('data-id', user.id);
          row.setAttribute('data-username', user.username);
          row.setAttribute('data-email', user.email);
          row.setAttribute('data-rol', user.rol);
          
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
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    }
  }

  // --- LISTENER PARA LOS BOTONES DE LA TABLA (EDITAR Y ELIMINAR) ---
  tbody.addEventListener('click', (e) => {
    const fila = e.target.closest('tr');
    if (!fila) return;

    const userId = fila.getAttribute('data-id');

    // --- Botón EDITAR ---
    if (e.target.classList.contains('btn-editar')) {
      // 1. Rellenar el modal con los datos de la fila
      document.getElementById('editUserName').value = fila.getAttribute('data-username');
      document.getElementById('editUserEmail').value = fila.getAttribute('data-email');
      document.getElementById('editUserRole').value = fila.getAttribute('data-rol');
      
      // 2. Guardar el ID del usuario que estamos editando
      currentEditingUserId = userId;
      
      // 3. Abrir el modal de edición
      modalEditar.show();
    }

    // --- Botón ELIMINAR ---
    if (e.target.classList.contains('btn-eliminar')) {
      // 1. Poner el nombre del usuario en el modal
      const modalBody = document.getElementById('confirmarEliminarUsuario').querySelector('.modal-body');
      modalBody.textContent = `¿Estás seguro de que quieres eliminar a ${fila.getAttribute('data-username')}?`;

      // 2. Guardar el ID del usuario que vamos a borrar
      currentDeletingUserId = userId;
      
      // 3. Abrir el modal de confirmación
      modalEliminar.show();
    }
  });

  // --- LISTENER PARA GUARDAR CAMBIOS (MODAL EDITAR) ---
  editUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentEditingUserId) return;

    const newRol = document.getElementById('editUserRole').value;

    try {
      const response = await fetch('../api/update_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_role',
          user_id: currentEditingUserId,
          rol: newRol
        })
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        modalEditar.hide();
        renderizarUsuarios(); // Recargar la tabla
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error al actualizar rol:', error);
    }
  });

  // --- LISTENER PARA CONFIRMAR ELIMINACIÓN (MODAL ELIMINAR) ---
  btnConfirmarDelete.addEventListener('click', async () => {
    if (!currentDeletingUserId) return;

    try {
      const response = await fetch('../api/delete_user.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'admin_delete',
          user_id: currentDeletingUserId
        })
      });
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        modalEliminar.hide();
        renderizarUsuarios(); // Recargar la tabla
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  });

  // --- CARGA INICIAL DE USUARIOS ---
  renderizarUsuarios();
});