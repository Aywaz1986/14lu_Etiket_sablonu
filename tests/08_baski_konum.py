from ortak import sayfa
MM = 25.4 / 96
def test():
    """Tanex TW-2014 resmi Word şablonu: üst 15.19, sol 4.50, 2. sütun 106.32, satır 38.10 mm."""
    with sayfa() as pg:
        pg.emulate_media(media="print")
        r = pg.evaluate("""(()=>{const s=document.querySelector('.a4-sheet').getBoundingClientRect();
          const c=[...document.querySelectorAll('.a4-sheet .label-card')].map(e=>e.getBoundingClientRect());
          return {x0:c[0].left-s.left,y0:c[0].top-s.top,x1:c[1].left-s.left,y1:c[2].top-c[0].top,y6:c[12].top-s.top}})()""")
        exp = {"x0": 4.5, "y0": 15.19, "x1": 106.32, "y1": 38.1, "y6": 15.19 + 6 * 38.1}
        for k, v in exp.items():
            assert abs(r[k] * MM - v) < 0.2, (k, r[k] * MM, v)
