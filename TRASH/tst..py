import svgwrite, svgwrite.container
import bs4


class Drawer:
    def __init__(self, options):
        self.opts = options
        self.svgWrapper = svgwrite.container.SVG()

    def draw(self, data, svg, themeName='light', infoOnly=False, highlight_atoms=[]):
        for element in data:
            if element['type'] == 'line':
                line = svgwrite.shapes.Line(start=(element['x1'], element['y1']), end=(element['x2'], element['y2']), stroke='black')
                svg.add(line)
            elif element['type'] == 'circle':
                circle = svgwrite.shapes.Circle(center=(element['cx'], element['cy']), r=element['r'], fill='red')
                svg.add(circle)

    def getTotalOverlapScore(self):
        total_overlap_score = 0
        return total_overlap_score

    def getMolecularFormula(self):
        molecular_formula = "C6H12O6"
        return molecular_formula
