// ═══════════════════════════════════════════
// EXCEL İÇE AKTARMA
// ═══════════════════════════════════════════
let excelHamVeri = [];      // header dahil, raw array-of-arrays
let excelEslesme = { kurum: -1, ad: -1, unvan: -1 };
let excelHedefId = null;    // tekil mod için: hangi etikete yüklenecek

const SUTUN_ESLESTIRME = {
  kurum: ['kurum','şirket','sirket','firma','kurum adı','company','organization','şirket adı'],
  ad:    ['ad soyad','isim','ad','adı soyadı','name','full name','fullname','adsoyad'],
  unvan: ['ünvan','unvan','pozisyon','görev','gorev','title','position','rol']
};

function sutunTahminEt(baslik) {
  const b = String(baslik || '').toLowerCase().trim()
    .replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c');
  for (const [alan, varyasyonlar] of Object.entries(SUTUN_ESLESTIRME)) {
    for (const v of varyasyonlar) {
      const vn = v.replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c');
      if (b.includes(vn)) return alan;
    }
  }
  return null;
}

function excelOku(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const wb = XLSX.read(data, { type: 'array' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
      callback(json);
    } catch(err) {
      showToast('❌ Dosya okunamadı: ' + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

// Toplu içe aktarma (header buton)
function excelDosyaSecildi(event) {
  const file = event.target.files[0];
  if (!file) return;
  excelHedefId = null;
  excelOku(file, (json) => {
    excelHamVeri = json;
    excelModalAc();
  });
  event.target.value = '';
}

// Tekil içe aktarma (etiket bazlı)
function tekilExcelSec(id) {
  excelHedefId = id;
  document.getElementById('excel-tekil-input').click();
}
function tekilExcelSecildi(event) {
  const file = event.target.files[0];
  if (!file) return;
  excelOku(file, (json) => {
    excelHamVeri = json;
    excelModalAc();
  });
  event.target.value = '';
}

function excelModalAc() {
  if (!excelHamVeri.length) { showToast('⚠️ Dosya boş görünüyor'); return; }
  const headers = excelHamVeri[0];

  // Otomatik eşleştirme
  excelEslesme = { kurum: -1, ad: -1, unvan: -1 };
  headers.forEach((h, i) => {
    const alan = sutunTahminEt(h);
    if (alan && excelEslesme[alan] === -1) excelEslesme[alan] = i;
  });

  // Eşleştirme dropdown'larını oluştur
  const alanlar = [
    { key: 'kurum', label: '🏢 Kurum Adı' },
    { key: 'ad',    label: '👤 Ad Soyad' },
    { key: 'unvan', label: '💼 Ünvan' }
  ];
  const eslesmeAlani = document.getElementById('excel-eslesme-alani');
  eslesmeAlani.innerHTML = alanlar.map(a => `
    <div>
      <label style="display:block;font-size:.75rem;font-weight:600;color:#64748b;margin-bottom:4px;">${a.label}</label>
      <select id="esle-${a.key}" onchange="excelEslesme.${a.key}=parseInt(this.value);excelOnizlemeGuncelle()"
        style="width:100%;padding:6px 8px;border:1.5px solid #e2e8f0;border-radius:7px;font-size:.78rem;">
        <option value="-1">— Yok —</option>
        ${headers.map((h, i) => `<option value="${i}" ${excelEslesme[a.key]===i?'selected':''}>${escHtml(h || 'Sütun '+(i+1))}</option>`).join('')}
      </select>
    </div>
  `).join('');

  excelOnizlemeGuncelle();
  document.getElementById('excel-modal').style.display = 'flex';
}

function excelOnizlemeGuncelle() {
  const tumSatirlar = excelHamVeri.slice(1).filter(r => r.some(c => String(c||'').trim() !== ''));
  const rows = excelHedefId !== null ? tumSatirlar.slice(0, 1) : tumSatirlar;
  const tablo = document.getElementById('excel-onizleme-tablo');

  let baslikEk = '';
  if (excelHedefId === null && tumSatirlar.length > 0) {
    const gerekliSayfa = Math.ceil(tumSatirlar.length / ETIKET_SAYFA_BASI);
    baslikEk = `<div style="margin-bottom:8px;font-size:.78rem;color:#166534;background:#dcfce7;padding:6px 10px;border-radius:6px;font-weight:600;">📄 ${tumSatirlar.length} satır bulundu → ${gerekliSayfa} sayfa (${gerekliSayfa * ETIKET_SAYFA_BASI} etiket kapasitesi) oluşturulacak</div>`;
  }
  document.getElementById('excel-onizleme-baslik').innerHTML = baslikEk;

  let html = '<tr style="background:#f1f5f9;position:sticky;top:0;"><th style="padding:6px 8px;text-align:left;">#</th><th style="padding:6px 8px;text-align:left;">Kurum</th><th style="padding:6px 8px;text-align:left;">Ad Soyad</th><th style="padding:6px 8px;text-align:left;">Ünvan</th></tr>';
  rows.forEach((r, i) => {
    const kurum = excelEslesme.kurum >= 0 ? (r[excelEslesme.kurum] || '') : '';
    const ad    = excelEslesme.ad    >= 0 ? (r[excelEslesme.ad]    || '') : '';
    const unvan = excelEslesme.unvan >= 0 ? (r[excelEslesme.unvan] || '') : '';
    const sayfaSinirMi = excelHedefId === null && (i+1) % ETIKET_SAYFA_BASI === 0 && (i+1) !== rows.length;
    html += `<tr style="border-top:1px solid #e2e8f0;${sayfaSinirMi?'border-bottom:2px solid #93c5fd;':''}"><td style="padding:5px 8px;color:#94a3b8;">${i+1}</td><td style="padding:5px 8px;">${escHtml(kurum)}</td><td style="padding:5px 8px;">${escHtml(ad)}</td><td style="padding:5px 8px;">${escHtml(unvan)}</td></tr>`;
  });
  tablo.innerHTML = html;
}

function excelModalKapat() {
  document.getElementById('excel-modal').style.display = 'none';
  excelHamVeri = [];
  excelHedefId = null;
}

function excelIceAktar() {
  const rows = excelHamVeri.slice(1).filter(r => r.some(c => String(c||'').trim() !== ''));
  if (!rows.length) { showToast('⚠️ Veri satırı yok'); return; }

  if (excelHedefId !== null) {
    // Tekil mod: ilk satırı seçilen etikete uygula (sayfa sayısı değişmez)
    const r = rows[0];
    const idx = labels.findIndex(l => l.id === excelHedefId);
    if (idx >= 0) {
      if (excelEslesme.kurum >= 0) labels[idx].kurum = String(r[excelEslesme.kurum] || labels[idx].kurum);
      if (excelEslesme.ad    >= 0) labels[idx].ad    = String(r[excelEslesme.ad]    || labels[idx].ad);
      if (excelEslesme.unvan >= 0) labels[idx].unvan = String(r[excelEslesme.unvan] || labels[idx].unvan);
    }
    showToast('✅ Etiket #' + excelHedefId + ' güncellendi');
  } else {
    // Toplu mod: veri sayısına göre sayfa sayısını otomatik ayarla
    const gerekliEtiketSayisi = rows.length;
    const gerekliSayfa = Math.ceil(gerekliEtiketSayisi / ETIKET_SAYFA_BASI);
    const gerekliToplamEtiket = gerekliSayfa * ETIKET_SAYFA_BASI;

    // Mevcut etiket sayısı yetersizse boş etiketlerle tamamla
    while (labels.length < gerekliToplamEtiket) {
      labels.push(bosEtiket(labels.length + 1));
    }
    // Mevcut etiket sayısı fazlaysa fazlalığı silme - kullanıcı verisini koru, sadece doldur

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (excelEslesme.kurum >= 0 && r[excelEslesme.kurum]) labels[i].kurum = String(r[excelEslesme.kurum]);
      if (excelEslesme.ad    >= 0 && r[excelEslesme.ad])    labels[i].ad    = String(r[excelEslesme.ad]);
      if (excelEslesme.unvan >= 0 && r[excelEslesme.unvan]) labels[i].unvan = String(r[excelEslesme.unvan]);
    }

    showToast(`✅ ${rows.length} kişi içe aktarıldı → ${gerekliSayfa} sayfa oluşturuldu`);
  }

  renderSheet();
  renderFormList();
  excelModalKapat();
}

