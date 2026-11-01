#!/usr/bin/env python3
"""src/ -> tek dosya HTML. Yalnızca Python standart kütüphanesi.

Kullanım:
  python build.py                 dist/Etiket-Sablonu-14li-<sürüm>.html üretir
  python build.py --check dist/   src ile dist aynı mı kontrol eder (CI)
  python build.py --out DIZIN     başka dizine yazar
"""
import argparse, glob, os, re, sys

KOK = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(KOK, "src")
AD = "Etiket-Sablonu-14li"
INC = re.compile(r"^\{\{INCLUDE:([^}]+)\}\}\n?", re.M)


def oku(yol):
    with open(yol, encoding="utf-8", newline="") as f:
        return f.read()


def genislet(metin):
    def yerine(m):
        desen = m.group(1).strip()
        yollar = sorted(glob.glob(os.path.join(SRC, desen)))
        if not yollar:
            sys.exit("INCLUDE bulunamadı: " + desen)
        return "".join(genislet(oku(y)) for y in yollar)
    return INC.sub(yerine, metin)


def surum():
    m = re.search(r"APP_SURUM\s*=\s*['\"]([^'\"]+)['\"]", oku(os.path.join(SRC, "js", "01_sabitler_db.js")))
    if not m:
        sys.exit("APP_SURUM src/js/01_sabitler_db.js içinde bulunamadı")
    return m.group(1)


def uret():
    return genislet(oku(os.path.join(SRC, "index.template.html")))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--check", metavar="DIZIN")
    ap.add_argument("--out", metavar="DIZIN")
    a = ap.parse_args()
    cikti = uret()
    ad = "%s-%s.html" % (AD, surum())
    if a.check:
        yol = os.path.join(a.check, ad)
        if not os.path.exists(yol) or oku(yol) != cikti:
            sys.exit("HATA: %s src ile uyuşmuyor. 'python build.py' çalıştırın." % yol)
        print("OK: dist src ile aynı (%s)" % ad)
        return
    hedef = a.out or os.path.join(KOK, "dist")
    os.makedirs(hedef, exist_ok=True)
    with open(os.path.join(hedef, ad), "w", encoding="utf-8", newline="") as f:
        f.write(cikti)
    print("Yazıldı:", os.path.join(hedef, ad), "(%d KB)" % (len(cikti.encode()) // 1024))


if __name__ == "__main__":
    main()
