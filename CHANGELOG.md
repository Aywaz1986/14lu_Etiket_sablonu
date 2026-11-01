# Değişiklik Günlüğü

## 1.1.0
- Sayfa düzeni üreticinin resmi Word şablonuna (TW-2014 99.1x38.1mm) göre düzeltildi: üst 15.19 mm, sol 4.50 mm, sütun 99.12 mm, sütun boşluğu 2.70 mm, satır 38.10 mm (alt/sağ 0).
- Satır yüksekliği varsayılanı 37.90 -> 38.10 mm. Baskıda Edge kenar boşlukları "Yok", ölçek %100 olmalı.
- Test 08: etiket konumları şablonla karşılaştırılır.

## 1.0.0
- Proje GitHub'a taşındı: tek dosya HTML, `src/` modüllerine bölündü, `build.py` ile `dist/` üretilir.
- Özellikler: 14'lü Tanex TW-2014 etiket sayfası, 7 renk teması, yazı boyutu/rengi, satır bazlı mm yükseklik (+/-), IndexedDB şablonları, Excel/CSV içe aktarma, çok sayfa, tamamen çevrimdışı.
- Testler: Playwright + Chromium (7 test).
