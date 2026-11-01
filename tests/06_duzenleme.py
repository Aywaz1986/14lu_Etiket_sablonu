from ortak import sayfa
def test():
    with sayfa() as pg:
        pg.evaluate("updateLabel(labels[0].id, 'ad', 'Deneme Kişi')")
        assert pg.evaluate("labels[0].ad") == "Deneme Kişi"
        assert not pg.hatalar
