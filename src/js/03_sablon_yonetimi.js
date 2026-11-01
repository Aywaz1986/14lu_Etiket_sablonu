// ═══════════════════════════════════════════
// ŞABLON YÖNETİMİ
// ═══════════════════════════════════════════
async function sablonKaydet() {
  syncInlineEdits();
  const ad = document.getElementById('s-ad').value.trim();
  if (!ad) { showToast('⚠️ Şablon adı boş olamaz!'); return; }
  const aciklama = document.getElementById('s-aciklama').value.trim();

  const kayit = {
    ad,
    aciklama,
    etiketler: JSON.parse(JSON.stringify(labels)),
    olusturma: new Date().toISOString()
  };

  try {
    await dbEkle(kayit);
    document.getElementById('s-ad').value = '';
    document.getElementById('s-aciklama').value = '';
    await sablonListesiGuncelle();
    showToast('✅ Şablon kaydedildi: ' + ad);
    switchTab('sablonlar');
  } catch(e) {
    showToast('❌ Kayıt hatası: ' + e.message);
  }
}

async function sablonYukle(id) {
  try {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).get(id);
    req.onsuccess = () => {
      const kayit = req.result;
      if (!kayit) return;
      labels = JSON.parse(JSON.stringify(kayit.etiketler));
      renderSheet();
      renderFormList();
      switchTab('etiketler');
      showToast('📂 Yüklendi: ' + kayit.ad);
    };
  } catch(e) {
    showToast('❌ Yükleme hatası');
  }
}

async function sablonSil(id, ad) {
  if (!confirm(`"${ad}" şablonu silinecek. Emin misiniz?`)) return;
  try {
    await dbSil(id);
    await sablonListesiGuncelle();
    showToast('🗑️ Silindi: ' + ad);
  } catch(e) {
    showToast('❌ Silme hatası');
  }
}

async function sablonListesiGuncelle() {
  const liste = document.getElementById('sablon-liste');
  let kayitlar = [];
  try { kayitlar = await dbHepsiniGetir(); } catch(e) {}

  if (kayitlar.length === 0) {
    liste.innerHTML = '<div class="sablon-liste-bos">Henüz kayıtlı şablon yok.</div>';
    return;
  }

  // En yeni üstte
  kayitlar.sort((a, b) => new Date(b.olusturma) - new Date(a.olusturma));

  liste.innerHTML = kayitlar.map(k => {
    const tarih = new Date(k.olusturma).toLocaleString('tr-TR', {
      day:'2-digit', month:'2-digit', year:'numeric',
      hour:'2-digit', minute:'2-digit'
    });
    // Tema renk pilleri
    const temalar = [...new Set((k.etiketler||[]).map(e => e.tema))];
    const temaRenkleri = {
      'theme-blue':'#2563eb','theme-teal':'#0d9488','theme-purple':'#7c3aed',
      'theme-red':'#dc2626','theme-orange':'#ea580c','theme-dark':'#1e293b','theme-white':'#e2e8f0'
    };
    const pillHtml = temalar.map(t =>
      `<span class="tema-pill" style="background:${temaRenkleri[t]||'#ccc'}" title="${t}"></span>`
    ).join('');

    return `
      <div class="sablon-kart">
        <div class="sablon-kart-ust">
          <div class="sablon-kart-bilgi">
            <div class="sablon-kart-ad" title="${escHtml(k.ad)}">${escHtml(k.ad)}</div>
            ${k.aciklama ? `<div class="sablon-kart-aciklama" title="${escHtml(k.aciklama)}">${escHtml(k.aciklama)}</div>` : ''}
            <div class="sablon-kart-tarih">📅 ${tarih}</div>
          </div>
          <div class="sablon-kart-aksiyonlar">
            <button class="sablon-yukle-btn" onclick="sablonYukle(${k.id})">📂 Yükle</button>
            <button class="sablon-sil-btn"   onclick="sablonSil(${k.id},'${escAttr(k.ad)}')">🗑️</button>
          </div>
        </div>
        ${pillHtml ? `<div class="sablon-tema-renk">${pillHtml}</div>` : ''}
      </div>
    `;
  }).join('');
}

// ═══════════════════════════════════════════
// SEKME
// ═══════════════════════════════════════════
function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
  document.getElementById('tab-' + tab).classList.add('active');
  document.querySelector(`.tab-btn[onclick="switchTab('${tab}')"]`).classList.add('active');
  if (tab === 'sablonlar') sablonListesiGuncelle();
}

