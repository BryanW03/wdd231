// script.js — WDD231 Course Home Page
// Contiene todo el JavaScript:
//   1. Navegación responsive (hamburger)
//   2. Año actual y fecha de última modificación
//   3. Lista de cursos con filtros y total de créditos

/* ============================================================
   1. NAVEGACIÓN — Hamburger toggle
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const nav = document.getElementById('main-nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Cerrar nav al hacer clic en un enlace (útil en móvil)
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ============================================================
   2. FECHA — Año actual y última modificación
   ============================================================ */

// Año actual en el footer
const yearSpan = document.getElementById('currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// Fecha de última modificación del documento
const lastModifiedEl = document.getElementById('lastModified');
if (lastModifiedEl) {
  lastModifiedEl.textContent = `Last Modification: ${document.lastModified}`;
}

/* ============================================================
   3. CURSOS — Array, filtros, render y total de créditos

   IMPORTANTE: Cambia "completed: false" a "completed: true"
   en los cursos que ya hayas terminado.
   ============================================================ */
const courses = [
  {
    subject: 'CSE', number: 110,
    title: 'Introduction to Programming',
    credits: 2,
    completed: true   // ← Cambia a false si no lo has terminado
  },
  {
    subject: 'WDD', number: 130,
    title: 'Web Fundamentals',
    credits: 2,
    completed: true   // ← Cambia a false si no lo has terminado
  },
  {
    subject: 'CSE', number: 111,
    title: 'Programming with Functions',
    credits: 2,
    completed: true   // ← Cambia a false si no lo has terminado
  },
  {
    subject: 'CSE', number: 210,
    title: 'Programming with Classes',
    credits: 2,
    completed: false  // ← Cambia a true cuando lo termines
  },
  {
    subject: 'WDD', number: 131,
    title: 'Dynamic Web Fundamentals',
    credits: 2,
    completed: true   // ← Cambia a false si no lo has terminado
  },
  {
    subject: 'WDD', number: 231,
    title: 'Frontend Web Development I',
    credits: 2,
    completed: false  // ← Cambia a true cuando lo termines
  },
];

// Referencias al DOM
const courseList    = document.getElementById('course-list');
const creditTotal   = document.getElementById('credit-total');
const filterButtons = document.querySelectorAll('.filter-btn');

// Función que renderiza las tarjetas de cursos según el filtro
function renderCourses(filter = 'all') {
  if (!courseList) return;

  // Filtrar el array
  const filtered = filter === 'all'
    ? courses
    : courses.filter(c => c.subject === filter);

  // Generar tarjetas HTML
  courseList.innerHTML = filtered
    .map(course => `
      <div class="course-card ${course.completed ? 'completed' : ''}"
           title="${course.title}${course.completed ? ' ✓ Completado' : ''}">
        ${course.subject} ${course.number}
      </div>
    `)
    .join('');

  // Total de créditos usando reduce()
  const total = filtered.reduce((sum, c) => sum + c.credits, 0);
  if (creditTotal) {
    creditTotal.textContent = `The total credits for courses listed above is ${total}`;
  }
}

// Eventos de los botones de filtro
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderCourses(btn.dataset.filter);
  });
});

// Render inicial — mostrar todos los cursos al cargar
renderCourses('all');