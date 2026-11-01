// ═══════════════════════════════════════════
// ETİKET İŞLEMLERİ
// ═══════════════════════════════════════════
let selectedId = null;

function selectLabel(id) {
  selectedId = id;
  document.querySelectorAll('.label-card').forEach(c => c.classList.remove('selected'));
  document.querySelectorAll('.label-item').forEach(c => c.classList.remove('active'));
  const card = document.querySelector(`.label-card[data-id="${id}"]`);
  const item = document.querySelector(`.label-item[data-id="${id}"]`);
  if (card) card.classList.add('selected');
  if (item) {
    item.classList.add('active');
    openFormItem(id);
    item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  const sayfaNo = Math.floor((id - 1) / ETIKET_SAYFA_BASI) + 1;
  document.getElementById('selected-label-info').textContent = `Etiket #${id} (Sayfa ${sayfaNo}) seçili`;
}

function toggleFormItem(id) {
  document.querySelector(`.label-item[data-id="${id}"]`).classList.toggle('open');
}
function openFormItem(id) {
  const item = document.querySelector(`.label-item[data-id="${id}"]`);
  if (item && !item.classList.contains('open')) item.classList.add('open');
}

function updateLabel(id, field, value) {
  const idx = labels.findIndex(l => l.id === id);
  if (idx < 0) return;
  labels[idx][field] = value;
  const card = document.querySelector(`.label-card[data-id="${id}"]`);
  if (!card) return;
  if (field === 'tema') {
    const themes = ['theme-blue','theme-teal','theme-purple','theme-red','theme-orange','theme-dark','theme-white'];
    card.classList.remove(...themes);
    card.classList.add(value);
  } else if (field === 'fontOlcek') {
    card.style.setProperty('--font-olcek', (value/100));
  } else if (field === 'yaziRengi') {
    if (value) {
      card.classList.add('renk-ozel');
      card.style.setProperty('--yazi-rengi', value);
    } else {
      card.classList.remove('renk-ozel');
      card.style.removeProperty('--yazi-rengi');
    }
    const colorInput = document.getElementById(`f-renk-${id}`);
    if (colorInput && value) colorInput.value = value;
  } else {
    const el = card.querySelector(`[data-field="${field}"]`);
    if (el) el.innerText = value;
  }
  const preview = document.querySelector(`.label-item[data-id="${id}"] .label-preview-text`);
  if (preview && field === 'ad') preview.textContent = value;
}

function updateFormItem(lb) {
  const a = document.getElementById(`f-ad-${lb.id}`);
  const k = document.getElementById(`f-kurum-${lb.id}`);
  const u = document.getElementById(`f-unvan-${lb.id}`);
  if (a) a.value = lb.ad;
  if (k) k.value = lb.kurum;
  if (u) u.value = lb.unvan;
  const p = document.querySelector(`.label-item[data-id="${lb.id}"] .label-preview-text`);
  if (p) p.textContent = lb.ad;
}

function g_yaziRengiHexDegisti(value) {
  const v = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
    document.getElementById('g-yazi-rengi').value = v;
  }
}

function f_yaziRengiHexDegisti(id, value) {
  const v = value.trim();
  if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
    const colorInput = document.getElementById(`f-renk-${id}`);
    if (colorInput) colorInput.value = v;
    updateLabel(id, 'yaziRengi', v);
  }
}

function srAdim(i, delta) {
  var kutu = document.getElementById('sr-kutu-' + i);
  var slider = document.getElementById('sr-slider-' + i);
  var v = parseFloat(kutu.value) || 37.9;
  v = Math.round((v + delta) * 100) / 100;
  if (v < 30 || v > 45) return;
  kutu.value = v.toFixed(2);
  slider.value = v;
  satirGuncelle();
}

function satirGuncelle() {
  var rows = [];
  for (var i = 1; i <= 7; i++) {
    var v = parseFloat(document.getElementById('sr-kutu-' + i).value);
    rows.push((isNaN(v) ? 37.9 : v).toFixed(2) + 'mm');
  }
  var gridRows = rows.join(' ');
  var toplamY = rows.reduce(function(t,v){return t+parseFloat(v);},0) + 4.7*2;

  // Ekran CSS
  var styleEl = document.getElementById('satir-css');
  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = 'satir-css';
    document.head.appendChild(styleEl);
  }
  styleEl.textContent =
    '.a4-sheet{grid-template-rows:' + gridRows + '!important;}' +
    '@media print{' +
      '.a4-sheet{grid-template-rows:' + gridRows + '!important;' +
        'height:' + toplamY.toFixed(1) + 'mm!important;' +
        'max-height:' + toplamY.toFixed(1) + 'mm!important;}' +
      '.sayfa-bloku{height:' + toplamY.toFixed(1) + 'mm!important;}' +
    '}';
}

function applyGlobal() {
  const kurum = document.getElementById('g-kurum').value.trim();
  const tema  = document.getElementById('g-tema').value;
  const fontOlcek = parseInt(document.getElementById('g-font').value);
  const hexAlani = document.getElementById('g-yazi-rengi-hex').value.trim();
  const renkUygula = hexAlani.length > 0;
  const yaziRengi = document.getElementById('g-yazi-rengi').value;

  labels.forEach(lb => {
    if (kurum) lb.kurum = kurum;
    if (tema)  lb.tema  = tema;
    lb.fontOlcek = fontOlcek;
    if (renkUygula) lb.yaziRengi = yaziRengi;
  });
  renderSheet();
  renderFormList();
}

