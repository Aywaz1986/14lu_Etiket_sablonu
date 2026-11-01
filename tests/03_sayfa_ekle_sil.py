from ortak import sayfa
def test():
    with sayfa() as pg:
        pg.on('dialog', lambda d: d.accept())
        pg.evaluate("sayfaEkle()")
        assert pg.locator(".label-card").count() == 28
        assert pg.locator(".sayfa-bloku").count() == 2
        pg.evaluate("sonSayfayiSil()")
        assert pg.locator(".label-card").count() == 14
        assert not pg.hatalar
