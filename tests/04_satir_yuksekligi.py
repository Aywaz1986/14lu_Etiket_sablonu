from ortak import sayfa
def test():
    with sayfa() as pg:
        pg.evaluate("srAdim(3, 0.05)")
        assert pg.input_value("#sr-kutu-3") == "38.15"
        pg.evaluate("srAdim(3, -0.10)")
        assert pg.input_value("#sr-kutu-3") == "38.05"
        css = pg.evaluate("document.getElementById('satir-css').textContent")
        assert "38.05mm" in css and "38.10mm" in css
        assert not pg.hatalar
