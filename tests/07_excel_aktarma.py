import os
from ortak import sayfa, KOK
def test():
    with sayfa() as pg:
        pg.set_input_files("#excel-file-input", os.path.join(KOK, "tests", "fixtures", "ornek.csv"))
        pg.wait_for_selector("#excel-modal", state="visible")
        pg.evaluate("excelIceAktar()")
        assert pg.evaluate("labels[0].ad") == "Ayşe Yılmaz"
        assert pg.evaluate("labels[1].kurum") == "Test Kurumu B"
        assert not pg.hatalar
