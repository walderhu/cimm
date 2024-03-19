
const SvgDrawer = require('./SvgDrawer')
class Drawer {

    constructor(options) {
        this.svgDrawer = new SvgDrawer(options);
    }

    draw(data, target, themeName = 'light', infoOnly = false, highlight_atoms = []) {
        let canvas = null;
        if (typeof target === 'string' || target instanceof String) {
            canvas = document.getElementById(target);
        } else {
            canvas = target;
        }
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
        svg.setAttributeNS(null, 'viewBox', '0 0 ' + this.svgDrawer.opts.width + ' ' + this.svgDrawer.opts.height);
        svg.setAttributeNS(null, 'width', this.svgDrawer.opts.width + '');
        svg.setAttributeNS(null, 'height', this.svgDrawer.opts.height + '');
        this.svgDrawer.draw(data, svg, themeName, infoOnly, highlight_atoms);
        this.svgDrawer.svgWrapper.toCanvas(canvas, this.svgDrawer.opts.width, this.svgDrawer.opts.height);
    }

    getTotalOverlapScore() {
        return this.svgDrawer.getTotalOverlapScore();
    }

    getMolecularFormula() {
        this.svgDrawer.getMolecularFormula();
    }
}
module.exports = Drawer;