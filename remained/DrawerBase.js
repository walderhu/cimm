
const MathHelper = require('./MathHelper')
const ArrayHelper = require('./ArrayHelper')
const Vector2 = require('./Vector2')
const Line = require('./Line')
const Vertex = require('./Vertex')
const Edge = require('./Edge')
const Atom = require('./Atom')
const Ring = require('./Ring')
const RingConnection = require('./RingConnection')
const CanvasWrapper = require('./CanvasWrapper')
const Graph = require('./Graph')
const SSSR = require('./SSSR')
const ThemeManager = require('./ThemeManager')
const Options = require('./Options')
class DrawerBase {
    
    constructor(options) {
        this.graph = null;
        this.doubleBondConfigCount = 0;
        this.doubleBondConfig = null;
        this.ringIdCounter = 0;
        this.ringConnectionIdCounter = 0;
        this.canvasWrapper = null;
        this.totalOverlapScore = 0;
        this.defaultOptions = {
            width: 500,
            height: 500,
            scale: 0.0,
            bondThickness: 1.0,
            bondLength: 30,
            shortBondLength: 0.8,
            bondSpacing: 0.17 * 30,
            atomVisualization: 'default',
            isomeric: true,
            debug: false,
            terminalCarbons: false,
            explicitHydrogens: true,
            overlapSensitivity: 0.42,
            overlapResolutionIterations: 1,
            compactDrawing: true,
            fontFamily: 'Arial, Helvetica, sans-serif',
            fontSizeLarge: 11,
            fontSizeSmall: 3,
            padding: 10.0,
            experimentalSSSR: false,
            kkThreshold: 0.1,
            kkInnerThreshold: 0.1,
            kkMaxIteration: 20000,
            kkMaxInnerIteration: 50,
            kkMaxEnergy: 1e9,
            weights: {
                colormap: null,
                additionalPadding: 20.0,
                sigma: 10,
                interval: 0.0,
                opacity: 1.0,
            },
            themes: {
                dark: {
                    C: '#fff',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#aaa',
                    BACKGROUND: '#141414'
                },
                light: {
                    C: '#222',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#666',
                    BACKGROUND: '#fff'
                },
                oldschool: {
                    C: '#000',
                    O: '#000',
                    N: '#000',
                    F: '#000',
                    CL: '#000',
                    BR: '#000',
                    I: '#000',
                    P: '#000',
                    S: '#000',
                    B: '#000',
                    SI: '#000',
                    H: '#000',
                    BACKGROUND: '#fff'
                },
                "solarized": {
                    C: "#586e75",
                    O: "#dc322f",
                    N: "#268bd2",
                    F: "#859900",
                    CL: "#16a085",
                    BR: "#cb4b16",
                    I: "#6c71c4",
                    P: "#d33682",
                    S: "#b58900",
                    B: "#2aa198",
                    SI: "#2aa198",
                    H: "#657b83",
                    BACKGROUND: "#fff"
                },
                "solarized-dark": {
                    C: "#93a1a1",
                    O: "#dc322f",
                    N: "#268bd2",
                    F: "#859900",
                    CL: "#16a085",
                    BR: "#cb4b16",
                    I: "#6c71c4",
                    P: "#d33682",
                    S: "#b58900",
                    B: "#2aa198",
                    SI: "#2aa198",
                    H: "#839496",
                    BACKGROUND: "#fff"
                },
                "matrix": {
                    C: "#678c61",
                    O: "#2fc079",
                    N: "#4f7e7e",
                    F: "#90d762",
                    CL: "#82d967",
                    BR: "#23755a",
                    I: "#409931",
                    P: "#c1ff8a",
                    S: "#faff00",
                    B: "#50b45a",
                    SI: "#409931",
                    H: "#426644",
                    BACKGROUND: "#fff"
                },
                "github": {
                    C: "#24292f",
                    O: "#cf222e",
                    N: "#0969da",
                    F: "#2da44e",
                    CL: "#6fdd8b",
                    BR: "#bc4c00",
                    I: "#8250df",
                    P: "#bf3989",
                    S: "#d4a72c",
                    B: "#fb8f44",
                    SI: "#bc4c00",
                    H: "#57606a",
                    BACKGROUND: "#fff"
                },
                "carbon": {
                    C: "#161616",
                    O: "#da1e28",
                    N: "#0f62fe",
                    F: "#198038",
                    CL: "#007d79",
                    BR: "#fa4d56",
                    I: "#8a3ffc",
                    P: "#ff832b",
                    S: "#f1c21b",
                    B: "#8a3800",
                    SI: "#e67e22",
                    H: "#525252",
                    BACKGROUND: "#fff"
                },
                "cyberpunk": {
                    C: "#ea00d9",
                    O: "#ff3131",
                    N: "#0abdc6",
                    F: "#00ff9f",
                    CL: "#00fe00",
                    BR: "#fe9f20",
                    I: "#ff00ff",
                    P: "#fe7f00",
                    S: "#fcee0c",
                    B: "#ff00ff",
                    SI: "#ffffff",
                    H: "#913cb1",
                    BACKGROUND: "#fff"
                },
                "gruvbox": {
                    C: "#665c54",
                    O: "#cc241d",
                    N: "#458588",
                    F: "#98971a",
                    CL: "#79740e",
                    BR: "#d65d0e",
                    I: "#b16286",
                    P: "#af3a03",
                    S: "#d79921",
                    B: "#689d6a",
                    SI: "#427b58",
                    H: "#7c6f64",
                    BACKGROUND: "#fbf1c7"
                },
                "gruvbox-dark": {
                    C: "#ebdbb2",
                    O: "#cc241d",
                    N: "#458588",
                    F: "#98971a",
                    CL: "#b8bb26",
                    BR: "#d65d0e",
                    I: "#b16286",
                    P: "#fe8019",
                    S: "#d79921",
                    B: "#8ec07c",
                    SI: "#83a598",
                    H: "#bdae93",
                    BACKGROUND: "#282828"
                },
                custom: {
                    C: '#222',
                    O: '#e74c3c',
                    N: '#3498db',
                    F: '#27ae60',
                    CL: '#16a085',
                    BR: '#d35400',
                    I: '#8e44ad',
                    P: '#d35400',
                    S: '#f1c40f',
                    B: '#e67e22',
                    SI: '#e67e22',
                    H: '#666',
                    BACKGROUND: '#fff'
                },
            }
        };
        this.opts = Options.extend(true, this.defaultOptions, options);
        this.opts.halfBondSpacing = this.opts.bondSpacing / 2.0;
        this.opts.bondLengthSq = this.opts.bondLength * this.opts.bondLength;
        this.opts.halfFontSizeLarge = this.opts.fontSizeLarge / 2.0;
        this.opts.quarterFontSizeLarge = this.opts.fontSizeLarge / 4.0;
        this.opts.fifthFontSizeSmall = this.opts.fontSizeSmall / 5.0;
        
        this.theme = this.opts.themes.dark;
    }
    
    draw(data, target, themeName = 'light', infoOnly = false) {
        this.initDraw(data, themeName, infoOnly);
        if (!this.infoOnly) {
            this.themeManager = new ThemeManager(this.opts.themes, themeName);
            this.canvasWrapper = new CanvasWrapper(target, this.themeManager, this.opts);
        }
        if (!infoOnly) {
            this.processGraph();
            
            this.canvasWrapper.scale(this.graph.vertices);
            
            this.drawEdges(this.opts.debug);
            this.drawVertices(this.opts.debug);
            this.canvasWrapper.reset();
            if (this.opts.debug) {
                console.log(this.graph);
                console.log(this.rings);
                console.log(this.ringConnections);
            }
        }
    }
    
    edgeRingCount(edgeId) {
        let edge = this.graph.edges[edgeId];
        let a = this.graph.vertices[edge.sourceId];
        let b = this.graph.vertices[edge.targetId];
        return Math.min(a.value.rings.length, b.value.rings.length);
    }
    
    getBridgedRings() {
        let bridgedRings = Array();
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isBridged) {
                bridgedRings.push(this.rings[i]);
            }
        }
        return bridgedRings;
    }
    
    getFusedRings() {
        let fusedRings = Array();
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isFused) {
                fusedRings.push(this.rings[i]);
            }
        }
        return fusedRings;
    }
    
    getSpiros() {
        let spiros = Array();
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isSpiro) {
                spiros.push(this.rings[i]);
            }
        }
        return spiros;
    }
    
    printRingInfo() {
        let result = '';
        for (var i = 0; i < this.rings.length; i++) {
            const ring = this.rings[i];
            result += ring.id + ';';
            result += ring.members.length + ';';
            result += ring.neighbours.length + ';';
            result += ring.isSpiro ? 'true;' : 'false;'
            result += ring.isFused ? 'true;' : 'false;'
            result += ring.isBridged ? 'true;' : 'false;'
            result += ring.rings.length + ';';
            result += '\n';
        }
        return result;
    }
    
    rotateDrawing() {
        
        
        let a = 0;
        let b = 0;
        let maxDist = 0;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let vertexA = this.graph.vertices[i];
            if (!vertexA.value.isDrawn) {
                continue;
            }
            for (var j = i + 1; j < this.graph.vertices.length; j++) {
                let vertexB = this.graph.vertices[j];
                if (!vertexB.value.isDrawn) {
                    continue;
                }
                let dist = vertexA.position.distanceSq(vertexB.position);
                if (dist > maxDist) {
                    maxDist = dist;
                    a = i;
                    b = j;
                }
            }
        }
        let angle = -Vector2.subtract(this.graph.vertices[a].position, this.graph.vertices[b].position).angle();
        if (!isNaN(angle)) {
            
            let remainder = angle % 0.523599;
            
            if (remainder < 0.2617995) {
                angle = angle - remainder;
            } else {
                angle += 0.523599 - remainder;
            }
            
            for (var i = 0; i < this.graph.vertices.length; i++) {
                if (i === b) {
                    continue;
                }
                this.graph.vertices[i].position.rotateAround(angle, this.graph.vertices[b].position);
            }
            for (var i = 0; i < this.rings.length; i++) {
                this.rings[i].center.rotateAround(angle, this.graph.vertices[b].position);
            }
        }
    }
    
    getTotalOverlapScore() {
        return this.totalOverlapScore;
    }
    
    getRingCount() {
        return this.rings.length;
    }
    
    hasBridgedRing() {
        return this.bridgedRing;
    }
    
    getHeavyAtomCount() {
        let hac = 0;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            if (this.graph.vertices[i].value.element !== 'H') {
                hac++;
            }
        }
        return hac;
    }
    
    getMolecularFormula(data = null) {
        let molecularFormula = '';
        let counts = new Map();
        let graph = data === null ? this.graph : new Graph(data, this.opts.isomeric);
        
        for (var i = 0; i < graph.vertices.length; i++) {
            let atom = graph.vertices[i].value;
            if (counts.has(atom.element)) {
                counts.set(atom.element, counts.get(atom.element) + 1);
            } else {
                counts.set(atom.element, 1);
            }
            
            
            if (atom.bracket && !atom.bracket.chirality) {
                if (counts.has('H')) {
                    counts.set('H', counts.get('H') + atom.bracket.hcount);
                } else {
                    counts.set('H', atom.bracket.hcount);
                }
            }
            
            
            
            if (!atom.bracket) {
                let nHydrogens = Atom.maxBonds[atom.element] - atom.bondCount;
                if (atom.isPartOfAromaticRing) {
                    nHydrogens--;
                }
                if (counts.has('H')) {
                    counts.set('H', counts.get('H') + nHydrogens);
                } else {
                    counts.set('H', nHydrogens);
                }
            }
        }
        if (counts.has('C')) {
            let count = counts.get('C');
            molecularFormula += 'C' + (count > 1 ? count : '');
            counts.delete('C');
        }
        if (counts.has('H')) {
            let count = counts.get('H');
            molecularFormula += 'H' + (count > 1 ? count : '');
            counts.delete('H');
        }
        let elements = Object.keys(Atom.atomicNumbers).sort();
        elements.map(e => {
            if (counts.has(e)) {
                let count = counts.get(e);
                molecularFormula += e + (count > 1 ? count : '');
            }
        });
        return molecularFormula;
    }
    
    getRingbondType(vertexA, vertexB) {
        
        
        if (vertexA.value.getRingbondCount() < 1 || vertexB.value.getRingbondCount() < 1) {
            return null;
        }
        for (var i = 0; i < vertexA.value.ringbonds.length; i++) {
            for (var j = 0; j < vertexB.value.ringbonds.length; j++) {
                
                if (vertexA.value.ringbonds[i].id === vertexB.value.ringbonds[j].id) {
                    
                    
                    if (vertexA.value.ringbonds[i].bondType === '-') {
                        return vertexB.value.ringbonds[j].bond;
                    } else {
                        return vertexA.value.ringbonds[i].bond;
                    }
                }
            }
        }
        return null;
    }
    initDraw(data, themeName, infoOnly, highlight_atoms) {
        this.data = data;
        this.infoOnly = infoOnly;
        this.ringIdCounter = 0;
        this.ringConnectionIdCounter = 0;
        this.graph = new Graph(data, this.opts.isomeric);
        this.rings = Array();
        this.ringConnections = Array();
        this.originalRings = Array();
        this.originalRingConnections = Array();
        this.bridgedRing = false;
        
        this.doubleBondConfigCount = null;
        this.doubleBondConfig = null;
        this.highlight_atoms = highlight_atoms
        this.initRings();
        this.initHydrogens();
    }
    processGraph() {
        this.position();
        
        this.restoreRingInformation();
        
        this.resolvePrimaryOverlaps();
        let overlapScore = this.getOverlapScore();
        this.totalOverlapScore = this.getOverlapScore().total;
        for (var o = 0; o < this.opts.overlapResolutionIterations; o++) {
            for (var i = 0; i < this.graph.edges.length; i++) {
                let edge = this.graph.edges[i];
                if (this.isEdgeRotatable(edge)) {
                    let subTreeDepthA = this.graph.getTreeDepth(edge.sourceId, edge.targetId);
                    let subTreeDepthB = this.graph.getTreeDepth(edge.targetId, edge.sourceId);
                    
                    let a = edge.targetId;
                    let b = edge.sourceId;
                    if (subTreeDepthA > subTreeDepthB) {
                        a = edge.sourceId;
                        b = edge.targetId;
                    }
                    let subTreeOverlap = this.getSubtreeOverlapScore(b, a, overlapScore.vertexScores);
                    if (subTreeOverlap.value > this.opts.overlapSensitivity) {
                        let vertexA = this.graph.vertices[a];
                        let vertexB = this.graph.vertices[b];
                        let neighboursB = vertexB.getNeighbours(a);
                        if (neighboursB.length === 1) {
                            let neighbour = this.graph.vertices[neighboursB[0]];
                            let angle = neighbour.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, MathHelper.toRad(120));
                            this.rotateSubtree(neighbour.id, vertexB.id, angle, vertexB.position);
                            
                            let newTotalOverlapScore = this.getOverlapScore().total;
                            if (newTotalOverlapScore > this.totalOverlapScore) {
                                this.rotateSubtree(neighbour.id, vertexB.id, -angle, vertexB.position);
                            } else {
                                this.totalOverlapScore = newTotalOverlapScore;
                            }
                        } else if (neighboursB.length === 2) {
                            
                            
                            if (vertexB.value.rings.length !== 0 && vertexA.value.rings.length !== 0) {
                                continue;
                            }
                            let neighbourA = this.graph.vertices[neighboursB[0]];
                            let neighbourB = this.graph.vertices[neighboursB[1]];
                            if (neighbourA.value.rings.length === 1 && neighbourB.value.rings.length === 1) {
                                
                                if (neighbourA.value.rings[0] !== neighbourB.value.rings[0]) {
                                    continue;
                                }
                                
                            } else if (neighbourA.value.rings.length !== 0 || neighbourB.value.rings.length !== 0) {
                                continue;
                            } else {
                                let angleA = neighbourA.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, MathHelper.toRad(120));
                                let angleB = neighbourB.position.getRotateAwayFromAngle(vertexA.position, vertexB.position, MathHelper.toRad(120));
                                this.rotateSubtree(neighbourA.id, vertexB.id, angleA, vertexB.position);
                                this.rotateSubtree(neighbourB.id, vertexB.id, angleB, vertexB.position);
                                let newTotalOverlapScore = this.getOverlapScore().total;
                                if (newTotalOverlapScore > this.totalOverlapScore) {
                                    this.rotateSubtree(neighbourA.id, vertexB.id, -angleA, vertexB.position);
                                    this.rotateSubtree(neighbourB.id, vertexB.id, -angleB, vertexB.position);
                                } else {
                                    this.totalOverlapScore = newTotalOverlapScore;
                                }
                            }
                        }
                        overlapScore = this.getOverlapScore();
                    }
                }
            }
        }
        this.resolveSecondaryOverlaps(overlapScore.scores);
        if (this.opts.isomeric) {
            this.annotateStereochemistry();
        }
        
        if (this.opts.compactDrawing && this.opts.atomVisualization === 'default') {
            this.initPseudoElements();
        }
        this.rotateDrawing();
    }
    
    initRings() {
        let openBonds = new Map();
        
        for (var i = this.graph.vertices.length - 1; i >= 0; i--) {
            let vertex = this.graph.vertices[i];
            if (vertex.value.ringbonds.length === 0) {
                continue;
            }
            for (var j = 0; j < vertex.value.ringbonds.length; j++) {
                let ringbondId = vertex.value.ringbonds[j].id;
                let ringbondBond = vertex.value.ringbonds[j].bond;
                
                
                
                
                if (!openBonds.has(ringbondId)) {
                    openBonds.set(ringbondId, [vertex.id, ringbondBond]);
                } else {
                    let sourceVertexId = vertex.id;
                    let targetVertexId = openBonds.get(ringbondId)[0];
                    let targetRingbondBond = openBonds.get(ringbondId)[1];
                    let edge = new Edge(sourceVertexId, targetVertexId, 1);
                    edge.setBondType(targetRingbondBond || ringbondBond || '-');
                    let edgeId = this.graph.addEdge(edge);
                    let targetVertex = this.graph.vertices[targetVertexId];
                    vertex.addRingbondChild(targetVertexId, j);
                    vertex.value.addNeighbouringElement(targetVertex.value.element);
                    targetVertex.addRingbondChild(sourceVertexId, j);
                    targetVertex.value.addNeighbouringElement(vertex.value.element);
                    vertex.edges.push(edgeId);
                    targetVertex.edges.push(edgeId);
                    openBonds.delete(ringbondId);
                }
            }
        }
        
        let rings = SSSR.getRings(this.graph, this.opts.experimentalSSSR);
        if (rings === null) {
            return;
        }
        for (var i = 0; i < rings.length; i++) {
            let ringVertices = [...rings[i]];
            let ringId = this.addRing(new Ring(ringVertices));
            
            for (var j = 0; j < ringVertices.length; j++) {
                this.graph.vertices[ringVertices[j]].value.rings.push(ringId);
            }
        }
        
        
        
        for (var i = 0; i < this.rings.length - 1; i++) {
            for (var j = i + 1; j < this.rings.length; j++) {
                let a = this.rings[i];
                let b = this.rings[j];
                let ringConnection = new RingConnection(a, b);
                
                
                if (ringConnection.vertices.size > 0) {
                    this.addRingConnection(ringConnection);
                }
            }
        }
        
        for (var i = 0; i < this.rings.length; i++) {
            let ring = this.rings[i];
            ring.neighbours = RingConnection.getNeighbours(this.ringConnections, ring.id);
        }
        
        
        for (var i = 0; i < this.rings.length; i++) {
            let ring = this.rings[i];
            this.graph.vertices[ring.members[0]].value.addAnchoredRing(ring.id);
        }
        
        
        
        this.backupRingInformation();
        
        while (this.rings.length > 0) {
            let id = -1;
            for (var i = 0; i < this.rings.length; i++) {
                let ring = this.rings[i];
                if (this.isPartOfBridgedRing(ring.id) && !ring.isBridged) {
                    id = ring.id;
                }
            }
            if (id === -1) {
                break;
            }
            let ring = this.getRing(id);
            let involvedRings = this.getBridgedRingRings(ring.id);
            this.bridgedRing = true;
            this.createBridgedRing(involvedRings, ring.members[0]);
            
            for (var i = 0; i < involvedRings.length; i++) {
                this.removeRing(involvedRings[i]);
            }
        }
    }
    initHydrogens() {
        
        if (!this.opts.explicitHydrogens) {
            for (var i = 0; i < this.graph.vertices.length; i++) {
                let vertex = this.graph.vertices[i];
                if (vertex.value.element !== 'H') {
                    continue;
                }
                
                
                let neighbour = this.graph.vertices[vertex.neighbours[0]];
                neighbour.value.hasHydrogen = true;
                if (!neighbour.value.isStereoCenter || neighbour.value.rings.length < 2 && !neighbour.value.bridgedRing ||
                    neighbour.value.bridgedRing && neighbour.value.originalRings.length < 2) {
                    vertex.value.isDrawn = false;
                }
            }
        }
    }
    
    getBridgedRingRings(ringId) {
        let involvedRings = Array();
        let that = this;
        let recurse = function (r) {
            let ring = that.getRing(r);
            involvedRings.push(r);
            for (var i = 0; i < ring.neighbours.length; i++) {
                let n = ring.neighbours[i];
                if (involvedRings.indexOf(n) === -1 &&
                    n !== r &&
                    RingConnection.isBridge(that.ringConnections, that.graph.vertices, r, n)) {
                    recurse(n);
                }
            }
        };
        recurse(ringId);
        return ArrayHelper.unique(involvedRings);
    }
    
    isPartOfBridgedRing(ringId) {
        for (var i = 0; i < this.ringConnections.length; i++) {
            if (this.ringConnections[i].containsRing(ringId) &&
                this.ringConnections[i].isBridge(this.graph.vertices)) {
                return true;
            }
        }
        return false;
    }
    
    createBridgedRing(ringIds, sourceVertexId) {
        let ringMembers = new Set();
        let vertices = new Set();
        let neighbours = new Set();
        for (var i = 0; i < ringIds.length; i++) {
            let ring = this.getRing(ringIds[i]);
            ring.isPartOfBridged = true;
            for (var j = 0; j < ring.members.length; j++) {
                vertices.add(ring.members[j]);
            }
            for (var j = 0; j < ring.neighbours.length; j++) {
                let id = ring.neighbours[j];
                if (ringIds.indexOf(id) === -1) {
                    neighbours.add(ring.neighbours[j]);
                }
            }
        }
        
        
        
        let leftovers = new Set();
        for (let id of vertices) {
            let vertex = this.graph.vertices[id];
            let intersection = ArrayHelper.intersection(ringIds, vertex.value.rings);
            if (vertex.value.rings.length === 1 || intersection.length === 1) {
                ringMembers.add(vertex.id);
            } else {
                leftovers.add(vertex.id);
            }
        }
        
        
        
        let tmp = Array();
        let insideRing = Array();
        for (let id of leftovers) {
            let vertex = this.graph.vertices[id];
            let onRing = false;
            for (let j = 0; j < vertex.edges.length; j++) {
                if (this.edgeRingCount(vertex.edges[j]) === 1) {
                    onRing = true;
                }
            }
            if (onRing) {
                vertex.value.isBridgeNode = true;
                ringMembers.add(vertex.id);
            } else {
                vertex.value.isBridge = true;
                ringMembers.add(vertex.id);
            }
        }
        
        let ring = new Ring([...ringMembers]);
        this.addRing(ring);
        ring.isBridged = true;
        ring.neighbours = [...neighbours];
        for (var i = 0; i < ringIds.length; i++) {
            ring.rings.push(this.getRing(ringIds[i]).clone());
        }
        for (var i = 0; i < ring.members.length; i++) {
            this.graph.vertices[ring.members[i]].value.bridgedRing = ring.id;
        }
        
        
        for (var i = 0; i < insideRing.length; i++) {
            let vertex = this.graph.vertices[insideRing[i]];
            vertex.value.rings = Array();
        }
        
        for (let id of ringMembers) {
            let vertex = this.graph.vertices[id];
            vertex.value.rings = ArrayHelper.removeAll(vertex.value.rings, ringIds);
            vertex.value.rings.push(ring.id);
        }
        
        for (var i = 0; i < ringIds.length; i++) {
            for (var j = i + 1; j < ringIds.length; j++) {
                this.removeRingConnectionsBetween(ringIds[i], ringIds[j]);
            }
        }
        
        for (let id of neighbours) {
            let connections = this.getRingConnections(id, ringIds);
            for (var j = 0; j < connections.length; j++) {
                this.getRingConnection(connections[j]).updateOther(ring.id, id);
            }
            this.getRing(id).neighbours.push(ring.id);
        }
        return ring;
    }
    
    areVerticesInSameRing(vertexA, vertexB) {
        
        
        for (var i = 0; i < vertexA.value.rings.length; i++) {
            for (var j = 0; j < vertexB.value.rings.length; j++) {
                if (vertexA.value.rings[i] === vertexB.value.rings[j]) {
                    return true;
                }
            }
        }
        return false;
    }
    
    getCommonRings(vertexA, vertexB) {
        let commonRings = Array();
        for (var i = 0; i < vertexA.value.rings.length; i++) {
            for (var j = 0; j < vertexB.value.rings.length; j++) {
                if (vertexA.value.rings[i] == vertexB.value.rings[j]) {
                    commonRings.push(vertexA.value.rings[i]);
                }
            }
        }
        return commonRings;
    }
    
    getLargestOrAromaticCommonRing(vertexA, vertexB) {
        let commonRings = this.getCommonRings(vertexA, vertexB);
        let maxSize = 0;
        let largestCommonRing = null;
        for (var i = 0; i < commonRings.length; i++) {
            let ring = this.getRing(commonRings[i]);
            let size = ring.getSize();
            if (ring.isBenzeneLike(this.graph.vertices)) {
                return ring;
            } else if (size > maxSize) {
                maxSize = size;
                largestCommonRing = ring;
            }
        }
        return largestCommonRing;
    }
    
    getVerticesAt(position, radius, excludeVertexId) {
        let locals = Array();
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let vertex = this.graph.vertices[i];
            if (vertex.id === excludeVertexId || !vertex.positioned) {
                continue;
            }
            let distance = position.distanceSq(vertex.position);
            if (distance <= radius * radius) {
                locals.push(vertex.id);
            }
        }
        return locals;
    }
    
    getClosestVertex(vertex) {
        let minDist = 99999;
        let minVertex = null;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let v = this.graph.vertices[i];
            if (v.id === vertex.id) {
                continue;
            }
            let distSq = vertex.position.distanceSq(v.position);
            if (distSq < minDist) {
                minDist = distSq;
                minVertex = v;
            }
        }
        return minVertex;
    }
    
    addRing(ring) {
        ring.id = this.ringIdCounter++;
        this.rings.push(ring);
        return ring.id;
    }
    
    removeRing(ringId) {
        this.rings = this.rings.filter(function (item) {
            return item.id !== ringId;
        });
        
        this.ringConnections = this.ringConnections.filter(function (item) {
            return item.firstRingId !== ringId && item.secondRingId !== ringId;
        });
        
        for (var i = 0; i < this.rings.length; i++) {
            let r = this.rings[i];
            r.neighbours = r.neighbours.filter(function (item) {
                return item !== ringId;
            });
        }
    }
    
    getRing(ringId) {
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].id == ringId) {
                return this.rings[i];
            }
        }
    }
    
    addRingConnection(ringConnection) {
        ringConnection.id = this.ringConnectionIdCounter++;
        this.ringConnections.push(ringConnection);
        return ringConnection.id;
    }
    
    removeRingConnection(ringConnectionId) {
        this.ringConnections = this.ringConnections.filter(function (item) {
            return item.id !== ringConnectionId;
        });
    }
    
    removeRingConnectionsBetween(vertexIdA, vertexIdB) {
        let toRemove = Array();
        for (var i = 0; i < this.ringConnections.length; i++) {
            let ringConnection = this.ringConnections[i];
            if (ringConnection.firstRingId === vertexIdA && ringConnection.secondRingId === vertexIdB ||
                ringConnection.firstRingId === vertexIdB && ringConnection.secondRingId === vertexIdA) {
                toRemove.push(ringConnection.id);
            }
        }
        for (var i = 0; i < toRemove.length; i++) {
            this.removeRingConnection(toRemove[i]);
        }
    }
    
    getRingConnection(id) {
        for (var i = 0; i < this.ringConnections.length; i++) {
            if (this.ringConnections[i].id == id) {
                return this.ringConnections[i];
            }
        }
    }
    
    getRingConnections(ringId, ringIds) {
        let ringConnections = Array();
        for (var i = 0; i < this.ringConnections.length; i++) {
            let rc = this.ringConnections[i];
            for (var j = 0; j < ringIds.length; j++) {
                let id = ringIds[j];
                if (rc.firstRingId === ringId && rc.secondRingId === id ||
                    rc.firstRingId === id && rc.secondRingId === ringId) {
                    ringConnections.push(rc.id);
                }
            }
        }
        return ringConnections;
    }
    
    getOverlapScore() {
        let total = 0.0;
        let overlapScores = new Float32Array(this.graph.vertices.length);
        for (var i = 0; i < this.graph.vertices.length; i++) {
            overlapScores[i] = 0;
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            var j = this.graph.vertices.length;
            while (--j > i) {
                let a = this.graph.vertices[i];
                let b = this.graph.vertices[j];
                if (!a.value.isDrawn || !b.value.isDrawn) {
                    continue;
                }
                let dist = Vector2.subtract(a.position, b.position).lengthSq();
                if (dist < this.opts.bondLengthSq) {
                    let weighted = (this.opts.bondLength - Math.sqrt(dist)) / this.opts.bondLength;
                    total += weighted;
                    overlapScores[i] += weighted;
                    overlapScores[j] += weighted;
                }
            }
        }
        let sortable = Array();
        for (var i = 0; i < this.graph.vertices.length; i++) {
            sortable.push({
                id: i,
                score: overlapScores[i]
            });
        }
        sortable.sort(function (a, b) {
            return b.score - a.score;
        });
        return {
            total: total,
            scores: sortable,
            vertexScores: overlapScores
        };
    }
    
    chooseSide(vertexA, vertexB, sides) {
        
        
        let an = vertexA.getNeighbours(vertexB.id);
        let bn = vertexB.getNeighbours(vertexA.id);
        let anCount = an.length;
        let bnCount = bn.length;
        
        let tn = ArrayHelper.merge(an, bn);
        
        let sideCount = [0, 0];
        for (var i = 0; i < tn.length; i++) {
            let v = this.graph.vertices[tn[i]].position;
            if (v.sameSideAs(vertexA.position, vertexB.position, sides[0])) {
                sideCount[0]++;
            } else {
                sideCount[1]++;
            }
        }
        
        
        let totalSideCount = [0, 0];
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let v = this.graph.vertices[i].position;
            if (v.sameSideAs(vertexA.position, vertexB.position, sides[0])) {
                totalSideCount[0]++;
            } else {
                totalSideCount[1]++;
            }
        }
        return {
            totalSideCount: totalSideCount,
            totalPosition: totalSideCount[0] > totalSideCount[1] ? 0 : 1,
            sideCount: sideCount,
            position: sideCount[0] > sideCount[1] ? 0 : 1,
            anCount: anCount,
            bnCount: bnCount
        };
    }
    
    setRingCenter(ring) {
        let ringSize = ring.getSize();
        let total = new Vector2(0, 0);
        for (var i = 0; i < ringSize; i++) {
            total.add(this.graph.vertices[ring.members[i]].position);
        }
        ring.center = total.divide(ringSize);
    }
    
    getSubringCenter(ring, vertex) {
        let rings = vertex.value.originalRings;
        let center = ring.center;
        let smallest = Number.MAX_VALUE;
        
        for (var i = 0; i < rings.length; i++) {
            for (var j = 0; j < ring.rings.length; j++) {
                if (rings[i] === ring.rings[j].id) {
                    if (ring.rings[j].getSize() < smallest) {
                        center = ring.rings[j].center;
                        smallest = ring.rings[j].getSize();
                    }
                }
            }
        }
        return center;
    }
    
    drawEdges(debug) {
        let that = this;
        let drawn = Array(this.graph.edges.length);
        drawn.fill(false);
        this.graph.traverseBF(0, function (vertex) {
            let edges = that.graph.getEdges(vertex.id);
            for (var i = 0; i < edges.length; i++) {
                let edgeId = edges[i];
                if (!drawn[edgeId]) {
                    drawn[edgeId] = true;
                    that.drawEdge(edgeId, debug);
                }
            }
        });
        
        if (!this.bridgedRing) {
            for (var i = 0; i < this.rings.length; i++) {
                let ring = this.rings[i];
                if (this.isRingAromatic(ring)) {
                    this.canvasWrapper.drawAromaticityRing(ring);
                }
            }
        }
    }
    
    drawEdge(edgeId, debug) {
        let that = this;
        let edge = this.graph.edges[edgeId];
        let vertexA = this.graph.vertices[edge.sourceId];
        let vertexB = this.graph.vertices[edge.targetId];
        let elementA = vertexA.value.element;
        let elementB = vertexB.value.element;
        if ((!vertexA.value.isDrawn || !vertexB.value.isDrawn) && this.opts.atomVisualization === 'default') {
            return;
        }
        let a = vertexA.position;
        let b = vertexB.position;
        let normals = this.getEdgeNormals(edge);
        
        let sides = ArrayHelper.clone(normals);
        sides[0].multiplyScalar(10).add(a);
        sides[1].multiplyScalar(10).add(a);
        if (edge.bondType === '=' || this.getRingbondType(vertexA, vertexB) === '=' ||
            (edge.isPartOfAromaticRing && this.bridgedRing)) {
            
            let inRing = this.areVerticesInSameRing(vertexA, vertexB);
            let s = this.chooseSide(vertexA, vertexB, sides);
            if (inRing) {
                
                
                
                let lcr = this.getLargestOrAromaticCommonRing(vertexA, vertexB);
                let center = lcr.center;
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                
                let line = null;
                if (center.sameSideAs(vertexA.position, vertexB.position, Vector2.add(a, normals[0]))) {
                    line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                } else {
                    line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                }
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                
                if (edge.isPartOfAromaticRing) {
                    this.canvasWrapper.drawLine(line, true);
                } else {
                    this.canvasWrapper.drawLine(line);
                }
                
                this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else if (edge.center || vertexA.isTerminal() && vertexB.isTerminal()) {
                normals[0].multiplyScalar(that.opts.halfBondSpacing);
                normals[1].multiplyScalar(that.opts.halfBondSpacing);
                let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                let lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                this.canvasWrapper.drawLine(lineA);
                this.canvasWrapper.drawLine(lineB);
            } else if (s.anCount == 0 && s.bnCount > 1 || s.bnCount == 0 && s.anCount > 1) {
                
                
                normals[0].multiplyScalar(that.opts.halfBondSpacing);
                normals[1].multiplyScalar(that.opts.halfBondSpacing);
                let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                let lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                this.canvasWrapper.drawLine(lineA);
                this.canvasWrapper.drawLine(lineB);
            } else if (s.sideCount[0] > s.sideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                let line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else if (s.sideCount[0] < s.sideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                let line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else if (s.totalSideCount[0] > s.totalSideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                let line = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else if (s.totalSideCount[0] <= s.totalSideCount[1]) {
                normals[0].multiplyScalar(that.opts.bondSpacing);
                normals[1].multiplyScalar(that.opts.bondSpacing);
                let line = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
                line.shorten(this.opts.bondLength - this.opts.shortBondLength * this.opts.bondLength);
                this.canvasWrapper.drawLine(line);
                this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB));
            } else {
            }
        } else if (edge.bondType === '#') {
            normals[0].multiplyScalar(that.opts.bondSpacing / 1.5);
            normals[1].multiplyScalar(that.opts.bondSpacing / 1.5);
            let lineA = new Line(Vector2.add(a, normals[0]), Vector2.add(b, normals[0]), elementA, elementB);
            let lineB = new Line(Vector2.add(a, normals[1]), Vector2.add(b, normals[1]), elementA, elementB);
            this.canvasWrapper.drawLine(lineA);
            this.canvasWrapper.drawLine(lineB);
            this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB));
        } else if (edge.bondType === '.') {
            
        } else {
            let isChiralCenterA = vertexA.value.isStereoCenter;
            let isChiralCenterB = vertexB.value.isStereoCenter;
            if (edge.wedge === 'up') {
                this.canvasWrapper.drawWedge(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            } else if (edge.wedge === 'down') {
                this.canvasWrapper.drawDashedWedge(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            } else {
                this.canvasWrapper.drawLine(new Line(a, b, elementA, elementB, isChiralCenterA, isChiralCenterB));
            }
        }
        if (debug) {
            let midpoint = Vector2.midpoint(a, b);
            this.canvasWrapper.drawDebugText(midpoint.x, midpoint.y, 'e: ' + edgeId);
        }
    }
    
    drawVertices(debug) {
        var i = this.graph.vertices.length;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let vertex = this.graph.vertices[i];
            let atom = vertex.value;
            let charge = 0;
            let isotope = 0;
            let bondCount = vertex.value.bondCount;
            let element = atom.element;
            let hydrogens = Atom.maxBonds[element] - bondCount;
            let dir = vertex.getTextDirection(this.graph.vertices);
            let isTerminal = this.opts.terminalCarbons || element !== 'C' || atom.hasAttachedPseudoElements ? vertex.isTerminal() : false;
            let isCarbon = atom.element === 'C';
            
            
            if (atom.element === 'N' && atom.isPartOfAromaticRing) {
                hydrogens = 0;
            }
            if (atom.bracket) {
                hydrogens = atom.bracket.hcount;
                charge = atom.bracket.charge;
                isotope = atom.bracket.isotope;
            }
            if (this.opts.atomVisualization === 'allballs') {
                this.canvasWrapper.drawBall(vertex.position.x, vertex.position.y, element);
            } else if ((atom.isDrawn && (!isCarbon || atom.drawExplicit || isTerminal || atom.hasAttachedPseudoElements)) || this.graph.vertices.length === 1) {
                if (this.opts.atomVisualization === 'default') {
                    this.canvasWrapper.drawText(vertex.position.x, vertex.position.y,
                        element, hydrogens, dir, isTerminal, charge, isotope, this.graph.vertices.length, atom.getAttachedPseudoElements());
                } else if (this.opts.atomVisualization === 'balls') {
                    this.canvasWrapper.drawBall(vertex.position.x, vertex.position.y, element);
                }
            } else if (vertex.getNeighbourCount() === 2 && vertex.forcePositioned == true) {
                
                let a = this.graph.vertices[vertex.neighbours[0]].position;
                let b = this.graph.vertices[vertex.neighbours[1]].position;
                let angle = Vector2.threePointangle(vertex.position, a, b);
                if (Math.abs(Math.PI - angle) < 0.1) {
                    this.canvasWrapper.drawPoint(vertex.position.x, vertex.position.y, element);
                }
            }
            if (debug) {
                let value = 'v: ' + vertex.id + ' ' + ArrayHelper.print(atom.ringbonds);
                this.canvasWrapper.drawDebugText(vertex.position.x, vertex.position.y, value);
            } else {
                
            }
        }
        
        if (this.opts.debug) {
            for (var i = 0; i < this.rings.length; i++) {
                let center = this.rings[i].center;
                this.canvasWrapper.drawDebugPoint(center.x, center.y, 'r: ' + this.rings[i].id);
            }
        }
    }
    
    position() {
        let startVertex = null;
        
        
        
        for (var i = 0; i < this.graph.vertices.length; i++) {
            if (this.graph.vertices[i].value.bridgedRing !== null) {
                startVertex = this.graph.vertices[i];
                break;
            }
        }
        for (var i = 0; i < this.rings.length; i++) {
            if (this.rings[i].isBridged) {
                startVertex = this.graph.vertices[this.rings[i].members[0]];
            }
        }
        if (this.rings.length > 0 && startVertex === null) {
            startVertex = this.graph.vertices[this.rings[0].members[0]];
        }
        if (startVertex === null) {
            startVertex = this.graph.vertices[0];
        }
        this.createNextBond(startVertex, null, 0.0);
    }
    
    backupRingInformation() {
        this.originalRings = Array();
        this.originalRingConnections = Array();
        for (var i = 0; i < this.rings.length; i++) {
            this.originalRings.push(this.rings[i]);
        }
        for (var i = 0; i < this.ringConnections.length; i++) {
            this.originalRingConnections.push(this.ringConnections[i]);
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            this.graph.vertices[i].value.backupRings();
        }
    }
    
    restoreRingInformation() {
        
        let bridgedRings = this.getBridgedRings();
        this.rings = Array();
        this.ringConnections = Array();
        for (var i = 0; i < bridgedRings.length; i++) {
            let bridgedRing = bridgedRings[i];
            for (var j = 0; j < bridgedRing.rings.length; j++) {
                let ring = bridgedRing.rings[j];
                this.originalRings[ring.id].center = ring.center;
            }
        }
        for (var i = 0; i < this.originalRings.length; i++) {
            this.rings.push(this.originalRings[i]);
        }
        for (var i = 0; i < this.originalRingConnections.length; i++) {
            this.ringConnections.push(this.originalRingConnections[i]);
        }
        for (var i = 0; i < this.graph.vertices.length; i++) {
            this.graph.vertices[i].value.restoreRings();
        }
    }
    
    
    createRing(ring, center = null, startVertex = null, previousVertex = null) {
        if (ring.positioned) {
            return;
        }
        center = center ? center : new Vector2(0, 0);
        let orderedNeighbours = ring.getOrderedNeighbours(this.ringConnections);
        let startingAngle = startVertex ? Vector2.subtract(startVertex.position, center).angle() : 0;
        let radius = MathHelper.polyCircumradius(this.opts.bondLength, ring.getSize());
        let angle = MathHelper.centralAngle(ring.getSize());
        ring.centralAngle = angle;
        let a = startingAngle;
        let that = this;
        let startVertexId = (startVertex) ? startVertex.id : null;
        if (ring.members.indexOf(startVertexId) === -1) {
            if (startVertex) {
                startVertex.positioned = false;
            }
            startVertexId = ring.members[0];
        }
        
        
        if (ring.isBridged) {
            this.graph.kkLayout(ring.members.slice(), center, startVertex.id, ring, this.opts.bondLength,
                this.opts.kkThreshold, this.opts.kkInnerThreshold, this.opts.kkMaxIteration,
                this.opts.kkMaxInnerIteration, this.opts.kkMaxEnergy);
            ring.positioned = true;
            
            this.setRingCenter(ring);
            center = ring.center;
            
            for (var i = 0; i < ring.rings.length; i++) {
                this.setRingCenter(ring.rings[i]);
            }
        } else {
            ring.eachMember(this.graph.vertices, function (v) {
                let vertex = that.graph.vertices[v];
                if (!vertex.positioned) {
                    vertex.setPosition(center.x + Math.cos(a) * radius, center.y + Math.sin(a) * radius);
                }
                a += angle;
                if (!ring.isBridged || ring.rings.length < 3) {
                    vertex.angle = a;
                    vertex.positioned = true;
                }
            }, startVertexId, (previousVertex) ? previousVertex.id : null);
        }
        ring.positioned = true;
        ring.center = center;
        
        for (var i = 0; i < orderedNeighbours.length; i++) {
            let neighbour = this.getRing(orderedNeighbours[i].neighbour);
            if (neighbour.positioned) {
                continue;
            }
            let vertices = RingConnection.getVertices(this.ringConnections, ring.id, neighbour.id);
            if (vertices.length === 2) {
                
                ring.isFused = true;
                neighbour.isFused = true;
                let vertexA = this.graph.vertices[vertices[0]];
                let vertexB = this.graph.vertices[vertices[1]];
                
                let midpoint = Vector2.midpoint(vertexA.position, vertexB.position);
                
                let normals = Vector2.normals(vertexA.position, vertexB.position);
                
                normals[0].normalize();
                normals[1].normalize();
                
                let r = MathHelper.polyCircumradius(this.opts.bondLength, neighbour.getSize());
                let apothem = MathHelper.apothem(r, neighbour.getSize());
                normals[0].multiplyScalar(apothem).add(midpoint);
                normals[1].multiplyScalar(apothem).add(midpoint);
                
                
                let nextCenter = normals[0];
                if (Vector2.subtract(center, normals[1]).lengthSq() > Vector2.subtract(center, normals[0]).lengthSq()) {
                    nextCenter = normals[1];
                }
                
                let posA = Vector2.subtract(vertexA.position, nextCenter);
                let posB = Vector2.subtract(vertexB.position, nextCenter);
                if (posA.clockwise(posB) === -1) {
                    if (!neighbour.positioned) {
                        this.createRing(neighbour, nextCenter, vertexA, vertexB);
                    }
                } else {
                    if (!neighbour.positioned) {
                        this.createRing(neighbour, nextCenter, vertexB, vertexA);
                    }
                }
            } else if (vertices.length === 1) {
                
                ring.isSpiro = true;
                neighbour.isSpiro = true;
                let vertexA = this.graph.vertices[vertices[0]];
                
                let nextCenter = Vector2.subtract(center, vertexA.position);
                nextCenter.invert();
                nextCenter.normalize();
                
                let r = MathHelper.polyCircumradius(this.opts.bondLength, neighbour.getSize());
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertexA.position);
                if (!neighbour.positioned) {
                    this.createRing(neighbour, nextCenter, vertexA);
                }
            }
        }
        
        for (var i = 0; i < ring.members.length; i++) {
            let ringMember = this.graph.vertices[ring.members[i]];
            let ringMemberNeighbours = ringMember.neighbours;
            
            for (var j = 0; j < ringMemberNeighbours.length; j++) {
                let v = this.graph.vertices[ringMemberNeighbours[j]];
                if (v.positioned) {
                    continue;
                }
                v.value.isConnectedToRing = true;
                this.createNextBond(v, ringMember, 0.0);
            }
        }
    }
    
    rotateSubtree(vertexId, parentVertexId, angle, center) {
        let that = this;
        this.graph.traverseTree(vertexId, parentVertexId, function (vertex) {
            vertex.position.rotateAround(angle, center);
            for (var i = 0; i < vertex.value.anchoredRings.length; i++) {
                let ring = that.rings[vertex.value.anchoredRings[i]];
                if (ring) {
                    ring.center.rotateAround(angle, center);
                }
            }
        });
    }
    
    getSubtreeOverlapScore(vertexId, parentVertexId, vertexOverlapScores) {
        let that = this;
        let score = 0;
        let center = new Vector2(0, 0);
        let count = 0;
        this.graph.traverseTree(vertexId, parentVertexId, function (vertex) {
            if (!vertex.value.isDrawn) {
                return;
            }
            let s = vertexOverlapScores[vertex.id];
            if (s > that.opts.overlapSensitivity) {
                score += s;
                count++;
            }
            let position = that.graph.vertices[vertex.id].position.clone();
            position.multiplyScalar(s)
            center.add(position);
        });
        center.divide(score);
        return {
            value: score / count,
            center: center
        };
    }
    
    getCurrentCenterOfMass() {
        let total = new Vector2(0, 0);
        let count = 0;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let vertex = this.graph.vertices[i];
            if (vertex.positioned) {
                total.add(vertex.position);
                count++;
            }
        }
        return total.divide(count);
    }
    
    getCurrentCenterOfMassInNeigbourhood(vec, r = this.opts.bondLength * 2.0) {
        let total = new Vector2(0, 0);
        let count = 0;
        let rSq = r * r;
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let vertex = this.graph.vertices[i];
            if (vertex.positioned && vec.distanceSq(vertex.position) < rSq) {
                total.add(vertex.position);
                count++;
            }
        }
        return total.divide(count);
    }
    
    resolvePrimaryOverlaps() {
        let overlaps = Array();
        let done = Array(this.graph.vertices.length);
        
        
        for (var i = 0; i < this.rings.length; i++) {
            let ring = this.rings[i];
            for (var j = 0; j < ring.members.length; j++) {
                let vertex = this.graph.vertices[ring.members[j]];
                if (done[vertex.id]) {
                    continue;
                }
                done[vertex.id] = true;
                let nonRingNeighbours = this.getNonRingNeighbours(vertex.id);
                if (nonRingNeighbours.length > 1) {
                    
                    let rings = Array();
                    for (var k = 0; k < vertex.value.rings.length; k++) {
                        rings.push(vertex.value.rings[k]);
                    }
                    overlaps.push({
                        common: vertex,
                        rings: rings,
                        vertices: nonRingNeighbours
                    });
                } else if (nonRingNeighbours.length === 1 && vertex.value.rings.length === 2) {
                    
                    
                    let rings = Array();
                    for (var k = 0; k < vertex.value.rings.length; k++) {
                        rings.push(vertex.value.rings[k]);
                    }
                    overlaps.push({
                        common: vertex,
                        rings: rings,
                        vertices: nonRingNeighbours
                    });
                }
            }
        }
        for (var i = 0; i < overlaps.length; i++) {
            let overlap = overlaps[i];
            if (overlap.vertices.length === 2) {
                let a = overlap.vertices[0];
                let b = overlap.vertices[1];
                if (!a.value.isDrawn || !b.value.isDrawn) {
                    continue;
                }
                let angle = (2 * Math.PI - this.getRing(overlap.rings[0]).getAngle()) / 6.0;
                this.rotateSubtree(a.id, overlap.common.id, angle, overlap.common.position);
                this.rotateSubtree(b.id, overlap.common.id, -angle, overlap.common.position);
                
                let overlapScore = this.getOverlapScore();
                let subTreeOverlapA = this.getSubtreeOverlapScore(a.id, overlap.common.id, overlapScore.vertexScores);
                let subTreeOverlapB = this.getSubtreeOverlapScore(b.id, overlap.common.id, overlapScore.vertexScores);
                let total = subTreeOverlapA.value + subTreeOverlapB.value;
                this.rotateSubtree(a.id, overlap.common.id, -2.0 * angle, overlap.common.position);
                this.rotateSubtree(b.id, overlap.common.id, 2.0 * angle, overlap.common.position);
                overlapScore = this.getOverlapScore();
                subTreeOverlapA = this.getSubtreeOverlapScore(a.id, overlap.common.id, overlapScore.vertexScores);
                subTreeOverlapB = this.getSubtreeOverlapScore(b.id, overlap.common.id, overlapScore.vertexScores);
                if (subTreeOverlapA.value + subTreeOverlapB.value > total) {
                    this.rotateSubtree(a.id, overlap.common.id, 2.0 * angle, overlap.common.position);
                    this.rotateSubtree(b.id, overlap.common.id, -2.0 * angle, overlap.common.position);
                }
            } else if (overlap.vertices.length === 1) {
                if (overlap.rings.length === 2) {
                    
                    
                }
            }
        }
    }
    
    resolveSecondaryOverlaps(scores) {
        for (var i = 0; i < scores.length; i++) {
            if (scores[i].score > this.opts.overlapSensitivity) {
                let vertex = this.graph.vertices[scores[i].id];
                if (vertex.isTerminal()) {
                    let closest = this.getClosestVertex(vertex);
                    if (closest) {
                        
                        
                        let closestPosition = null;
                        if (closest.isTerminal()) {
                            closestPosition = closest.id === 0 ? this.graph.vertices[1].position : closest.previousPosition
                        } else {
                            closestPosition = closest.id === 0 ? this.graph.vertices[1].position : closest.position
                        }
                        let vertexPreviousPosition = vertex.id === 0 ? this.graph.vertices[1].position : vertex.previousPosition;
                        vertex.position.rotateAwayFrom(closestPosition, vertexPreviousPosition, MathHelper.toRad(20));
                    }
                }
            }
        }
    }
    
    getLastVertexWithAngle(vertexId) {
        let angle = 0;
        let vertex = null;
        while (!angle && vertexId) {
            vertex = this.graph.vertices[vertexId];
            angle = vertex.angle;
            vertexId = vertex.parentVertexId;
        }
        return vertex;
    }
    
    createNextBond(vertex, previousVertex = null, angle = 0.0, originShortest = false, skipPositioning = false) {
        if (vertex.positioned && !skipPositioning) {
            return;
        }
        
        let doubleBondConfigSet = false;
        
        if (previousVertex) {
            let edge = this.graph.getEdge(vertex.id, previousVertex.id);
            if ((edge.bondType === '/' || edge.bondType === '\\') && ++this.doubleBondConfigCount % 2 === 1) {
                if (this.doubleBondConfig === null) {
                    this.doubleBondConfig = edge.bondType;
                    doubleBondConfigSet = true;
                    
                    
                    if (previousVertex.parentVertexId === null && vertex.value.branchBond) {
                        if (this.doubleBondConfig === '/') {
                            this.doubleBondConfig = '\\';
                        } else if (this.doubleBondConfig === '\\') {
                            this.doubleBondConfig = '/';
                        }
                    }
                }
            }
        }
        
        
        
        if (!skipPositioning) {
            if (!previousVertex) {
                
                
                
                let dummy = new Vector2(this.opts.bondLength, 0);
                dummy.rotate(MathHelper.toRad(-60));
                vertex.previousPosition = dummy;
                vertex.setPosition(this.opts.bondLength, 0);
                vertex.angle = MathHelper.toRad(-60);
                
                if (vertex.value.bridgedRing === null) {
                    vertex.positioned = true;
                }
            } else if (previousVertex.value.rings.length > 0) {
                let neighbours = previousVertex.neighbours;
                let joinedVertex = null;
                let pos = new Vector2(0.0, 0.0);
                if (previousVertex.value.bridgedRing === null && previousVertex.value.rings.length > 1) {
                    for (var i = 0; i < neighbours.length; i++) {
                        let neighbour = this.graph.vertices[neighbours[i]];
                        if (ArrayHelper.containsAll(neighbour.value.rings, previousVertex.value.rings)) {
                            joinedVertex = neighbour;
                            break;
                        }
                    }
                }
                if (joinedVertex === null) {
                    for (var i = 0; i < neighbours.length; i++) {
                        let v = this.graph.vertices[neighbours[i]];
                        if (v.positioned && this.areVerticesInSameRing(v, previousVertex)) {
                            pos.add(Vector2.subtract(v.position, previousVertex.position));
                        }
                    }
                    pos.invert().normalize().multiplyScalar(this.opts.bondLength).add(previousVertex.position);
                } else {
                    pos = joinedVertex.position.clone().rotateAround(Math.PI, previousVertex.position);
                }
                vertex.previousPosition = previousVertex.position;
                vertex.setPositionFromVector(pos);
                vertex.positioned = true;
            } else {
                
                
                let v = new Vector2(this.opts.bondLength, 0);
                v.rotate(angle);
                v.add(previousVertex.position);
                vertex.setPositionFromVector(v);
                vertex.previousPosition = previousVertex.position;
                vertex.positioned = true;
            }
        }
        
        
        if (vertex.value.bridgedRing !== null) {
            let nextRing = this.getRing(vertex.value.bridgedRing);
            if (!nextRing.positioned) {
                let nextCenter = Vector2.subtract(vertex.previousPosition, vertex.position);
                nextCenter.invert();
                nextCenter.normalize();
                let r = MathHelper.polyCircumradius(this.opts.bondLength, nextRing.members.length);
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertex.position);
                this.createRing(nextRing, nextCenter, vertex);
            }
        } else if (vertex.value.rings.length > 0) {
            let nextRing = this.getRing(vertex.value.rings[0]);
            if (!nextRing.positioned) {
                let nextCenter = Vector2.subtract(vertex.previousPosition, vertex.position);
                nextCenter.invert();
                nextCenter.normalize();
                let r = MathHelper.polyCircumradius(this.opts.bondLength, nextRing.getSize());
                nextCenter.multiplyScalar(r);
                nextCenter.add(vertex.position);
                this.createRing(nextRing, nextCenter, vertex);
            }
        } else {
            
            let isStereoCenter = vertex.value.isStereoCenter;
            let tmpNeighbours = vertex.getNeighbours();
            let neighbours = Array();
            
            for (var i = 0; i < tmpNeighbours.length; i++) {
                if (this.graph.vertices[tmpNeighbours[i]].value.isDrawn) {
                    neighbours.push(tmpNeighbours[i]);
                }
            }
            
            if (previousVertex) {
                neighbours = ArrayHelper.remove(neighbours, previousVertex.id);
            }
            let previousAngle = vertex.getAngle();
            if (neighbours.length === 1) {
                let nextVertex = this.graph.vertices[neighbours[0]];
                
                
                if ((vertex.value.bondType === '#' || (previousVertex && previousVertex.value.bondType === '#')) ||
                    vertex.value.bondType === '=' && previousVertex && previousVertex.value.rings.length === 0 &&
                    previousVertex.value.bondType === '=' && vertex.value.branchBond !== '-') {
                    vertex.value.drawExplicit = false;
                    if (previousVertex) {
                        let straightEdge1 = this.graph.getEdge(vertex.id, previousVertex.id);
                        straightEdge1.center = true;
                    }
                    let straightEdge2 = this.graph.getEdge(vertex.id, nextVertex.id);
                    straightEdge2.center = true;
                    if (vertex.value.bondType === '#' || previousVertex && previousVertex.value.bondType === '#') {
                        nextVertex.angle = 0.0;
                    }
                    nextVertex.drawExplicit = true;
                    this.createNextBond(nextVertex, vertex, previousAngle + nextVertex.angle);
                } else if (previousVertex && previousVertex.value.rings.length > 0) {
                    
                    let proposedAngleA = MathHelper.toRad(60);
                    let proposedAngleB = -proposedAngleA;
                    let proposedVectorA = new Vector2(this.opts.bondLength, 0);
                    let proposedVectorB = new Vector2(this.opts.bondLength, 0);
                    proposedVectorA.rotate(proposedAngleA).add(vertex.position);
                    proposedVectorB.rotate(proposedAngleB).add(vertex.position);
                    
                    let centerOfMass = this.getCurrentCenterOfMass();
                    let distanceA = proposedVectorA.distanceSq(centerOfMass);
                    let distanceB = proposedVectorB.distanceSq(centerOfMass);
                    nextVertex.angle = distanceA < distanceB ? proposedAngleB : proposedAngleA;
                    this.createNextBond(nextVertex, vertex, previousAngle + nextVertex.angle);
                } else {
                    let a = vertex.angle;
                    
                    
                    
                    if (previousVertex && previousVertex.neighbours.length > 3) {
                        if (a > 0) {
                            a = Math.min(1.0472, a);
                        } else if (a < 0) {
                            a = Math.max(-1.0472, a);
                        } else {
                            a = 1.0472;
                        }
                    } else if (!a) {
                        let v = this.getLastVertexWithAngle(vertex.id);
                        a = v.angle;
                        if (!a) {
                            a = 1.0472;
                        }
                    }
                    
                    if (previousVertex && !doubleBondConfigSet) {
                        let bondType = this.graph.getEdge(vertex.id, nextVertex.id).bondType;
                        if (bondType === '/') {
                            if (this.doubleBondConfig === '/') {
                                
                            } else if (this.doubleBondConfig === '\\') {
                                a = -a;
                            }
                            this.doubleBondConfig = null;
                        } else if (bondType === '\\') {
                            if (this.doubleBondConfig === '/') {
                                a = -a;
                            } else if (this.doubleBondConfig === '\\') {
                                
                            }
                            this.doubleBondConfig = null;
                        }
                    }
                    if (originShortest) {
                        nextVertex.angle = a;
                    } else {
                        nextVertex.angle = -a;
                    }
                    this.createNextBond(nextVertex, vertex, previousAngle + nextVertex.angle);
                }
            } else if (neighbours.length === 2) {
                
                let a = vertex.angle;
                if (!a) {
                    a = 1.0472;
                }
                
                let subTreeDepthA = this.graph.getTreeDepth(neighbours[0], vertex.id);
                let subTreeDepthB = this.graph.getTreeDepth(neighbours[1], vertex.id);
                let l = this.graph.vertices[neighbours[0]];
                let r = this.graph.vertices[neighbours[1]];
                l.value.subtreeDepth = subTreeDepthA;
                r.value.subtreeDepth = subTreeDepthB;
                
                
                let subTreeDepthC = this.graph.getTreeDepth(previousVertex ? previousVertex.id : null, vertex.id);
                if (previousVertex) {
                    previousVertex.value.subtreeDepth = subTreeDepthC;
                }
                let cis = 0;
                let trans = 1;
                
                if (r.value.element === 'C' && l.value.element !== 'C' && subTreeDepthB > 1 && subTreeDepthA < 5) {
                    cis = 1;
                    trans = 0;
                } else if (r.value.element !== 'C' && l.value.element === 'C' && subTreeDepthA > 1 && subTreeDepthB < 5) {
                    cis = 0;
                    trans = 1;
                } else if (subTreeDepthB > subTreeDepthA) {
                    cis = 1;
                    trans = 0;
                }
                let cisVertex = this.graph.vertices[neighbours[cis]];
                let transVertex = this.graph.vertices[neighbours[trans]];
                let edgeCis = this.graph.getEdge(vertex.id, cisVertex.id);
                let edgeTrans = this.graph.getEdge(vertex.id, transVertex.id);
                
                let originShortest = false;
                if (subTreeDepthC < subTreeDepthA && subTreeDepthC < subTreeDepthB) {
                    originShortest = true;
                }
                transVertex.angle = a;
                cisVertex.angle = -a;
                if (this.doubleBondConfig === '\\') {
                    if (transVertex.value.branchBond === '\\') {
                        transVertex.angle = -a;
                        cisVertex.angle = a;
                    }
                } else if (this.doubleBondConfig === '/') {
                    if (transVertex.value.branchBond === '/') {
                        transVertex.angle = -a;
                        cisVertex.angle = a;
                    }
                }
                this.createNextBond(transVertex, vertex, previousAngle + transVertex.angle, originShortest);
                this.createNextBond(cisVertex, vertex, previousAngle + cisVertex.angle, originShortest);
            } else if (neighbours.length === 3) {
                
                let d1 = this.graph.getTreeDepth(neighbours[0], vertex.id);
                let d2 = this.graph.getTreeDepth(neighbours[1], vertex.id);
                let d3 = this.graph.getTreeDepth(neighbours[2], vertex.id);
                let s = this.graph.vertices[neighbours[0]];
                let l = this.graph.vertices[neighbours[1]];
                let r = this.graph.vertices[neighbours[2]];
                s.value.subtreeDepth = d1;
                l.value.subtreeDepth = d2;
                r.value.subtreeDepth = d3;
                if (d2 > d1 && d2 > d3) {
                    s = this.graph.vertices[neighbours[1]];
                    l = this.graph.vertices[neighbours[0]];
                    r = this.graph.vertices[neighbours[2]];
                } else if (d3 > d1 && d3 > d2) {
                    s = this.graph.vertices[neighbours[2]];
                    l = this.graph.vertices[neighbours[0]];
                    r = this.graph.vertices[neighbours[1]];
                }
                
                
                if (previousVertex &&
                    previousVertex.value.rings.length < 1 &&
                    s.value.rings.length < 1 &&
                    l.value.rings.length < 1 &&
                    r.value.rings.length < 1 &&
                    this.graph.getTreeDepth(l.id, vertex.id) === 1 &&
                    this.graph.getTreeDepth(r.id, vertex.id) === 1 &&
                    this.graph.getTreeDepth(s.id, vertex.id) > 1) {
                    s.angle = -vertex.angle;
                    if (vertex.angle >= 0) {
                        l.angle = MathHelper.toRad(30);
                        r.angle = MathHelper.toRad(90);
                    } else {
                        l.angle = -MathHelper.toRad(30);
                        r.angle = -MathHelper.toRad(90);
                    }
                    this.createNextBond(s, vertex, previousAngle + s.angle);
                    this.createNextBond(l, vertex, previousAngle + l.angle);
                    this.createNextBond(r, vertex, previousAngle + r.angle);
                } else {
                    s.angle = 0.0;
                    l.angle = MathHelper.toRad(90);
                    r.angle = -MathHelper.toRad(90);
                    this.createNextBond(s, vertex, previousAngle + s.angle);
                    this.createNextBond(l, vertex, previousAngle + l.angle);
                    this.createNextBond(r, vertex, previousAngle + r.angle);
                }
            } else if (neighbours.length === 4) {
                
                let d1 = this.graph.getTreeDepth(neighbours[0], vertex.id);
                let d2 = this.graph.getTreeDepth(neighbours[1], vertex.id);
                let d3 = this.graph.getTreeDepth(neighbours[2], vertex.id);
                let d4 = this.graph.getTreeDepth(neighbours[3], vertex.id);
                let w = this.graph.vertices[neighbours[0]];
                let x = this.graph.vertices[neighbours[1]];
                let y = this.graph.vertices[neighbours[2]];
                let z = this.graph.vertices[neighbours[3]];
                w.value.subtreeDepth = d1;
                x.value.subtreeDepth = d2;
                y.value.subtreeDepth = d3;
                z.value.subtreeDepth = d4;
                if (d2 > d1 && d2 > d3 && d2 > d4) {
                    w = this.graph.vertices[neighbours[1]];
                    x = this.graph.vertices[neighbours[0]];
                    y = this.graph.vertices[neighbours[2]];
                    z = this.graph.vertices[neighbours[3]];
                } else if (d3 > d1 && d3 > d2 && d3 > d4) {
                    w = this.graph.vertices[neighbours[2]];
                    x = this.graph.vertices[neighbours[0]];
                    y = this.graph.vertices[neighbours[1]];
                    z = this.graph.vertices[neighbours[3]];
                } else if (d4 > d1 && d4 > d2 && d4 > d3) {
                    w = this.graph.vertices[neighbours[3]];
                    x = this.graph.vertices[neighbours[0]];
                    y = this.graph.vertices[neighbours[1]];
                    z = this.graph.vertices[neighbours[2]];
                }
                w.angle = -MathHelper.toRad(36);
                x.angle = MathHelper.toRad(36);
                y.angle = -MathHelper.toRad(108);
                z.angle = MathHelper.toRad(108);
                this.createNextBond(w, vertex, previousAngle + w.angle);
                this.createNextBond(x, vertex, previousAngle + x.angle);
                this.createNextBond(y, vertex, previousAngle + y.angle);
                this.createNextBond(z, vertex, previousAngle + z.angle);
            }
        }
    }
    
    getCommonRingbondNeighbour(vertex) {
        let neighbours = vertex.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            let neighbour = this.graph.vertices[neighbours[i]];
            if (ArrayHelper.containsAll(neighbour.value.rings, vertex.value.rings)) {
                return neighbour;
            }
        }
        return null;
    }
    
    isPointInRing(vec) {
        for (var i = 0; i < this.rings.length; i++) {
            let ring = this.rings[i];
            if (!ring.positioned) {
                continue;
            }
            let radius = MathHelper.polyCircumradius(this.opts.bondLength, ring.getSize());
            let radiusSq = radius * radius;
            if (vec.distanceSq(ring.center) < radiusSq) {
                return true;
            }
        }
        return false;
    }
    
    isEdgeInRing(edge) {
        let source = this.graph.vertices[edge.sourceId];
        let target = this.graph.vertices[edge.targetId];
        return this.areVerticesInSameRing(source, target);
    }
    
    isEdgeRotatable(edge) {
        let vertexA = this.graph.vertices[edge.sourceId];
        let vertexB = this.graph.vertices[edge.targetId];
        
        if (edge.bondType !== '-') {
            return false;
        }
        
        
        
        
        
        if (vertexA.isTerminal() || vertexB.isTerminal()) {
            return false;
        }
        
        if (vertexA.value.rings.length > 0 && vertexB.value.rings.length > 0 &&
            this.areVerticesInSameRing(vertexA, vertexB)) {
            return false;
        }
        return true;
    }
    
    isRingAromatic(ring) {
        for (var i = 0; i < ring.members.length; i++) {
            let vertex = this.graph.vertices[ring.members[i]];
            if (!vertex.value.isPartOfAromaticRing) {
                return false;
            }
        }
        return true;
    }
    
    getEdgeNormals(edge) {
        let v1 = this.graph.vertices[edge.sourceId].position;
        let v2 = this.graph.vertices[edge.targetId].position;
        
        let normals = Vector2.units(v1, v2);
        return normals;
    }
    
    getNonRingNeighbours(vertexId) {
        let nrneighbours = Array();
        let vertex = this.graph.vertices[vertexId];
        let neighbours = vertex.neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            let neighbour = this.graph.vertices[neighbours[i]];
            let nIntersections = ArrayHelper.intersection(vertex.value.rings, neighbour.value.rings).length;
            if (nIntersections === 0 && neighbour.value.isBridge == false) {
                nrneighbours.push(neighbour);
            }
        }
        return nrneighbours;
    }
    
    annotateStereochemistry() {
        let maxDepth = 10;
        
        for (var i = 0; i < this.graph.vertices.length; i++) {
            let vertex = this.graph.vertices[i];
            if (!vertex.value.isStereoCenter) {
                continue;
            }
            let neighbours = vertex.getNeighbours();
            let nNeighbours = neighbours.length;
            let priorities = Array(nNeighbours);
            for (var j = 0; j < nNeighbours; j++) {
                let visited = new Uint8Array(this.graph.vertices.length);
                let priority = Array(Array());
                visited[vertex.id] = 1;
                this.visitStereochemistry(neighbours[j], vertex.id, visited, priority, maxDepth, 0);
                
                for (var k = 0; k < priority.length; k++) {
                    priority[k].sort(function (a, b) {
                        return b - a
                    });
                }
                priorities[j] = [j, priority];
            }
            let maxLevels = 0;
            let maxEntries = 0;
            for (var j = 0; j < priorities.length; j++) {
                if (priorities[j][1].length > maxLevels) {
                    maxLevels = priorities[j][1].length;
                }
                for (var k = 0; k < priorities[j][1].length; k++) {
                    if (priorities[j][1][k].length > maxEntries) {
                        maxEntries = priorities[j][1][k].length;
                    }
                }
            }
            for (var j = 0; j < priorities.length; j++) {
                let diff = maxLevels - priorities[j][1].length;
                for (var k = 0; k < diff; k++) {
                    priorities[j][1].push([]);
                }
                
                priorities[j][1].push([neighbours[j]]);
                
                for (var k = 0; k < priorities[j][1].length; k++) {
                    let diff = maxEntries - priorities[j][1][k].length;
                    for (var l = 0; l < diff; l++) {
                        priorities[j][1][k].push(0);
                    }
                }
            }
            priorities.sort(function (a, b) {
                for (var j = 0; j < a[1].length; j++) {
                    for (var k = 0; k < a[1][j].length; k++) {
                        if (a[1][j][k] > b[1][j][k]) {
                            return -1;
                        } else if (a[1][j][k] < b[1][j][k]) {
                            return 1;
                        }
                    }
                }
                return 0;
            });
            let order = new Uint8Array(nNeighbours);
            for (var j = 0; j < nNeighbours; j++) {
                order[j] = priorities[j][0];
                vertex.value.priority = j;
            }
            
            
            
            let posA = this.graph.vertices[neighbours[order[0]]].position;
            let posB = this.graph.vertices[neighbours[order[1]]].position;
            let posC = this.graph.vertices[neighbours[order[2]]].position;
            let cwA = posA.relativeClockwise(posB, vertex.position);
            let cwB = posA.relativeClockwise(posC, vertex.position);
            
            
            let isCw = cwA === -1;
            let rotation = vertex.value.bracket.chirality === '@' ? -1 : 1;
            let rs = MathHelper.parityOfPermutation(order) * rotation === 1 ? 'R' : 'S';
            
            let wedgeA = 'down';
            let wedgeB = 'up';
            if (isCw && rs !== 'R' || !isCw && rs !== 'S') {
                vertex.value.hydrogenDirection = 'up';
                wedgeA = 'up';
                wedgeB = 'down';
            }
            if (vertex.value.hasHydrogen) {
                this.graph.getEdge(vertex.id, neighbours[order[order.length - 1]]).wedge = wedgeA;
            }
            
            
            
            
            
            
            let wedgeOrder = new Array(neighbours.length - 1);
            let showHydrogen = vertex.value.rings.length > 1 && vertex.value.hasHydrogen;
            let offset = vertex.value.hasHydrogen ? 1 : 0;
            for (var j = 0; j < order.length - offset; j++) {
                wedgeOrder[j] = new Uint32Array(2);
                let neighbour = this.graph.vertices[neighbours[order[j]]];
                wedgeOrder[j][0] += neighbour.value.isStereoCenter ? 0 : 100000;
                
                
                wedgeOrder[j][0] += this.areVerticesInSameRing(neighbour, vertex) ? 0 : 10000;
                wedgeOrder[j][0] += neighbour.value.isHeteroAtom() ? 1000 : 0;
                wedgeOrder[j][0] -= neighbour.value.subtreeDepth === 0 ? 1000 : 0;
                wedgeOrder[j][0] += 1000 - neighbour.value.subtreeDepth;
                wedgeOrder[j][1] = neighbours[order[j]];
            }
            wedgeOrder.sort(function (a, b) {
                if (a[0] > b[0]) {
                    return -1;
                } else if (a[0] < b[0]) {
                    return 1;
                }
                return 0;
            });
            
            if (!showHydrogen) {
                let wedgeId = wedgeOrder[0][1];
                if (vertex.value.hasHydrogen) {
                    this.graph.getEdge(vertex.id, wedgeId).wedge = wedgeB;
                } else {
                    let wedge = wedgeB;
                    for (var j = order.length - 1; j >= 0; j--) {
                        if (wedge === wedgeA) {
                            wedge = wedgeB;
                        } else {
                            wedge = wedgeA;
                        }
                        if (neighbours[order[j]] === wedgeId) {
                            break;
                        }
                    }
                    this.graph.getEdge(vertex.id, wedgeId).wedge = wedge;
                }
            }
            vertex.value.chirality = rs;
        }
    }
    
    visitStereochemistry(vertexId, previousVertexId, visited, priority, maxDepth, depth, parentAtomicNumber = 0) {
        visited[vertexId] = 1;
        let vertex = this.graph.vertices[vertexId];
        let atomicNumber = vertex.value.getAtomicNumber();
        if (priority.length <= depth) {
            priority.push(Array());
        }
        for (var i = 0; i < this.graph.getEdge(vertexId, previousVertexId).weight; i++) {
            priority[depth].push(parentAtomicNumber * 1000 + atomicNumber);
        }
        let neighbours = this.graph.vertices[vertexId].neighbours;
        for (var i = 0; i < neighbours.length; i++) {
            if (visited[neighbours[i]] !== 1 && depth < maxDepth - 1) {
                this.visitStereochemistry(neighbours[i], vertexId, visited.slice(), priority, maxDepth, depth + 1, atomicNumber);
            }
        }
        
        if (depth < maxDepth - 1) {
            let bonds = 0;
            for (var i = 0; i < neighbours.length; i++) {
                bonds += this.graph.getEdge(vertexId, neighbours[i]).weight;
            }
            for (var i = 0; i < vertex.value.getMaxBonds() - bonds; i++) {
                if (priority.length <= depth + 1) {
                    priority.push(Array());
                }
                priority[depth + 1].push(atomicNumber * 1000 + 1);
            }
        }
    }
    
    initPseudoElements() {
        for (var i = 0; i < this.graph.vertices.length; i++) {
            const vertex = this.graph.vertices[i];
            const neighbourIds = vertex.neighbours;
            let neighbours = Array(neighbourIds.length);
            for (var j = 0; j < neighbourIds.length; j++) {
                neighbours[j] = this.graph.vertices[neighbourIds[j]];
            }
            
            
            if (vertex.getNeighbourCount() < 3 || vertex.value.rings.length > 0) {
                continue;
            }
            
            
            if (vertex.value.element === 'P') {
                continue;
            }
            
            if (vertex.value.element === 'C' && neighbours.length === 3 &&
                neighbours[0].value.element === 'N' && neighbours[1].value.element === 'N' && neighbours[2].value.element === 'N') {
                continue;
            }
            
            
            let heteroAtomCount = 0;
            let ctn = 0;
            for (var j = 0; j < neighbours.length; j++) {
                let neighbour = neighbours[j];
                let neighbouringElement = neighbour.value.element;
                let neighbourCount = neighbour.getNeighbourCount();
                if (neighbouringElement !== 'C' && neighbouringElement !== 'H' &&
                    neighbourCount === 1) {
                    heteroAtomCount++;
                }
                if (neighbourCount > 1) {
                    ctn++;
                }
            }
            if (ctn > 1 || heteroAtomCount < 2) {
                continue;
            }
            
            let previous = null;
            for (var j = 0; j < neighbours.length; j++) {
                let neighbour = neighbours[j];
                if (neighbour.getNeighbourCount() > 1) {
                    previous = neighbour;
                }
            }
            for (var j = 0; j < neighbours.length; j++) {
                let neighbour = neighbours[j];
                if (neighbour.getNeighbourCount() > 1) {
                    continue;
                }
                neighbour.value.isDrawn = false;
                let hydrogens = Atom.maxBonds[neighbour.value.element] - neighbour.value.bondCount;
                let charge = '';
                if (neighbour.value.bracket) {
                    hydrogens = neighbour.value.bracket.hcount;
                    charge = neighbour.value.bracket.charge || 0;
                }
                vertex.value.attachPseudoElement(neighbour.value.element, previous ? previous.value.element : null, hydrogens, charge);
            }
        }
        
        for (var i = 0; i < this.graph.vertices.length; i++) {
            const vertex = this.graph.vertices[i];
            const atom = vertex.value;
            const element = atom.element;
            if (element === 'C' || element === 'H' || !atom.isDrawn) {
                continue;
            }
            const neighbourIds = vertex.neighbours;
            let neighbours = Array(neighbourIds.length);
            for (var j = 0; j < neighbourIds.length; j++) {
                neighbours[j] = this.graph.vertices[neighbourIds[j]];
            }
            for (var j = 0; j < neighbours.length; j++) {
                let neighbour = neighbours[j].value;
                if (!neighbour.hasAttachedPseudoElements || neighbour.getAttachedPseudoElementsCount() !== 2) {
                    continue;
                }
                const pseudoElements = neighbour.getAttachedPseudoElements();
                if (pseudoElements.hasOwnProperty('0O') && pseudoElements.hasOwnProperty('3C')) {
                    neighbour.isDrawn = false;
                    vertex.value.attachPseudoElement('Ac', '', 0);
                }
            }
        }
    }
}
module.exports = DrawerBase;