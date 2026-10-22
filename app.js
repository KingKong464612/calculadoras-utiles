// Theme toggle
const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme') || (prefersLight ? 'light' : 'dark');
if (savedTheme === 'light') { body.classList.add('light'); if (themeBtn) themeBtn.textContent = '☀️'; }
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
navBtns.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));

// Tool cards
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => { const go = card.dataset.go; if (go) showSection(go); });
});

// Search
const searchInput = document.getElementById('searchTools');
function filterTools(q) {
  const cards = document.querySelectorAll('.tool-card');
  const query = (q || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  cards.forEach(card => {
    const text = (card.textContent || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    card.style.display = text.includes(query) ? '' : 'none';
  });
}
if (searchInput) searchInput.addEventListener('input', () => filterTools(searchInput.value));

// IMC
const imcForm = document.getElementById('imcForm');
if (imcForm) imcForm.addEventListener('submit', e => {
  e.preventDefault();
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value) / 100;
  const imc = peso / (altura * altura);
  let cat = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Normal' : imc < 30 ? 'Sobrepeso' : 'Obesidad';
  document.getElementById('imcResult').innerHTML = `<strong>IMC: ${imc.toFixed(1)}</strong><br>${cat}`;
});

// Porcentaje
const porcForm = document.getElementById('porcForm');
if (porcForm) porcForm.addEventListener('submit', e => {
  e.preventDefault();
  const tipo = document.getElementById('tipo').value;
  const v1 = parseFloat(document.getElementById('v1').value);
  const v2 = parseFloat(document.getElementById('v2').value);
  let res = tipo === 'de' ? (v1 / 100) * v2 : v2 - (v2 * v1 / 100);
  document.getElementById('porcResult').innerHTML = `<strong>Resultado: ${res.toFixed(2)}</strong>`;
});

// Edad
const edadForm = document.getElementById('edadForm');
if (edadForm) edadForm.addEventListener('submit', e => {
  e.preventDefault();
  const fecha = new Date(document.getElementById('fecha').value);
  const hoy = new Date();
  let anos = hoy.getFullYear() - fecha.getFullYear();
  let meses = hoy.getMonth() - fecha.getMonth();
  let dias = hoy.getDate() - fecha.getDate();
  if (dias < 0) { meses--; dias += 30; }
  if (meses < 0) { anos--; meses += 12; }
  document.getElementById('edadResult').innerHTML = `<strong>${anos} años, ${meses} meses, ${dias} días</strong>`;
});

// Préstamo
const prestamoForm = document.getElementById('prestamoForm');
if (prestamoForm) prestamoForm.addEventListener('submit', e => {
  e.preventDefault();
  const cap = parseFloat(document.getElementById('capital').value);
  const tasa = parseFloat(document.getElementById('tasa').value) / 100 / 12;
  const n = parseFloat(document.getElementById('plazo').value) * 12;
  const cuota = cap * (tasa * Math.pow(1+tasa, n)) / (Math.pow(1+tasa, n) - 1);
  document.getElementById('prestamoResult').innerHTML = `<strong>Cuota mensual: ${cuota.toFixed(2)} €</strong>`;
});

// IVA
const ivaForm = document.getElementById('ivaForm');
if (ivaForm) ivaForm.addEventListener('submit', e => {
  e.preventDefault();
  const imp = parseFloat(document.getElementById('importe').value);
  const tipo = parseFloat(document.getElementById('tipoIva').value) / 100;
  const modo = document.getElementById('modo').value;
  let res = modo === 'mas' ? imp * (1 + tipo) : imp / (1 + tipo);
  document.getElementById('ivaResult').innerHTML = `<strong>Resultado: ${res.toFixed(2)} €</strong>`;
});

// Interés compuesto
const interesForm = document.getElementById('interesForm');
if (interesForm) interesForm.addEventListener('submit', e => {
  e.preventDefault();
  const p = parseFloat(document.getElementById('principal').value);
  const r = parseFloat(document.getElementById('tasaInt').value) / 100;
  const t = parseFloat(document.getElementById('anos').value);
  const vf = p * Math.pow(1 + r, t);
  document.getElementById('interesResult').innerHTML = `<strong>Valor futuro: ${vf.toLocaleString('es-ES', {minimumFractionDigits: 2})} €</strong>`;
});

console.log('Calculadoras cargadas');