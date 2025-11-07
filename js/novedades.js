// --- js/novedades.js ---

document.addEventListener('DOMContentLoaded', () => {

  // 1. "Base de datos" de ejemplo para las noticias
  // (Puedes usar imágenes que ya existen)
  const mockNovedades = [
    {
      id: 1,
      titulo: '¡Lanzamiento de Cine Mario!',
      fecha: '07 Nov, 2025',
      snippet: 'La nueva plataforma de streaming ya está disponible.',
      imagen: '../images/placeholder.jpg' // Puedes cambiar esto por una captura de tu admin
    },
    {
      id: 2,
      titulo: 'Spider-Verse se une al catálogo',
      fecha: '05 Nov, 2025',
      snippet: 'Prepárate para saltar entre dimensiones. "Spider-Man: Across the Spider-Verse" ya está disponible en la sección de Animación.',
      imagen: '../images/peliculas/animacion6.jpg' //
    },
    {
      id: 3,
      titulo: 'El regreso de John Wick',
      fecha: '03 Nov, 2025',
      snippet: 'La saga de acción más aclamada vuelve. Disfruta de la maratón completa de John Wick este fin de semana.',
      imagen: '../images/peliculas/accion3.jpg' //
    }
  ];

  // 2. El contenedor donde pintaremos las tarjetas
  const gridContainer = document.getElementById('novedades-grid-container');

  if (gridContainer) {
    // 3. Limpiamos el grid (por si acaso)
    gridContainer.innerHTML = '';
    
    // 4. Recorremos la "base de datos" y creamos el HTML
    mockNovedades.forEach(novedad => {
      const card = document.createElement('div');
      card.className = 'novedad-card';
      
      card.innerHTML = `
        <img src="${novedad.imagen}" alt="${novedad.titulo}">
        <div class="novedad-card-content">
          <div class="novedad-card-date">${novedad.fecha}</div>
          <h3 class="novedad-card-title">${novedad.titulo}</h3>
          <p class="novedad-card-snippet">${novedad.snippet}</p>
          <a href="#" class="novedad-card-link">Leer más</a>
        </div>
      `;
      
      gridContainer.appendChild(card);
    });
  }
});