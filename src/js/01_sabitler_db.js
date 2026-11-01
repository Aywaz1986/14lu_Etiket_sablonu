// Uygulama sürümü: yalnızca burada değiştirilir (build.py dosya adını buradan alır)
const APP_SURUM = '1.0.0';

// ═══════════════════════════════════════════
// IndexedDB KURULUM
// ═══════════════════════════════════════════
const DB_NAME = 'EtiketDB';
const DB_VER  = 1;
const STORE   = 'sablonlar';
let db = null;

function dbAc() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(STORE)) {
        const store = d.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        store.createIndex('ad', 'ad', { unique: false });
        store.createIndex('olusturma', 'olusturma', { unique: false });
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror   = e => reject(e.target.error);
  });
}

function dbEkle(kayit) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).add(kayit);
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function dbHepsiniGetir() {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readonly');
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror   = () => reject(req.error);
  });
}

function dbSil(id) {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite');
    const req = tx.objectStore(STORE).delete(id);
    req.onsuccess = () => resolve();
    req.onerror   = () => reject(req.error);
  });
}

// ═══════════════════════════════════════════
// ETİKET VERİSİ
// ═══════════════════════════════════════════
const ETIKET_SAYFA_BASI = 14;
let labels = [];

function bosEtiket(id) {
  return {
    id,
    kurum: 'Kurum Adı',
    ad: 'Ad Soyad',
    unvan: 'Ünvan / Pozisyon',
    tema: 'theme-blue',
    fontOlcek: 100,
    yaziRengi: ''   // boş = temanın kendi rengi, dolu (#hex) = manuel override
  };
}

function initLabels() {
  const saved = localStorage.getItem('etiket14-data');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) { labels = parsed; return; }
    } catch(e) {}
  }
  labels = Array.from({length: ETIKET_SAYFA_BASI}, (_, i) => bosEtiket(i + 1));
}

function sayfaSayisi() {
  return Math.ceil(labels.length / ETIKET_SAYFA_BASI);
}

function sayfaEkle() {
  const baslangicId = labels.length + 1;
  for (let i = 0; i < ETIKET_SAYFA_BASI; i++) {
    labels.push(bosEtiket(baslangicId + i));
  }
  renderSheet();
  renderFormList();
  showToast('➕ Yeni sayfa eklendi (toplam ' + labels.length + ' etiket)');
}

function sonSayfayiSil() {
  if (sayfaSayisi() <= 1) { showToast('⚠️ En az 1 sayfa kalmalı'); return; }
  if (!confirm('Son sayfadaki 14 etiket silinecek. Emin misiniz?')) return;
  labels = labels.slice(0, labels.length - ETIKET_SAYFA_BASI);
  renderSheet();
  renderFormList();
  showToast('➖ Son sayfa silindi (toplam ' + labels.length + ' etiket)');
}

