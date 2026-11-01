from ortak import sayfa
def test():
    with sayfa() as pg:
        pg.evaluate("srAdim(3, 0.05)")
        assert pg.input_value("#sr-kutu-3") == "37.95"
        pg.evaluate("srAdim(3, -0.10)")
        assert pg.input_value("#sr-kutu-3") == "37.85"
        css = pg.evaluate("document.getElementById('satir-css').textContent")
        assert "37.85mm" in css and "37.90mm" in css
        assert not pg.hatalar
