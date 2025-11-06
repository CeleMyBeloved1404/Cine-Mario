document.addEventListener('DOMContentLoaded', () => {
  const addForm = document.getElementById('addForm');
  const tbody = document.getElementById('tbody');
  const addModal = document.getElementById('addModal');
  const addModalLabel = document.getElementById('addModalLabel');
  const imageInputContainer = document.getElementById('image').parentElement;
  
  // Instancia del Modal de Bootstrap
  const modal = new bootstrap.Modal(addModal);

  // --- FUNCIÓN PRINCIPAL DEL FORMULARIO (CREAR O EDITAR) ---
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const editingId = addForm.getAttribute('data-editing-id');
    
    // Obtener valores comunes
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;
    const type = document.getElementById('type').value;
    const duration = document.getElementById('duration').value;
    const year = document.getElementById('year').value;

    if (editingId) {
      // --- MODO EDICIÓN ---
      // Actualizar la fila de la tabla
      const fila = tbody.querySelector(`tr[data-id="${editingId}"]`);
      if (fila) {
        fila.children[1].textContent = title;
        fila.children[2].textContent = category;
        fila.children[3].textContent = type;
        fila.children[4].textContent = duration;
        fila.children[5].textContent = year;
      }
      
      // Actualizar el 'alt' de la imagen en el carrusel
      const itemCarrusel = document.querySelector(`.carousel-item[data-id="${editingId}"] img`);
      if (itemCarrusel) {
        itemCarrusel.alt = title;
      }
      
      modal.hide();

    } else {
      // --- MODO CREACIÓN ---
      const imageInput = document.getElementById('image');
      const file = imageInput.files[0];

      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target.result;
          const peliId = `peli-${Date.now()}`; // ID único

          // 1. Añadir a la TABLA
          const row = document.createElement('tr');
          row.setAttribute('data-id', peliId);
          row.innerHTML = `
            <td>${tbody.children.length + 1}</td>
            <td>${title}</td>
            <td>${category}</td>
            <td>${type}</td>
            <td>${duration}</td>
            <td>${year}</td>
            <td><i class="bi bi-check-circle-fill text-success"></i></td>
            <td>
              <button class="btn btn-sm btn-warning btn-editar">Editar</button>
              <button class="btn btn-sm btn-danger btn-borrar">Borrar</button>
            </td>
          `;
          tbody.appendChild(row);

          // 2. Añadir al CARRUSEL
          const carousel = document.getElementById('carouselItems');
          const placeholder = carousel.querySelector('img[src="../images/placeholder.jpg"]');
          const isActive = (carousel.children.length === 0 || !!placeholder);

          if (placeholder) {
            placeholder.closest('.carousel-item').remove();
          }

          const item = document.createElement('div');
          item.classList.add('carousel-item');
          if (isActive) {
            item.classList.add('active');
          }
          item.setAttribute('data-id', peliId);
          item.innerHTML = `<img src="${imageUrl}" class="d-block w-100" alt="${title}" data-bs-toggle="modal" data-bs-target="#imgModal1">`;
          carousel.appendChild(item);

          modal.hide();
        };
        reader.readAsDataURL(file);
      } else {
        alert("Por favor, selecciona una imagen.");
      }
    }
  });

  // --- LISTENER PARA BOTONES DE LA TABLA (EDITAR Y BORRAR) ---
  tbody.addEventListener('click', (e) => {
    const fila = e.target.closest('tr');
    if (!fila) return; 

    const peliId = fila.getAttribute('data-id');

    // --- Botón BORRAR ---
    if (e.target.classList.contains('btn-borrar')) {
      const titulo = fila.children[1].textContent;
      
      if (confirm(`¿Seguro que quieres borrar "${titulo}"?`)) {
        // 1. Borrar fila de tabla
        fila.remove();
        
        // 2. Borrar item de carrusel
        const itemCarrusel = document.querySelector(`.carousel-item[data-id="${peliId}"]`);
        if (itemCarrusel) {
          // Si era el activo, pasar 'active' al siguiente
          if (itemCarrusel.classList.contains('active')) {
            const nextItem = itemCarrusel.nextElementSibling || itemCarrusel.previousElementSibling;
            if (nextItem) {
              nextItem.classList.add('active');
            }
          }
          itemCarrusel.remove();
          
          // Si el carrusel quedó vacío, volver a poner el placeholder
          const carousel = document.getElementById('carouselItems');
          if (carousel.children.length === 0) {
            carousel.innerHTML = `
              <div class="carousel-item active">
                <img src="../images/placeholder.jpg" class="d-block w-100" alt="Ejemplo" data-bs-toggle="modal" data-bs-target="#imgModal1">
              </div>`;
          }
        }
      }
    }

    // --- Botón EDITAR ---
    if (e.target.classList.contains('btn-editar')) {
      // Obtener datos de la fila
      const titulo = fila.children[1].textContent;
      const categoria = fila.children[2].textContent;
      const tipo = fila.children[3].textContent;
      const duracion = fila.children[4].textContent;
      const anio = fila.children[5].textContent;

      // Rellenar formulario
      document.getElementById('title').value = titulo;
      document.getElementById('category').value = categoria;
      document.getElementById('type').value = tipo;
      document.getElementById('duration').value = duracion;
      document.getElementById('year').value = anio;
      
      // Ocultar input de imagen (no se puede "re-rellenar" un input file)
      imageInputContainer.style.display = 'none';
      
      // Guardar ID en el form y cambiar título
      addForm.setAttribute('data-editing-id', peliId);
      addModalLabel.textContent = 'Editar Contenido';

      modal.show();
    }
  });

  // --- LIMPIEZA AL CERRAR EL MODAL ---
  // Se dispara cuando el modal termina de ocultarse
  addModal.addEventListener('hidden.bs.modal', () => {
    addForm.reset();
    addForm.removeAttribute('data-editing-id');
    addModalLabel.textContent = 'Añadir nuevo contenido';
    // Siempre mostrar el input de imagen al cerrar
    imageInputContainer.style.display = 'block'; 
  });

});
