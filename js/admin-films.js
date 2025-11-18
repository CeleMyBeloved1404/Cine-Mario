// --- js/admin-films.js (Con subida de archivos) ---

document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('addForm');
  const tbody = document.getElementById('tbody');
  const carouselItems = document.getElementById('carouselItems');
  const addModal = new bootstrap.Modal(document.getElementById('addModal'));
  const directorSelect = document.getElementById('director');

  // --- 1. FUNCIÓN PARA CARGAR DIRECTORES (Sin cambios) ---
  async function cargarDirectores() {
    try {
      const response = await fetch('../api/peliculas_crud.php?action=get_directors');
      const data = await response.json();
      if (data.success) {
        directorSelect.innerHTML = '<option value="">-- Seleccionar Director --</option>';
        data.directores.forEach(dir => {
          const option = document.createElement('option');
          option.value = dir.id_director;
          option.textContent = dir.nombre;
          directorSelect.appendChild(option);
        });
      }
    } catch (error) {
      console.error('Error al cargar directores:', error);
    }
  }

  // --- 2. FUNCIÓN PARA CARGAR TODAS LAS PELÍCULAS (Sin cambios) ---
  async function cargarContenido() {
    try {
      const response = await fetch('../api/peliculas_crud.php?action=read');
      if (response.status === 403) {
          alert('Acceso denegado. No tienes permisos de administrador.');
          window.location.href = 'peliculas.html';
          return;
      }
      const data = await response.json();

      if (data.success) {
        tbody.innerHTML = '';
        carouselItems.innerHTML = '';
        
        if (data.peliculas.length === 0) {
            carouselItems.innerHTML = '<div class="carousel-item active"><img src="../images/placeholder.jpg" class="d-block w-100" alt="Ejemplo"></div>';
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay contenido en la base de datos.</td></tr>';
            return;
        }

        data.peliculas.forEach((peli, index) => {
          // Rellenar la TABLA
          const row = document.createElement('tr');
          row.setAttribute('data-id', peli.id);
          row.innerHTML = `
            <td>${peli.id}</td>
            <td>${peli.titulo}</td>
            <td>${peli.categoria}</td>
            <td>${peli.director_nombre || 'N/A'}</td>
            <td>${peli.tipo}</td>
            <td>${peli.ano}</td>
            <td><i class="bi ${peli.publicado ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}"></i></td>
            <td>
              <button class="btn btn-sm btn-warning btn-editar" disabled>Editar</button>
              <button class="btn btn-sm btn-danger btn-borrar">Borrar</button>
            </td>
          `;
          tbody.appendChild(row);

          // Rellenar el CARRUSEL
          const item = document.createElement('div');
          item.className = index === 0 ? 'carousel-item active' : 'carousel-item';
          item.innerHTML = `<img src="${peli.imagen_url}" class="d-block w-100" alt="${peli.titulo}">`;
          carouselItems.appendChild(item);
        });
      }
    } catch (error) {
      console.error('Error al cargar contenido:', error);
    }
  }

  // --- 3. FUNCIÓN PARA CREAR NUEVO CONTENIDO (¡MODIFICADA!) ---
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- INICIO DE CAMBIOS ---
    // 1. Ya no creamos un objeto JSON, creamos FormData
    const formData = new FormData();
    
    // 2. Adjuntamos todos los campos de texto
    formData.append('title', document.getElementById('title').value);
    formData.append('category', document.getElementById('category').value);
    formData.append('synopsis', document.getElementById('synopsis').value);
    formData.append('id_director', document.getElementById('director').value);
    formData.append('type', document.getElementById('type').value);
    formData.append('duration', document.getElementById('duration').value);
    formData.append('year', document.getElementById('year').value);
    
    // 3. Adjuntamos el ARCHIVO
    const imageInput = document.getElementById('image');
    if (imageInput.files.length > 0) {
        formData.append('image', imageInput.files[0]);
    } else {
        alert('Por favor, selecciona una imagen.');
        return;
    }
    // --- FIN DE CAMBIOS ---

    try {
      // --- INICIO DE CAMBIOS EN FETCH ---
      const response = await fetch('../api/peliculas_crud.php?action=create', {
        method: 'POST',
        // 4. NO establecemos Content-Type, el navegador lo hace por nosotros
        //    cuando enviamos FormData.
        body: formData // 5. Enviamos el objeto FormData directamente
      });
      // --- FIN DE CAMBIOS EN FETCH ---
      
      const result = await response.json();

      if (result.success) {
        alert(result.message);
        addForm.reset();
        addModal.hide();
        cargarContenido(); 
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error('Error al crear contenido:', error);
      alert('Error de conexión al subir el archivo.');
    }
  });

  // --- 4. FUNCIÓN PARA BORRAR CONTENIDO (Sin cambios) ---
  tbody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-borrar')) {
      const fila = e.target.closest('tr');
      const id = fila.getAttribute('data-id');
      const titulo = fila.children[1].textContent;

      if (confirm(`¿Seguro que quieres eliminar "${titulo}"?`)) {
        try {
          const response = await fetch('../api/peliculas_crud.php?action=delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
          });
          const result = await response.json();

          if (result.success) {
            alert(result.message);
            cargarContenido();
          } else {
            alert('Error: ' + result.message);
          }
        } catch (error) {
          console.error('Error al eliminar:', error);
        }
      }
    }
  });


  // --- CARGA INICIAL ---
  cargarContenido();
  cargarDirectores(); 
  
});