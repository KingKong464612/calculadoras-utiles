// Theme toggle (mejorado + prefers-color-scheme)
const themeBtn = document.getElementById('themeBtn');
const body = document.body;
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
const savedTheme = localStorage.getItem('theme') || (prefersLight ? 'light' : 'dark');
function applyTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light');
    themeBtn.textContent = '☀️';
  } else {
    body.classList.remove('light');
    themeBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}
applyTheme(savedTheme);
themeBtn.addEventListener('click', () => {
  const isLight = body.classList.contains('light');
  applyTheme(isLight ? 'dark' : 'light');
});

// Navigation + Hash routing
const navBtns = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.section');
const titles = {
  inicio: 'Calculadoras Útiles | Gratis y Privadas',
  imc: 'Calculadora de IMC',
  porcentaje: 'Calculadora de Porcentaje',
  edad: 'Calculadora de Edad Exacta',
  prestamo: 'Calculadora de Préstamo',
  iva: 'Calculadora de IVA España',
  interes: 'Calculadora de Interés Compuesto',
  fechas: 'Días entre Fechas',
  propina: 'Calculadora de Propina',
  unidades: 'Conversor de Unidades',
  nomina: 'Nómina Aproximada',
  laborables: 'Días Laborables',
  temperatura: 'Conversor de Temperatura',
  countdown: 'Días hasta una Fecha',
  precio: 'Precio por Unidad',
  horas: 'Diferencia de Horas',
  combustible: 'Consumo de Combustible',
  pesoideal: 'Peso Ideal',
  interesimple: 'Interés Simple',
  tdee: 'TDEE / Calorías',
  regla3: 'Regla de Tres',
  imcinverso: 'IMC Inverso',
  historial: 'Historial',
  sobre: 'Sobre',
  privacidad: 'Privacidad',
  sugerencias: 'Sugerencias'
};
function showSection(id) {
  sections.forEach(s => s.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));
  const target = document.getElementById(id);
  if (target) target.classList.add('active');
  const btn = document.querySelector(`nav button[data-section="${id}"]`);
  if (btn) btn.classList.add('active');
  document.title = titles[id] || 'Calculadoras Útiles';
  if (location.hash !== '#' + id) location.hash = id;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
window.showSection = showSection;
navBtns.forEach(btn => btn.addEventListener('click', () => showSection(btn.dataset.section)));
document.querySelectorAll('.tool-card').forEach(card => card.addEventListener('click', () => showSection(card.dataset.go)));
window.addEventListener('hashchange', () => { const hash = location.hash.slice(1) || 'inicio'; if (document.getElementById(hash)) showSection(hash); });
if (location.hash) { const hash = location.hash.slice(1); if (document.getElementById(hash)) showSection(hash); }

function formatEuro(num) { return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
function formatNum(num, decimals = 2) { return num.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }); }
function showResult(id, html) {
  const el = document.getElementById(id);
  el.innerHTML = html + '<br><button class="copy-btn" onclick="copyResult(this)">Copiar resultado</button> <button class="copy-btn" onclick="shareResult(this)">Compartir</button>';
  el.classList.add('show');
}
function shareResult(btn) {
  const text = btn.parentElement.innerText.replace(/Copiar resultado|Compartir/g,'').trim();
  if (navigator.share) navigator.share({ title: document.title, text, url: location.href });
  else { navigator.clipboard.writeText(text + '\n' + location.href); btn.textContent = '¡Enlace copiado!'; setTimeout(()=>btn.textContent='Compartir', 2000); }
}
function copyResult(btn) {
  const text = btn.parentElement.innerText.replace(/Copiar resultado|Compartir/g, '').trim();
  navigator.clipboard.writeText(text).then(() => { btn.textContent = '¡Copiado!'; setTimeout(() => btn.textContent = 'Copiar resultado', 2000); });
}

// Existing calculators remain the same (loaded from previous version)
// New ones:
document.getElementById('tdeeForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const p = +document.getElementById('tdeePeso').value;
  const a = +document.getElementById('tdeeAltura').value;
  const ed = +document.getElementById('tdeeEdad').value;
  const sexo = document.getElementById('tdeeSexo').value;
  const act = +document.getElementById('tdeeAct').value;
  let bmr = sexo === 'h' ? 10*p + 6.25*a - 5*ed + 5 : 10*p + 6.25*a - 5*ed - 161;
  const tdee = Math.round(bmr * act);
  showResult('tdeeResult', `<strong>TDEE aproximado:</strong> ${formatNum(tdee,0)} kcal/día<br><small>Para mantener el peso. Reduce 300-500 kcal para perder grasa.</small>`);
});
document.getElementById('regla3Form')?.addEventListener('submit', e => {
  e.preventDefault();
  const a = +document.getElementById('r3a').value;
  const b = +document.getElementById('r3b').value;
  const c = +document.getElementById('r3c').value;
  const x = (b * c) / a;
  showResult('regla3Result', `<strong>Resultado:</strong> ${formatNum(x)}`);
});
document.getElementById('imcinversoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const alt = +document.getElementById('invAltura').value / 100;
  const imc = +document.getElementById('invImc').value;
  const peso = imc * alt * alt;
  showResult('imcinversoResult', `<strong>Peso necesario:</strong> ${formatNum(peso,1)} kg<br><small>Para un IMC de ${imc}.</small>`);
});
