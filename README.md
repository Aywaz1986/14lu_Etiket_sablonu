# 14'lü Etiket Şablonu

Tanex TW-2014 (A4, 14 etiket, 99.1×38.1 mm, 2 sütun × 7 satır) yapışkanlı etiket kâğıdı için isim/rozet etiketi tasarım ve baskı aracı. Çıktı **tek dosya HTML**'dir, internet gerektirmez.

## Çalışma kuralları
1. `src/` kaynaktır, `dist/` üretilmiştir; `dist/` elle düzenlenmez.
2. Aynı commit'te `dist/`, `CHANGELOG.md`, README tabloları ve ilgili `docs/` güncellenir.
3. Sürüm yalnızca `src/js/01_sabitler_db.js` içindeki `APP_SURUM` ile değişir.
4. JS sırası dosya adındaki `NN_` önekiyle belirlenir (modül değil, tek global kapsam).
5. CSS'te sabit px yerine mm/ölçek değişkenleri kullanılır; baskı ölçüleri `06_baski.css` içindedir.
6. Yeni özellik = test + `tests/README.txt` satırı.
7. Depoya gerçek/kişisel veri, kopya HTML konmaz.
8. Çıktı tek dosya kalır; çalışma anında dış bağımlılık (CDN) eklenmez.

## Akış
`src/` → `python build.py` → `dist/Etiket-Sablonu-14li-<sürüm>.html` → `python tests/run_tests.py` → commit → push.
Küçük düzeltme doğrudan `main`; büyük iş dal + PR.

## Modül tablosu
| Dosya | İçerik |
|---|---|
| `src/js/01_sabitler_db.js` | APP_SURUM, IndexedDB, etiket verisi, sayfa ekle/sil |
| `src/js/02_render.js` | A4 sayfa ve form listesi çizimi |
| `src/js/03_sablon_yonetimi.js` | Şablon kaydet/yükle/sil, sekme |
| `src/js/04_etiket_islemleri.js` | Seçim, güncelleme, renk, satır yüksekliği (`srAdim`, `satirGuncelle`), `applyGlobal` |
| `src/js/05_kaydet_toast_yardimci.js` | Kaydet/sıfırla, toast, yardımcılar |
| `src/js/06_ornek_sablon.js` | Gömülü örnek Excel (base64) indirme |
| `src/js/07_excel_aktarma.js` | Excel/CSV içe aktarma, sütun eşleştirme |
| `src/js/08_baslat.js` | Açılış |

## CSS tablosu
| Dosya | İçerik |
|---|---|
| `src/css/01_degiskenler.css` | `:root` değişkenleri |
| `02_header_layout.css` | Üst bar, yerleşim |
| `03_yan_panel.css` | Yan panel, sekmeler, şablon paneli |
| `04_ana_alan_a4.css` | Ana alan, A4 sayfa |
| `05_etiket.css` | Etiket kartı |
| `06_baski.css` | `@media print` |
| `07_renk_temalari.css` | 7 renk teması |

## HTML ve vendor
| Dosya | İçerik |
|---|---|
| `src/html/01_header.html` … `04_excel_modal.html` | Üst bar, yan panel, ana alan, Excel modalı |
| `src/vendor/fontlar.css` | Inter/Sora gömülü (base64) |
| `src/vendor/xlsx.js` | SheetJS 0.18.5 |

Ayrıntı: [docs/MIMARI.md](docs/MIMARI.md), [docs/ARAYUZ.md](docs/ARAYUZ.md), [docs/GITHUB.md](docs/GITHUB.md).

## Bilinen notlar
- CSV içe aktarımında Türkçe karakterler için dosya UTF-8 **BOM'lu** olmalı (Excel'den "CSV UTF-8" kaydı uygundur) veya .xlsx kullanılmalı.
- Baskı sütun boşluğu şu an 1.27 mm'dir (`01`/`06` CSS); 2.5 mm istenirse tek değişiklikle iki yerde güncellenir.
