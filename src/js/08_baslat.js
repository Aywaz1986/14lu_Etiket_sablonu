// ═══════════════════════════════════════════
// BAŞLAT
// ═══════════════════════════════════════════
dbAc().then(() => {
  initLabels();
  renderSheet();
  renderFormList();
  sablonListesiGuncelle();
}).catch(e => {
  console.error('IndexedDB açılamadı:', e);
  initLabels();
  renderSheet();
  renderFormList();
});
