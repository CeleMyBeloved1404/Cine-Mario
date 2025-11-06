document.getElementById('addForm').addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  const type = document.getElementById('type').value;
  const duration = document.getElementById('duration').value;
  const year = document.getElementById('year').value;
  const image = document.getElementById('image').value;

  const tbody = document.getElementById('tbody');
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${tbody.children.length + 1}</td>
    <td>${title}</td>
    <td>${category}</td>
    <td>${type}</td>
    <td>${duration}</td>
    <td>${year}</td>
    <td><i class="bi bi-check-circle-fill text-success"></i></td>
    <td><button class="btn btn-sm btn-danger">Borrar</button></td>
  `;
  tbody.appendChild(row);

  // Añadir imagen al carrusel
  const carousel = document.getElementById('carouselItems');
  const item = document.createElement('div');
  item.classList.add('carousel-item');
  item.innerHTML = `<img src="${image}" class="d-block w-100" alt="${title}" data-bs-toggle="modal" data-bs-target="#imgModal1">`;
  carousel.appendChild(item);

  const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
  modal.hide();
  e.target.reset();
});
// ==== MODAL FUNCIONAL Y ESTABLE ====
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const guardarImagen = document.getElementById('guardarImagen');
const fileInput = document.getElementById('imagenFile');
const tituloInput = document.getElementById('titulo');
const slidesContainer = document.querySelector('.carousel');

// Abrir modal desde botón o doble clic (agregá un botón si querés)
document.addEventListener('keydown', (e) => {
  if (e.key === "a" && e.altKey) { // Alt + A abre el modal
    modal.style.display = 'flex';
  }
});

// Cerrar modal con botón, clic afuera o tecla ESC
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") modal.style.display = 'none';
});

// Guardar imagen seleccionada
guardarImagen.addEventListener('click', () => {
  const file = fileInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newSlide = document.createElement('div');
      newSlide.classList.add('slide');
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = tituloInput.value || "Nueva película";
      newSlide.appendChild(img);
      slidesContainer.appendChild(newSlide);
      modal.style.display = 'none';
      tituloInput.value = "";
      fileInput.value = "";
    };
    reader.readAsDataURL(file);
  } else {
    alert("Selecciona una imagen antes de guardar.");
  }
});
