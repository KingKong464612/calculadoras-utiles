// Theme toggle (mejorado + prefers-color-scheme)
const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme') || (prefersLight ? 'light' : 'dark');
if (savedTheme === 'light') {
  body.classList.add('light');
  if (themeBtn) themeBtn.textContent = '☀️';
}
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    body.classList.toggle('light');
    const isLight = body.classList.contains('light');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
    themeBtn.textContent = isLight ? '☀️' : '🌙';
  });
}

// Navigation
const navBtns = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.section');
function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  navBtns.forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`nav button[data-section="${id}"]`);
  if (btn) btn.classList.add('active');
  if (id === 'inicio') {
    const search = document.getElementById('searchTools');
    if (search) { search.value = ''; filterTools(''); }
  }
  window.scrollTo(0, 0);
}
navBtns.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});

// Tool cards
function setupToolCards() {
  document.querySelectorAll('.tool-card').forEach(card => {
    card.addEventListener('click', () => {
      const go = card.dataset.go;
      if (go) showSection(go);
    });
  });
}
setupToolCards();

// Search filter
const searchInput = document.getElementById('searchTools');
function filterTools(q) {
  const cards = document.querySelectorAll('.tool-card');
  const query = q.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  cards.forEach(card => {
    const text = (card.textContent || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    card.style.display = text.includes(query) ? '' : 'none';
  });
}
if (searchInput) {
  searchInput.addEventListener('input', () => filterTools(searchInput.value));
}

console.log('Calculadoras Útiles - JS cargado');