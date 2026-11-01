from ortak import sayfa
MM = 25.4 / 96
def test():
    with sayfa() as pg:
        pg.emulate_media(media="print")
        r = pg.evaluate("(()=>{const b=document.querySelector('.label-card').getBoundingClientRect();return [b.width,b.height]})()")
        assert abs(r[0] * MM - 99.1) < 0.3, r
        assert abs(r[1] * MM - 37.9) < 0.3, r  # varsayilan satir yuksekligi 37.90 mm
