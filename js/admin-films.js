document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('addForm');
  const tbody = document.getElementById('tbody');
  const carouselItems = document.getElementById('carouselItems');
  const addModal = new bootstrap.Modal(document.getElementById('addModal'));

  // --- 1. FUNCIÓN PARA CARGAR TODAS LAS PELÍCULAS ---
  async function cargarContenido() {
    try {
      const response = await fetch('http://localhost:5000/api/peliculas');

      if (response.status === 403) {
        alert('Acceso denegado. No tienes permisos de administrador.');
        window.location.href = 'peliculas.html';
        return;
      }

      const data = await response.json();

      // Limpiamos la tabla y el carrusel
      tbody.innerHTML = '';
      carouselItems.innerHTML = '';

      if (data.length === 0) {
        carouselItems.innerHTML = '<div class="carousel-item active"><img src="../images/placeholder.jpg" class="d-block w-100" alt="Ejemplo"></div>';
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay contenido en la base de datos.</td></tr>';
        return;
      }

      data.forEach((peli, index) => {
        // --- TABLA ---
        const row = document.createElement('tr');
        row.setAttribute('data-id', peli.id);

        row.innerHTML = `
          <td>${peli.id}</td>
          <td>${peli.titulo}</td>
          <td>${peli.categoria}</td>
          <td>${peli.tipo}</td>
          <td>${peli.ano}</td>
          <td><i class="bi ${peli.publicado ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}"></i></td>
          <td>
            <button class="btn btn-sm btn-warning btn-editar" disabled>Editar</button>
            <button class="btn btn-sm btn-danger btn-borrar">Borrar</button>
          </td>
        `;

        tbody.appendChild(row);

        // --- CARRUSEL ---
        const item = document.createElement('div');
        item.className = index === 0 ? 'carousel-item active' : 'carousel-item';

        item.innerHTML = `<img src="${peli.imagen_url}" class="d-block w-100" alt="${peli.titulo}">`;

        carouselItems.appendChild(item);
      });

    } catch (error) {
      console.error('Error al cargar contenido:', error);
    }
  }

  // --- 2. CREAR NUEVA PELÍCULA ---
  addForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      titulo: document.getElementById('title').value,
      categoria: document.getElementById('category').value,
      sinopsis: document.getElementById('synopsis').value,
      tipo: document.getElementById('type').value,
      duracion: document.getElementById('duration').value,
      ano: document.getElementById('year').value,
      imagen_url: document.getElementById('image').value
    };

    try {
      const response = await fetch('http://localhost:5000/api/peliculas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

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
    }
  });

  // --- 3. BORRAR PELÍCULA ---
  tbody.addEventListener('click', async (e) => {
    if (e.target.classList.contains('btn-borrar')) {

      const fila = e.target.closest('tr');
      const id = fila.getAttribute('data-id');
      const titulo = fila.children[1].textContent;

      if (confirm(`¿Seguro que quieres eliminar "${titulo}"?`)) {
        try {
          const response = await fetch(`http://localhost:5000/api/peliculas/${id}`, {
            method: 'DELETE'
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
});
