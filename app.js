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

// Navigation + Hash routing (páginas individuales vía #)
const navBtns = document.querySelectorAll('nav button');
const sections = document.querySelectorAll('.section');
const titles = {
  inicio: 'Calculadoras Útiles | Gratis y Privadas',
  imc: 'Calculadora de IMC | Índice de Masa Corporal',
  porcentaje: 'Calculadora de Porcentaje | Descuentos y Aumentos',
  edad: 'Calculadora de Edad Exacta',
  prestamo: 'Calculadora de Préstamo e Hipoteca',
  iva: 'Calculadora de IVA España (21%, 10%, 4%)',
  interes: 'Calculadora de Interés Compuesto',
  fechas: 'Calculadora de Días entre Fechas',
  propina: 'Calculadora de Propina',
  unidades: 'Conversor de Unidades',
  nomina: 'Calculadora de Nómina Aproximada',
  laborables: 'Calculadora de Días Laborables',
  temperatura: 'Conversor de Temperatura Celsius Fahrenheit',
  countdown: 'Días hasta una Fecha | Cuenta Atrás',
  precio: 'Calculadora de Precio por Unidad o Kilo',
  horas: 'Calculadora de Diferencia de Horas',
  combustible: 'Calculadora de Consumo de Combustible',
  pesoideal: 'Calculadora de Peso Ideal',
  interesimple: 'Calculadora de Interés Simple',
  tdee: 'TDEE / Calorías',
  regla3: 'Regla de Tres',
  imcinverso: 'IMC Inverso',
  historial: 'Historial de Cálculos',
  sobre: 'Sobre Calculadoras Útiles',
  privacidad: 'Política de Privacidad',
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
navBtns.forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.section));
});
document.querySelectorAll('.tool-card').forEach(card => {
  card.addEventListener('click', () => showSection(card.dataset.go));
});

// Hash on load
window.addEventListener('hashchange', () => {
  const hash = location.hash.slice(1) || 'inicio';
  if (document.getElementById(hash)) showSection(hash);
});
if (location.hash) {
  const hash = location.hash.slice(1);
  if (document.getElementById(hash)) showSection(hash);
}

// Helper para formatear números al estilo español (67.547,36)
function formatEuro(num) {
  return num.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';
}
function formatNum(num, decimals = 2) {
  return num.toLocaleString('es-ES', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}
function showResult(id, html) {
  const el = document.getElementById(id);
  el.innerHTML = html + '<br><button class="copy-btn" onclick="copyResult(this)">Copiar resultado</button> <button class="copy-btn" onclick="shareResult(this)">Compartir</button>';
  el.classList.add('show');
}
function shareResult(btn) {
  const text = btn.parentElement.innerText.replace(/Copiar resultado|Compartir/g,'').trim();
  if (navigator.share) {
    navigator.share({ title: document.title, text: text, url: location.href });
  } else {
    navigator.clipboard.writeText(text + '\n' + location.href);
    btn.textContent = '¡Enlace copiado!';
    setTimeout(()=>btn.textContent='Compartir', 2000);
  }
}
function copyResult(btn) {
  const text = btn.parentElement.innerText.replace('Copiar resultado', '').trim();
  navigator.clipboard.writeText(text).then(() => {
    const original = btn.textContent;
    btn.textContent = '¡Copiado!';
    setTimeout(() => btn.textContent = original, 2000);
  });
}

// IMC
document.getElementById('imcForm').addEventListener('submit', e => {
  e.preventDefault();
  const peso = +document.getElementById('peso').value;
  const altura = +document.getElementById('altura').value / 100;
  const imc = peso / (altura * altura);
  let cat = imc < 18.5 ? 'Bajo peso' : imc < 25 ? 'Peso normal' : imc < 30 ? 'Sobrepeso' : 'Obesidad';
  showResult('imcResult', `<strong>IMC: ${formatNum(imc, 1)}</strong><br>Categoría: ${cat}`);
});

// Porcentaje
document.getElementById('porcForm').addEventListener('submit', e => {
  e.preventDefault();
  const tipo = document.getElementById('tipo').value;
  const v1 = +document.getElementById('v1').value;
  const v2 = +document.getElementById('v2').value;
  let res, txt;
  if (tipo === 'de') { res = (v1/100)*v2; txt = `El ${formatNum(v1)}% de ${formatNum(v2)} es <strong>${formatNum(res)}</strong>`; }
  else if (tipo === 'aumento') { res = v2*(1+v1/100); txt = `${formatNum(v2)} + ${formatNum(v1)}% = <strong>${formatNum(res)}</strong>`; }
  else if (tipo === 'descuento') { res = v2*(1-v1/100); txt = `${formatNum(v2)} - ${formatNum(v1)}% = <strong>${formatNum(res)}</strong>`; }
  else { res = (v2/v1)*100; txt = `${formatNum(v2)} es el <strong>${formatNum(res)}%</strong> de ${formatNum(v1)}`; }
  showResult('porcResult', txt);
});

// Edad
document.getElementById('edadForm').addEventListener('submit', e => {
  e.preventDefault();
  const nac = new Date(document.getElementById('fecha').value);
  const hoy = new Date();
  let a = hoy.getFullYear() - nac.getFullYear();
  let m = hoy.getMonth() - nac.getMonth();
  let d = hoy.getDate() - nac.getDate();
  if (d < 0) { m--; d += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate(); }
  if (m < 0) { a--; m += 12; }
  showResult('edadResult', `<strong>${a} años, ${m} meses y ${d} días</strong>`);
});

// Préstamo
document.getElementById('prestamoForm').addEventListener('submit', e => {
  e.preventDefault();
  const c = +document.getElementById('capital').value;
  const t = +document.getElementById('tasa').value / 100 / 12;
  const n = +document.getElementById('plazo').value * 12;
  const cuota = c * (t * Math.pow(1+t, n)) / (Math.pow(1+t, n) - 1);
  const total = cuota * n;
  showResult('prestamoResult', `<strong>Cuota: ${formatEuro(cuota)}/mes</strong><br>Total: ${formatEuro(total)}<br>Intereses: ${formatEuro(total-c)}`);
});

// IVA
document.getElementById('ivaForm').addEventListener('submit', e => {
  e.preventDefault();
  const imp = +document.getElementById('importe').value;
  const tasa = +document.getElementById('tipoIva').value / 100;
  const modo = document.getElementById('modo').value;
  let base, iva, total;
  if (modo === 'mas') { base = imp; iva = imp * tasa; total = base + iva; }
  else { total = imp; base = imp / (1 + tasa); iva = total - base; }
  showResult('ivaResult', `Base: <strong>${formatEuro(base)}</strong><br>IVA: <strong>${formatEuro(iva)}</strong><br>Total: <strong>${formatEuro(total)}</strong>`);
});

// Interés compuesto
document.getElementById('interesForm').addEventListener('submit', e => {
  e.preventDefault();
  const p = +document.getElementById('principal').value || 0;
  const aport = +document.getElementById('aportacion').value || 0;
  const freqAport = +document.getElementById('freqAport').value;
  const r = +document.getElementById('tasaInt').value / 100;
  const years = +document.getElementById('anos').value;
  const n = +document.getElementById('frecuencia').value;
  if (years <= 0 || r < 0) { showResult('interesResult', 'Introduce valores válidos.'); return; }
  const fvPrincipal = p * Math.pow(1 + r / n, n * years);
  let fvAportaciones = 0;
  if (aport > 0) {
    const periods = years * freqAport;
    const ratePerPeriod = r / freqAport;
    if (ratePerPeriod === 0) fvAportaciones = aport * periods;
    else fvAportaciones = aport * (Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod;
  }
  const total = fvPrincipal + fvAportaciones;
  const totalAportado = p + (aport * years * freqAport);
  const intereses = total - totalAportado;
  const tea = (Math.pow(1 + r / n, n) - 1) * 100;
  showResult('interesResult', `<strong>Valor futuro: ${formatEuro(total)}</strong><br>Intereses generados: ${formatEuro(intereses)}<br>Total aportado: ${formatEuro(totalAportado)}<br>Tasa efectiva anual: ${formatNum(tea)}%`);
});

// Fechas
document.getElementById('fechasForm').addEventListener('submit', e => {
  e.preventDefault();
  const d1 = new Date(document.getElementById('fecha1').value);
  const d2 = new Date(document.getElementById('fecha2').value);
  const diff = Math.abs(d2 - d1);
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  showResult('fechasResult', `<strong>${days} días</strong> entre las dos fechas`);
});

// Propina
document.getElementById('propinaForm').addEventListener('submit', e => {
  e.preventDefault();
  const cuenta = +document.getElementById('cuenta').value;
  const porc = +document.getElementById('porcPropina').value;
  const pers = +document.getElementById('personas').value || 1;
  const propina = cuenta * (porc / 100);
  const total = cuenta + propina;
  const porPersona = total / pers;
  showResult('propinaResult', `Propina: <strong>${formatEuro(propina)}</strong><br>Total con propina: <strong>${formatEuro(total)}</strong><br>Por persona: <strong>${formatEuro(porPersona)}</strong>`);
});

// Unidades
const tipoUnidadSel = document.getElementById('tipoUnidad');
const desdeSel = document.getElementById('desde');
const haciaSel = document.getElementById('hacia');
function updateUnidades() {
  const tipo = tipoUnidadSel.value;
  desdeSel.innerHTML = '';
  haciaSel.innerHTML = '';
  if (tipo === 'peso') {
    desdeSel.innerHTML = '<option value="kg">kg</option><option value="lb">lb</option>';
    haciaSel.innerHTML = '<option value="lb">lb</option><option value="kg">kg</option>';
  } else if (tipo === 'volumen') {
    desdeSel.innerHTML = '<option value="L">L</option><option value="gal">gal</option>';
    haciaSel.innerHTML = '<option value="gal">gal</option><option value="L">L</option>';
  } else {
    desdeSel.innerHTML = '<option value="m">m</option><option value="ft">ft</option>';
    haciaSel.innerHTML = '<option value="ft">ft</option><option value="m">m</option>';
  }
}
tipoUnidadSel.addEventListener('change', updateUnidades);
updateUnidades();
document.getElementById('unidadesForm').addEventListener('submit', e => {
  e.preventDefault();
  const val = +document.getElementById('valorUnidad').value;
  const desde = desdeSel.value;
  const hacia = haciaSel.value;
  let res;
  if (desde === hacia) res = val;
  else if ((desde === 'kg' && hacia === 'lb') || (desde === 'lb' && hacia === 'kg')) res = desde === 'kg' ? val * 2.20462 : val / 2.20462;
  else if ((desde === 'L' && hacia === 'gal') || (desde === 'gal' && hacia === 'L')) res = desde === 'L' ? val * 0.264172 : val / 0.264172;
  else res = desde === 'm' ? val * 3.28084 : val / 3.28084;
  showResult('unidadesResult', `${formatNum(val)} ${desde} = <strong>${formatNum(res)} ${hacia}</strong>`);
});

// Nómina
document.getElementById('nominaForm').addEventListener('submit', e => {
  e.preventDefault();
  const bruto = +document.getElementById('bruto').value;
  const pagas = +document.getElementById('pagas').value || 14;
  const retencion = 0.18;
  const netoAnual = bruto * (1 - retencion);
  const netoMensual = netoAnual / pagas;
  showResult('nominaResult', `Neto anual aproximado: <strong>${formatEuro(netoAnual)}</strong><br>Neto por paga: <strong>${formatEuro(netoMensual)}</strong><br><small>Estimación orientativa (~18% retención).</small>`);
});

// Laborables
document.getElementById('laborablesForm').addEventListener('submit', e => {
  e.preventDefault();
  const start = new Date(document.getElementById('lab1').value);
  const end = new Date(document.getElementById('lab2').value);
  let count = 0;
  let current = new Date(start);
  while (current <= end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++;
    current.setDate(current.getDate() + 1);
  }
  showResult('laborablesResult', `<strong>${count} días laborables</strong> (lunes a viernes)`);
});

// Temperatura
document.getElementById('tempForm').addEventListener('submit', e => {
  e.preventDefault();
  const val = +document.getElementById('tempValor').value;
  const desde = document.getElementById('tempDesde').value;
  let res, unidad;
  if (desde === 'c') { res = (val * 9/5) + 32; unidad = '°F'; }
  else { res = (val - 32) * 5/9; unidad = '°C'; }
  showResult('tempResult', `${formatNum(val)}° = <strong>${formatNum(res)} ${unidad}</strong>`);
});

// Countdown
document.getElementById('countdownForm').addEventListener('submit', e => {
  e.preventDefault();
  const target = new Date(document.getElementById('fechaObjetivo').value);
  const today = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.round((target - today) / (1000 * 60 * 60 * 24));
  const txt = diff > 0 ? `Faltan <strong>${diff} días</strong>` : diff === 0 ? '<strong>¡Es hoy!</strong>' : `Han pasado <strong>${Math.abs(diff)} días</strong>`;
  showResult('countdownResult', txt);
});

// Precio por unidad
document.getElementById('precioForm').addEventListener('submit', e => {
  e.preventDefault();
  const precio = +document.getElementById('precioTotal').value;
  const cant = +document.getElementById('cantidad').value;
  const unidad = document.getElementById('unidadPrecio').value;
  let porBase, baseName;
  if (unidad === 'g') { porBase = (precio / cant) * 1000; baseName = 'kg'; }
  else if (unidad === 'kg') { porBase = precio / cant; baseName = 'kg'; }
  else if (unidad === 'ml') { porBase = (precio / cant) * 1000; baseName = 'litro'; }
  else if (unidad === 'l') { porBase = precio / cant; baseName = 'litro'; }
  else { porBase = precio / cant; baseName = 'unidad'; }
  showResult('precioResult', `Precio por ${baseName}: <strong>${formatEuro(porBase)}</strong>`);
});

// Horas
document.getElementById('horasForm').addEventListener('submit', e => {
  e.preventDefault();
  const [h1, m1] = document.getElementById('hora1').value.split(':').map(Number);
  const [h2, m2] = document.getElementById('hora2').value.split(':').map(Number);
  let min1 = h1 * 60 + m1;
  let min2 = h2 * 60 + m2;
  if (min2 < min1) min2 += 24 * 60;
  const diff = min2 - min1;
  const horas = Math.floor(diff / 60);
  const mins = diff % 60;
  showResult('horasResult', `<strong>${horas} horas y ${mins} minutos</strong>`);
});

// Combustible
document.getElementById('combustibleForm').addEventListener('submit', e => {
  e.preventDefault();
  const litros = +document.getElementById('litros').value;
  const km = +document.getElementById('km').value;
  if (km <= 0) { showResult('combustibleResult', 'Introduce kilómetros válidos.'); return; }
  const consumo = (litros / km) * 100;
  showResult('combustibleResult', `Consumo: <strong>${formatNum(consumo)} L/100 km</strong>`);
});

// Peso ideal
document.getElementById('pesoidealForm').addEventListener('submit', e => {
  e.preventDefault();
  const altura = +document.getElementById('alturaIdeal').value / 100;
  const min = 18.5 * altura * altura;
  const max = 24.9 * altura * altura;
  showResult('pesoidealResult', `Rango saludable: <strong>${formatNum(min, 1)} - ${formatNum(max, 1)} kg</strong>`);
});

// Interés simple
document.getElementById('interesimpleForm').addEventListener('submit', e => {
  e.preventDefault();
  const c = +document.getElementById('capSimple').value;
  const r = +document.getElementById('tasaSimple').value / 100;
  const t = +document.getElementById('tiempoSimple').value;
  const interes = c * r * t;
  const total = c + interes;
  showResult('interesimpleResult', `Intereses: <strong>${formatEuro(interes)}</strong><br>Total: <strong>${formatEuro(total)}</strong>`);
});

// TDEE
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

// Regla de tres
document.getElementById('regla3Form')?.addEventListener('submit', e => {
  e.preventDefault();
  const a = +document.getElementById('r3a').value;
  const b = +document.getElementById('r3b').value;
  const c = +document.getElementById('r3c').value;
  const x = (b * c) / a;
  showResult('regla3Result', `<strong>Resultado:</strong> ${formatNum(x)}`);
});

// IMC inverso
document.getElementById('imcinversoForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const alt = +document.getElementById('invAltura').value / 100;
  const imc = +document.getElementById('invImc').value;
  const peso = imc * alt * alt;
  showResult('imcinversoResult', `<strong>Peso necesario:</strong> ${formatNum(peso,1)} kg<br><small>Para un IMC de ${imc}.</small>`);
});

// Buscador
function normalize(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); }
const searchInput = document.getElementById('searchTools');
const toolsGrid = document.getElementById('toolsGrid');
const noResults = document.getElementById('noResults');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const q = normalize(searchInput.value.trim());
    const cards = toolsGrid.querySelectorAll('.tool-card');
    let visible = 0;
    cards.forEach(card => {
      const text = normalize((card.dataset.keywords || '') + ' ' + card.textContent);
      const match = !q || text.includes(q);
      card.style.display = match ? '' : 'none';
      if (match) visible++;
    });
    noResults.style.display = visible === 0 ? 'block' : 'none';
  });
}

// Historial
const HISTORY_KEY = 'calcHistory';
function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch { return []; } }
function saveHistory(entry) {
  const hist = getHistory();
  hist.unshift({ ...entry, date: new Date().toLocaleString('es-ES') });
  if (hist.length > 20) hist.pop();
  localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
  renderHistory();
}
function renderHistory() {
  const list = document.getElementById('historyList');
  if (!list) return;
  const hist = getHistory();
  if (hist.length === 0) { list.innerHTML = '<p style="color:var(--text-muted);">Aún no hay cálculos guardados.</p>'; return; }
  list.innerHTML = hist.map(h => `<div class="history-item"><strong>${h.title}</strong><br>${h.result}<small>${h.date}</small></div>`).join('');
}
document.getElementById('clearHistory')?.addEventListener('click', () => { localStorage.removeItem(HISTORY_KEY); renderHistory(); });
renderHistory();

const originalShowResult = showResult;
showResult = function(id, html) {
  originalShowResult(id, html);
  const titlesMap = { imcResult: 'IMC', porcResult: 'Porcentaje', edadResult: 'Edad', prestamoResult: 'Préstamo', ivaResult: 'IVA', interesResult: 'Interés', fechasResult: 'Días entre fechas', propinaResult: 'Propina', unidadesResult: 'Conversor', nominaResult: 'Nómina', laborablesResult: 'Días laborables', tempResult: 'Temperatura', countdownResult: 'Días hasta fecha', precioResult: 'Precio por unidad', horasResult: 'Diferencia de horas', combustibleResult: 'Consumo combustible', pesoidealResult: 'Peso ideal', interesimpleResult: 'Interés simple', tdeeResult: 'TDEE', regla3Result: 'Regla de tres', imcinversoResult: 'IMC inverso' };
  const title = titlesMap[id];
  if (title) {
    const clean = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    saveHistory({ title, result: clean });
  }
};
