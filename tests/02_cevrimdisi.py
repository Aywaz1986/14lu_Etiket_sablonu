from ortak import sayfa
def test():
    with sayfa() as pg:
        dis = [u for u in pg.istekler if not u.startswith(("file:", "data:", "blob:"))]
        assert not dis, "Dış bağımlılık: %s" % dis
        assert pg.evaluate("typeof XLSX") == "object"
