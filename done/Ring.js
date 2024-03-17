const ArrayHelper = require('./ArrayHelper')
const Vector2 = require('./Vector2')
const Vertex = require('./Vertex')
const RingConnection = require('./RingConnection')

class Ring {
    constructor(members) {
        this.id = null;
        this.members = members;
        this.edges = [];
        this.insiders = [];
        this.neighbours = [];
        this.positioned = false;
        this.center = new Vector2(0, 0);
        this.rings = [];
        this.isBridged = false;
        this.isPartOfBridged = false;
        this.isSpiro = false;
        this.isFused = false;
        this.centralAngle = 0.0;
        this.canFlip = true;
    }
    clone() {
        let clone = new Ring(this.members);
        clone.id = this.id;
        clone.insiders = ArrayHelper.clone(this.insiders);
        clone.neighbours = ArrayHelper.clone(this.neighbours);
        clone.positioned = this.positioned;
        clone.center = this.center.clone();
        clone.rings = ArrayHelper.clone(this.rings);
        clone.isBridged = this.isBridged;
        clone.isPartOfBridged = this.isPartOfBridged;
        clone.isSpiro = this.isSpiro;
        clone.isFused = this.isFused;
        clone.centralAngle = this.centralAngle;
        clone.canFlip = this.canFlip;
        return clone;
    }
    getSize() {
        return this.members.length;
    }
    getPolygon(vertices) {
        let polygon = [];
        for (let i = 0; i < this.members.length; i++) {
            polygon.push(vertices[this.members[i]].position);
        }
        return polygon;
    }
    getAngle() {
        return Math.PI - this.centralAngle;
    }
    eachMember(vertices, callback, startVertexId, previousVertexId) {
        startVertexId = startVertexId || startVertexId === 0 ? startVertexId : this.members[0];
        let current = startVertexId;
        let max = 0;
        while (current != null && max < 100) {
            let prev = current;
            callback(prev);
            current = vertices[current].getNextInRing(vertices, this.id, previousVertexId);
            previousVertexId = prev;
            if (current == startVertexId) {
                current = null;
            }
            max++;
        }
    }
    getOrderedNeighbours(ringConnections) {
        let orderedNeighbours = Array(this.neighbours.length);
        for (let i = 0; i < this.neighbours.length; i++) {
            let vertices = RingConnection.getVertices(ringConnections, this.id, this.neighbours[i]);
            orderedNeighbours[i] = {
                n: vertices.length,
                neighbour: this.neighbours[i]
            };
        }
        orderedNeighbours.sort(function (a, b) {
            return b.n - a.n;
        });
        return orderedNeighbours;
    }
    isBenzeneLike(vertices) {
        let db = this.getDoubleBondCount(vertices);
        let length = this.members.length;
        return db === 3 && length === 6 ||
            db === 2 && length === 5;
    }
    getDoubleBondCount(vertices) {
        let doubleBondCount = 0;
        for (let i = 0; i < this.members.length; i++) {
            let atom = vertices[this.members[i]].value;
            if (atom.bondType === '=' || atom.branchBond === '=') {
                doubleBondCount++;
            }
        }
        return doubleBondCount;
    }
    contains(vertexId) {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i] == vertexId) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Ring;