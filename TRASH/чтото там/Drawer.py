import svgwrite

class SvgDrawer:
    def __init__(self, options):
        self.svgDrawer = svgwrite(options)
        pass

    def draw(self, data, svg, themeName='light', infoOnly=False, highlight_atoms=[]):
        pass

    def getTotalOverlapScore(self):
        pass

    def getMolecularFormula(self):
        pass

class Drawer:
    def __init__(self, options):
        self.svgDrawer = SvgDrawer(options)

    def draw(self, data, target, themeName='light', infoOnly=False, highlight_atoms=[]):
        svg = svgwrite.Drawing()
        svg.viewbox(0, 0, self.svgDrawer.opts.width, self.svgDrawer.opts.height)
        self.svgDrawer.draw(data, svg, themeName, infoOnly, highlight_atoms)
        # Implement logic to convert SVG to canvas

    def getTotalOverlapScore(self):
        return self.svgDrawer.getTotalOverlapScore()

    def getMolecularFormula(self):
        return self.svgDrawer.getMolecularFormula()

