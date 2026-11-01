# Mimari
```mermaid
flowchart LR
  T[src/index.template.html] -->|INCLUDE| B[build.py]
  C[src/css] --> B
  H[src/html] --> B
  J[src/js] --> B
  V[src/vendor] --> B
  B --> D[dist/Etiket-Sablonu-14li-SURUM.html]
  D --> P[tests/run_tests.py]
```
- Tek global kapsam: JS parçaları sırayla birleştirilir (satır içi `onclick` için).
- Veri: `labels` dizisi; localStorage `etiket14-data`; IndexedDB `EtiketDB/sablonlar`.
- Satır yüksekliği: `satirGuncelle()` dinamik `<style id="satir-css">` yazar.
