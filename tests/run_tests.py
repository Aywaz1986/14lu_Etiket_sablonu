#!/usr/bin/env python3
"""Tüm tests/NN_*.py dosyalarını çalıştırır (Playwright + Chromium)."""
import glob, importlib.util, os, sys, traceback
d = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, d)
ok = bad = 0
for f in sorted(glob.glob(os.path.join(d, "[0-9][0-9]_*.py"))):
    ad = os.path.basename(f)
    s = importlib.util.spec_from_file_location(ad[:-3], f); m = importlib.util.module_from_spec(s)
    try:
        s.loader.exec_module(m); m.test(); print("OK   ", ad); ok += 1
    except Exception:
        print("HATA ", ad); traceback.print_exc(); bad += 1
print("\n%d geçti, %d hata" % (ok, bad)); sys.exit(1 if bad else 0)
