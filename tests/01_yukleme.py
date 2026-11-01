from ortak import sayfa
def test():
    with sayfa() as pg:
        assert not pg.hatalar, pg.hatalar
        assert pg.locator(".label-card").count() == 14
        assert pg.locator(".a4-sheet").count() == 1
