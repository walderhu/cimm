import svgwrite, svgwrite.container, svgwrite.shapes
import bs4


class Drawer:
    'The main class of the application representing the smiles drawer'
    def __init__(self, options):
        self.opts = options
        
        
    def draw(self, data, target, themeName='light', infoOnly=False, highlight_atoms=[]):
        canvas = svgwrite.Drawing() if isinstance(target, str) else target
        canvas['xmlns'] = 'http://www.w3.org/2000/svg'
        canvas['viewBox'] = f'0 0 {self.opts["width"]} {self.opts["height"]}'
        canvas['width'] = str(self.opts["width"])
        canvas['height'] = str(self.opts["height"])
        canvas.stroke(width=str(self.opts["width"]), )

    def getTotalOverlapScore(self):
        self.svg.get
        total_overlap_score = 0
        
        return total_overlap_score

    def getMolecularFormula(self):
        molecular_formula = "C6H12O6"
        return molecular_formula
