// ═══════════════════════════════════════════
// RENDER: A4
// ═══════════════════════════════════════════
function renderSheet() {
  const kapsayici = document.getElementById('sayfalar-kapsayici');
  kapsayici.innerHTML = '';

  const toplamSayfa = sayfaSayisi();

  for (let s = 0; s < toplamSayfa; s++) {
    const sayfaEtiketleri = labels.slice(s * ETIKET_SAYFA_BASI, (s + 1) * ETIKET_SAYFA_BASI);

    const blok = document.createElement('div');
    blok.className = 'sayfa-bloku';
    const baslik = document.createElement('div');
    baslik.className = 'sayfa-baslik';
    baslik.textContent = `📄 Sayfa ${s + 1} / ${toplamSayfa}`;
    blok.appendChild(baslik);

    const sheet = document.createElement('div');
    sheet.className = 'a4-sheet';
    sheet.dataset.sayfa = s;

    sayfaEtiketleri.forEach((lb) => {
      const globalIdx = labels.findIndex(l => l.id === lb.id);
      if (!lb.fontOlcek) lb.fontOlcek = 100;
      if (lb.yaziRengi === undefined) lb.yaziRengi = '';

      const card = document.createElement('div');
      const ozelRenkVar = !!lb.yaziRengi;
      card.className = `label-card ${lb.tema}${ozelRenkVar ? ' renk-ozel' : ''}`;
      card.dataset.id = lb.id;
      card.style.setProperty('--font-olcek', (lb.fontOlcek/100));
      if (ozelRenkVar) card.style.setProperty('--yazi-rengi', lb.yaziRengi);

      card.innerHTML = `
        <div class="label-bg"></div>
        <div class="label-accent-bar"></div>
        <div class="selected-indicator">✓</div>
        <div class="label-content">
          <div class="label-kurum" contenteditable="true" data-field="kurum" data-idx="${globalIdx}">${escHtml(lb.kurum)}</div>
          <div class="label-ad"    contenteditable="true" data-field="ad"    data-idx="${globalIdx}">${escHtml(lb.ad)}</div>
          <div class="label-unvan" contenteditable="true" data-field="unvan" data-idx="${globalIdx}">${escHtml(lb.unvan)}</div>
        </div>
      `;
      card.addEventListener('click', (e) => {
        if (e.target.hasAttribute('contenteditable')) return;
        selectLabel(lb.id);
      });
      card.querySelectorAll('[contenteditable]').forEach(el => {
        el.addEventListener('input', () => {
          labels[parseInt(el.dataset.idx)][el.dataset.field] = el.innerText;
          updateFormItem(labels[parseInt(el.dataset.idx)]);
        });
        el.addEventListener('click', (e) => { e.stopPropagation(); selectLabel(lb.id); });
      });
      sheet.appendChild(card);
    });

    blok.appendChild(sheet);
    kapsayici.appendChild(blok);
  }

  // Sayfa bilgisini güncelle
  const bilgi = document.getElementById('sayfa-bilgi-metni');
  if (bilgi) bilgi.textContent = `${toplamSayfa} sayfa · ${labels.length} etiket`;
  const silBtn = document.getElementById('sayfa-sil-btn');
  if (silBtn) silBtn.disabled = (toplamSayfa <= 1);
}

// ═══════════════════════════════════════════
// RENDER: FORM LİSTESİ
// ═══════════════════════════════════════════
function renderFormList() {
  const list = document.getElementById('label-form-list');
  list.innerHTML = '';
  labels.forEach((lb) => {
    const item = document.createElement('div');
    item.className = 'label-item';
    item.dataset.id = lb.id;
    item.innerHTML = `
      <div class="label-item-header" onclick="toggleFormItem(${lb.id})">
        <div class="label-num">${lb.id}</div>
        <div class="label-preview-text">${escHtml(lb.ad)}</div>
        <span class="toggle-arrow">▼</span>
      </div>
      <div class="label-item-body">
        <button class="btn-sm" style="background:#dcfce7;color:#166534;border:none;border-radius:6px;width:100%;margin-bottom:10px;padding:6px;cursor:pointer;font-weight:600;" onclick="event.stopPropagation();tekilExcelSec(${lb.id})">📊 Bu Etiket İçin Excel/CSV Seç</button>
        <div class="form-row">
          <label>Kurum Adı</label>
          <input type="text" id="f-kurum-${lb.id}" value="${escAttr(lb.kurum)}" oninput="updateLabel(${lb.id},'kurum',this.value)">
        </div>
        <div class="form-row">
          <label>Ad Soyad</label>
          <input type="text" id="f-ad-${lb.id}" value="${escAttr(lb.ad)}" oninput="updateLabel(${lb.id},'ad',this.value)">
        </div>
        <div class="form-row">
          <label>Ünvan / Pozisyon</label>
          <input type="text" id="f-unvan-${lb.id}" value="${escAttr(lb.unvan)}" oninput="updateLabel(${lb.id},'unvan',this.value)">
        </div>
        <div class="form-row">
          <label>Renk Teması</label>
          <select id="f-tema-${lb.id}" onchange="updateLabel(${lb.id},'tema',this.value)">
            <option value="theme-blue"   ${lb.tema==='theme-blue'  ?'selected':''}>🔵 Mavi</option>
            <option value="theme-teal"   ${lb.tema==='theme-teal'  ?'selected':''}>🟢 Teal</option>
            <option value="theme-purple" ${lb.tema==='theme-purple'?'selected':''}>🟣 Mor</option>
            <option value="theme-red"    ${lb.tema==='theme-red'   ?'selected':''}>🔴 Kırmızı</option>
            <option value="theme-orange" ${lb.tema==='theme-orange'?'selected':''}>🟠 Turuncu</option>
            <option value="theme-dark"   ${lb.tema==='theme-dark'  ?'selected':''}>⚫ Koyu</option>
            <option value="theme-white"  ${lb.tema==='theme-white' ?'selected':''}>⚪ Beyaz</option>
          </select>
        </div>
        <div class="form-row">
          <label>Yazı Boyutu Ölçeği: <span id="f-font-deger-${lb.id}">${lb.fontOlcek||100}%</span></label>
          <input type="range" id="f-font-${lb.id}" min="70" max="180" value="${lb.fontOlcek||100}" step="5"
            oninput="document.getElementById('f-font-deger-${lb.id}').textContent=this.value+'%';updateLabel(${lb.id},'fontOlcek',parseInt(this.value))"
            style="width:100%;cursor:pointer;">
        </div>
        <div class="form-row">
          <label>✏️ Yazı Rengi</label>
          <div class="color-row">
            <input type="color" id="f-renk-${lb.id}" value="${lb.yaziRengi || '#ffffff'}"
              oninput="document.getElementById('f-renk-hex-${lb.id}').value=this.value;updateLabel(${lb.id},'yaziRengi',this.value)">
            <input type="text" id="f-renk-hex-${lb.id}" value="${lb.yaziRengi || ''}" placeholder="#hex"
              oninput="f_yaziRengiHexDegisti(${lb.id},this.value)">
          </div>
          <button class="btn-sm" style="background:#f1f5f9;color:#475569;border:none;border-radius:7px;padding:6px 10px;cursor:pointer;font-weight:600;width:100%;margin-top:6px;"
            onclick="updateLabel(${lb.id},'yaziRengi','');document.getElementById('f-renk-hex-${lb.id}').value=''">↺ Temaya Dön</button>
        </div>
      </div>
    `;
    list.appendChild(item);
  });
}

