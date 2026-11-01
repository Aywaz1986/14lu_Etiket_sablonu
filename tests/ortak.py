import glob, os, sys
from contextlib import contextmanager
from playwright.sync_api import sync_playwright
KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def dist_yolu():
    d = sorted(glob.glob(os.path.join(KOK, "dist", "*.html")))
    if not d:
        sys.exit("dist/ boş: önce 'python build.py'")
    return d[-1]

@contextmanager
def sayfa():
    with sync_playwright() as p:
        b = p.chromium.launch()
        pg = b.new_page(viewport={"width": 1400, "height": 900})
        pg.hatalar, pg.istekler = [], []
        pg.on("pageerror", lambda e: pg.hatalar.append(str(e)))
        pg.on("request", lambda r: pg.istekler.append(r.url))
        pg.goto("file://" + dist_yolu())
        pg.wait_for_selector(".label-card")
        yield pg
        b.close()
