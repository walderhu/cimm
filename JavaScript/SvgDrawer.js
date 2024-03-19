
// const ArrayHelper = require('./ArrayHelper');
// const Atom = require('./Atom');
// const DrawerBase = require('./DrawerBase');
// const Graph = require('./Graph');
// const Line = require('./Line');
// const SvgWrapper = require('./SvgWrapper');
// const ThemeManager = require('./ThemeManager');
// const Vector2 = require('./Vector2');
// const GaussDrawer = require('./GaussDrawer')
class SvgDrawer {
    constructor(options, clear = true) {
        this.preprocessor = new DrawerBase(options);
        this.opts = this.preprocessor.opts;
        this.clear = clear;
        this.svgWrapper = null;
    }
    draw(data, target, themeName = 'light', weights = null, infoOnly = false, highlight_atoms = [], weightsNormalized = false) {
        if (target === null || target === 'svg') {
            target = document.createElementNS('http:
            target.setAttribute('xmlns', 'http:
            target.setAttribute('xmlns:xlink', 'http:
            target.setAttributeNS(null, 'width', this.opts.width);
            target.setAttributeNS(null, 'height', this.opts.height);
        } else if (target instanceof String) {
            target = document.getElementById(target);
        }
        let optionBackup = {
            padding: this.opts.padding,
            compactDrawing: this.opts.compactDrawing
        };
        if (weights !== null) {
            this.opts.padding += this.opts.weights.additionalPadding;
            this.opts.compactDrawing = false;
        }
        let preprocessor = this.preprocessor;
        preprocessor.initDraw(data, themeName, infoOnly, highlight_atoms);
        if (!infoOnly) {
            this.themeManager = new ThemeManager(this.opts.themes, themeName);
            if (this.svgWrapper === null || this.clear) {
                this.svgWrapper = new SvgWrapper(this.themeManager, target, this.opts, this.clear);
            }
        }
        preprocessor.processGraph();
        this.svgWrapper.determineDimensions(preprocessor.graph.vertices);
        this.drawAtomHighlights(preprocessor.opts.debug);
        this.drawEdges(preprocessor.opts.debug);
        this.drawVertices(preprocessor.opts.debug);
        if (weights !== null) {
            this.drawWeights(weights, weightsNormalized);
        }
        if (preprocessor.opts.debug) {
            console.log(preprocessor.graph);
            console.log(preprocessor.rings);
            console.log(preprocessor.ringConnections);
        }
        this.svgWrapper.constructSvg();
        if (weights !== null) {
            this.opts.padding = optionBackup.padding;
            this.opts.compactDrawing = optionBackup.padding;
        }
        return target;
    }
    drawCanvas(data, target, themeName = 'light', infoOnly = false) {
        let canvas = null;
        if (typeof target === 'string' || target instanceof String) {
            canvas = document.getElementById(target);
        } else {
            canvas = target;
        }
        let svg = document.createElementNS('http:
        svg.setAttribute('xmlns', 'http:
        
        svg.setAttributeNS(null, 'viewBox', '0 0 ' + 500 + ' ' + 500);
        svg.setAttributeNS(null, 'width', 500 + '');
        svg.setAttributeNS(null, 'height', 500 + '');
        svg.setAttributeNS(null, 'style', 'visibility: hidden: position: absolute; left: -1000px');
        document.body.appendChild(svg);
        this.svgDrawer.draw(data, svg, themeName, infoOnly);
        this.svgDrawer.svgWrapper.toCanvas(canvas, this.svgDrawer.opts.width, this.svgDrawer.opts.height);
        document.body.removeChild(svg);
        return target;
    }
    drawAromaticityRing(ring) {
        let svgWrapper = this.svgWrapper;
        svgWrapper.drawRing(ring.center.x, ring.center.y, ring.getSize());
    }
    drawEdges(debug) {
        let preprocessor = this.preprocessor,
            graph = preprocessor.graph,
            rings = preprocessor.rings,
            drawn = Array(this.preprocessor.graph.edges.length);
        drawn.fill(false);
        graph.traverseBF(0, vertex => {
            let edges = graph.getEdges(vertex.id);
            for (var i = 0; i < edges.length; i++) {
                let edgeId = edges[i];
                if (!drawn[edgeId]) {
                    drawn[edgeId] = true;
                    this.drawEdge(edgeId, debug);
                }
            }
        });
        if (!this.bridgedRing) {
            for (var i = 0; i < rings.length; i++) {
                let ring = rings[i];
                if (preprocessor.isRingAromatic(ring)) {
                    this.drawAromaticityRing(ring);
                }
            }
        }
    }
    drawEdge(edgeId, debug) {
        let preprocessor = this.preprocessor,
            opts = preprocessor.opts,
            svgWrapper = this.svgWrapper,
            edge = preprocessor.graph.edges[edgeId],
            vertexA = preprocessor.graph.vertices[edge.sourceId],
            vertexB = preprocessor.graph.vertices[edge.targetId],
            elementA = vertexA.value.element,
            elementB = vertexB.value.element;
        if ((!vertexA.value.isDrawn || !vertexB.value.isDrawn) && preprocessor.opts.atomVisualization === 'default') {
            return;
        }
        let a = vertexA.position,
            b = vertexB.position,
            normals = preprocessor.getEdgeNormals(edge),
            sides = ArrayHelper.clone(normals);
        sides[0].multiplyScalar(10).add(a);
        sides[1].multiplyScalar(10).add(a);
        if (edge.bondType === '=' || preprocessor.getRingbondType(vertexA, vertexB) === '=' ||
            (edge.isPartOfAromaticRing && preprocessor.bridgedRing)) {
            let inRing = preprocessor.areVerticesInSameRing(vertexA, vertexB);
            let s = preprocessor.chooseSide(vertexA, vertexB, sides);
            if (inRing) {
                let lcr = preprocessor.getLargestOrAromaticCommonRing(vertexA, vertexB);
                let center = lcr.center;
                normals[0].multiplyScalar(opts.bondSpacing);
                normals[1].multiplyScalar(opts.bondSpacing);
                let line = null;
                if (center.sameSideAs(vertexA.position, vertexB.position, Vector2.add(a, normals[0]))) {
                    line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                } else {
                    line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                }
                line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
                if (edge.isPartOfAromaticRing) {
                    svgWrapper.drawLine(line, true);
                } else {
                    svgWrapper.drawLine(line);
                }
                svgWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else if ((edge.center || vertexA.isTerminal() && vertexB.isTerminal()) ||
                (s.anCount == 0 && s.bnCount > 1 || s.bnCount == 0 && s.anCount > 1)) {
                this.multiplyNormals(normals, opts.halfBondSpacing);
                let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB),
                    lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                svgWrapper.drawLine(lineA);
                svgWrapper.drawLine(lineB);
            } else if ((s.sideCount[0] > s.sideCount[1]) ||
                (s.totalSideCount[0] > s.totalSideCount[1])) {
                this.multiplyNormals(normals, opts.bondSpacing);
                let line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
                svgWrapper.drawLine(line);
                svgWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else if ((s.sideCount[0] < s.sideCount[1]) ||
                (s.totalSideCount[0] <= s.totalSideCount[1])) {
                this.multiplyNormals(normals, opts.bondSpacing);
                let line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                line.shorten(opts.bondLength - opts.shortBondLength * opts.bondLength);
                svgWrapper.drawLine(line);
                svgWrapper.drawLine(new Line(a, b, elementA, elementB));
            }
        } else if (edge.bondType === '#') {
            normals[0].multiplyScalar(opts.bondSpacing / 1.5);
            normals[1].multiplyScalar(opts.bondSpacing / 1.5);
            let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
            let lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
            svgWrapper.drawLine(lineA);
            svgWrapper.drawLine(lineB);
            svgWrapper.drawLine(new Line(a, b, elementA, elementB));
        } else if (edge.bondType === '.') {
        } else {
            let isChiralCenterA = vertexA.value.isStereoCenter;
            let isChiralCenterB = vertexB.value.isStereoCenter;
            if (edge.wedge === 'up') {
                svgWrapper.drawWedge(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            } else if (edge.wedge === 'down') {
                svgWrapper.drawDashedWedge(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            } else {
                svgWrapper.drawLine(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
        }
        if (debug) {
            let midpoint = Vector2.midpoint(a, b);
            svgWrapper.drawDebugText(midpoint.x, midpoint.y, 'e: ' + edgeId);
        }
    }
    drawAtomHighlights(debug) {
        let preprocessor = this.preprocessor;
        let opts = preprocessor.opts;
        let graph = preprocessor.graph;
        let rings = preprocessor.rings;
        let svgWrapper = this.svgWrapper;
        for (var i = 0; i < graph.vertices.length; i++) {
            let vertex = graph.vertices[i];
            let atom = vertex.value;
            for (var j = 0; j < preprocessor.highlight_atoms.length; j++) {
                let highlight = preprocessor.highlight_atoms[j]
                if (atom.class === highlight[0]) {
                    svgWrapper.drawAtomHighlight(vertex.position.x, vertex.position.y, highlight[1]);
                }
            }
        }
    }
    drawVertices(debug) {
        let preprocessor = this.preprocessor,
            opts = preprocessor.opts,
            graph = preprocessor.graph,
            rings = preprocessor.rings,
            svgWrapper = this.svgWrapper;
        var i = graph.vertices.length;
        for (var i = 0; i < graph.vertices.length; i++) {
            let vertex = graph.vertices[i];
            let atom = vertex.value;
            let charge = 0;
            let isotope = 0;
            let bondCount = vertex.value.bondCount;
            let element = atom.element;
            let hydrogens = Atom.maxBonds[element] - bondCount;
            let dir = vertex.getTextDirection(graph.vertices, atom.hasAttachedPseudoElements);
            let isTerminal = opts.terminalCarbons || element !== 'C' || atom.hasAttachedPseudoElements ? vertex.isTerminal() : false;
            let isCarbon = atom.element === 'C';
            if (graph.vertices.length < 3) {
                isCarbon = false;
            }
            if (atom.element === 'N' && atom.isPartOfAromaticRing) {
                hydrogens = 0;
            }
            if (atom.bracket) {
                hydrogens = atom.bracket.hcount;
                charge = atom.bracket.charge;
                isotope = atom.bracket.isotope;
            }
            if (opts.atomVisualization === 'allballs') {
                svgWrapper.drawBall(vertex.position.x, vertex.position.y, element);
            } else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements)) || graph.vertices.length === 1) {
                if (opts.atomVisualization === 'default') {
                    let attachedPseudoElements = atom.getAttachedPseudoElements();
                    if (atom.hasAttachedPseudoElements && graph.vertices.length === Object.keys(attachedPseudoElements).length + 1) {
                        dir = 'right';
                    }
                    svgWrapper.drawText(vertex.position.x, vertex.position.y,
                        element, hydrogens, dir, isTerminal, charge, isotope, graph.vertices.length, attachedPseudoElements);
                } else if (opts.atomVisualization === 'balls') {
                    svgWrapper.drawBall(vertex.position.x, vertex.position.y, element);
                }
            } else if (vertex.getNeighbourCount() === 2 && vertex.forcePositioned == true) {
                let a = graph.vertices[vertex.neighbours[0]].position;
                let b = graph.vertices[vertex.neighbours[1]].position;
                let angle = Vector2.threePointangle(vertex.position, a, b);
                if (Math.abs(Math.PI - angle) < 0.1) {
                    svgWrapper.drawPoint(vertex.position.x, vertex.position.y, element);
                }
            }
            if (debug) {
                let value = 'v: ' + vertex.id + ' ' + ArrayHelper.print(atom.ringbonds);
                svgWrapper.drawDebugText(vertex.position.x, vertex.position.y, value);
            }
        }
        if (opts.debug) {
            for (var i = 0; i < rings.length; i++) {
                let center = rings[i].center;
                svgWrapper.drawDebugPoint(center.x, center.y, 'r: ' + rings[i].id);
            }
        }
    }
    drawWeights(weights, weightsNormalized) {
        if (weights.every(w => w === 0)) {
            return;
        }
        if (weights.length !== this.preprocessor.graph.atomIdxToVertexId.length) {
            throw new Error('The number of weights supplied must be equal to the number of (heavy) atoms in the molecule.');
        }
        let points = [];
        for (const atomIdx of this.preprocessor.graph.atomIdxToVertexId) {
            let vertex = this.preprocessor.graph.vertices[atomIdx];
            points.push(new Vector2(
                vertex.position.x - this.svgWrapper.minX,
                vertex.position.y - this.svgWrapper.minY)
            );
        }
        let gd = new GaussDrawer(
            points, weights, this.svgWrapper.drawingWidth, this.svgWrapper.drawingHeight,
            this.opts.weights.sigma, this.opts.weights.interval, this.opts.weights.colormap,
            this.opts.weights.opacity, weightsNormalized
        );
        gd.draw();
        this.svgWrapper.addLayer(gd.getSVG());
    }
    getTotalOverlapScore() {
        return this.preprocessor.getTotalOverlapScore();
    }
    getMolecularFormula(graph = null) {
        return this.preprocessor.getMolecularFormula(graph);
    }
    multiplyNormals(normals, spacing) {
        normals[0].multiplyScalar(spacing);
        normals[1].multiplyScalar(spacing);
    }
}
module.exports = SvgDrawer;