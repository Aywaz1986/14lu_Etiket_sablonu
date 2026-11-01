// ═══════════════════════════════════════════
// KAYDET / SIFIRLA
// ═══════════════════════════════════════════
function syncInlineEdits() {
  document.querySelectorAll('[contenteditable]').forEach(el => {
    const idx = parseInt(el.dataset.idx);
    if (!isNaN(idx)) labels[idx][el.dataset.field] = el.innerText;
  });
}

function saveData() {
  syncInlineEdits();
  localStorage.setItem('etiket14-data', JSON.stringify(labels));
  showToast('✅ Kaydedildi!');
}

function resetAll() {
  if (!confirm('Tüm etiketler sıfırlanacak. Emin misiniz?')) return;
  localStorage.removeItem('etiket14-data');
  initLabels();
  renderSheet();
  renderFormList();
  showToast('🔄 Sıfırlandı');
}

// ═══════════════════════════════════════════
// TOAST
// ═══════════════════════════════════════════
function showToast(msg) {
  let t = document.getElementById('toast');
  if (!t) {
    t = document.createElement('div');
    t.id = 'toast';
    t.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#1e293b;color:#fff;padding:10px 18px;border-radius:10px;font-size:.85rem;font-weight:600;z-index:9999;transition:opacity .3s;';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.style.opacity = '0', 2500);
}

// ═══════════════════════════════════════════
// YARDIMCI
// ═══════════════════════════════════════════
function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escAttr(s) {
  return String(s).replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

