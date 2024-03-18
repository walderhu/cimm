const MathHelper = require('./MathHelper')
const ArrayHelper = require('./ArrayHelper')
const Vector2 = require('./Vector2')
const Atom = require('./Atom')

class Vertex {
    constructor(value, x = 0, y = 0) {
        this.id = null;
        this.value = value;
        this.position = new Vector2(x ? x : 0, y ? y : 0);
        this.previousPosition = new Vector2(0, 0);
        this.parentVertexId = null;
        this.children = Array();
        this.spanningTreeChildren = Array();
        this.edges = Array();
        this.positioned = false;
        this.angle = null;
        this.dir = 1.0;
        this.neighbourCount = 0;
        this.neighbours = Array();
        this.neighbouringElements = Array();
        this.forcePositioned = false;
    }
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    setPositionFromVector(v) {
        this.position.x = v.x;
        this.position.y = v.y;
    }
    addChild(vertexId) {
        this.children.push(vertexId);
        this.neighbours.push(vertexId);
        this.neighbourCount++;
    }
    addRingbondChild(vertexId, ringbondIndex) {
        this.children.push(vertexId);
        if (this.value.bracket) {
            let index = 1;
            if (this.id === 0 && this.value.bracket.hcount === 0) {
                index = 0;
            }
            if (this.value.bracket.hcount === 1 && ringbondIndex === 0) {
                index = 2;
            }
            if (this.value.bracket.hcount === 1 && ringbondIndex === 1) {
                if (this.neighbours.length < 3) {
                    index = 2;
                } else {
                    index = 3;
                }
            }
            if (this.value.bracket.hcount === null && ringbondIndex === 0) {
                index = 1;
            }
            if (this.value.bracket.hcount === null && ringbondIndex === 1) {
                if (this.neighbours.length < 3) {
                    index = 1;
                } else {
                    index = 2;
                }
            }
            this.neighbours.splice(index, 0, vertexId);
        } else {
            this.neighbours.push(vertexId);
        }
        this.neighbourCount++;
    }
    setParentVertexId(parentVertexId) {
        this.neighbourCount++;
        this.parentVertexId = parentVertexId;
        this.neighbours.push(parentVertexId);
    }
    isTerminal() {
        if (this.value.hasAttachedPseudoElements) {
            return true;
        }
        return (this.parentVertexId === null && this.children.length < 2) || this.children.length === 0;
    }
    clone() {
        let clone = new Vertex(this.value, this.position.x, this.position.y);
        clone.id = this.id;
        clone.previousPosition = new Vector2(this.previousPosition.x, this.previousPosition.y);
        clone.parentVertexId = this.parentVertexId;
        clone.children = ArrayHelper.clone(this.children);
        clone.spanningTreeChildren = ArrayHelper.clone(this.spanningTreeChildren);
        clone.edges = ArrayHelper.clone(this.edges);
        clone.positioned = this.positioned;
        clone.angle = this.angle;
        clone.forcePositioned = this.forcePositioned;
        return clone;
    }
    equals(vertex) {
        return this.id === vertex.id;
    }
    getAngle(referenceVector = null, returnAsDegrees = false) {
        let u = null;
        if (!referenceVector) {
            u = Vector2.subtract(this.position, this.previousPosition);
        } else {
            u = Vector2.subtract(this.position, referenceVector);
        }
        if (returnAsDegrees) {
            return MathHelper.toDeg(u.angle());
        }
        return u.angle();
    }
    getTextDirection(vertices, onlyHorizontal = false) {
        let neighbours = this.getDrawnNeighbours(vertices);
        let angles = Array();
        if (vertices.length === 1) {
            return 'right';
        }
        for (let i = 0; i < neighbours.length; i++) {
            angles.push(this.getAngle(vertices[neighbours[i]].position));
        }
        let textAngle = MathHelper.meanAngle(angles);
        if (this.isTerminal() || onlyHorizontal) {
            if (Math.round(textAngle * 100) / 100 === 1.57) {
                textAngle = textAngle - 0.2;
            }
            textAngle = Math.round(Math.round(textAngle / Math.PI) * Math.PI);
        } else {
            let halfPi = Math.PI / 2.0;
            textAngle = Math.round(Math.round(textAngle / halfPi) * halfPi);
        }
        if (textAngle === 2) {
            return 'down';
        } else if (textAngle === -2) {
            return 'up';
        } else if (textAngle === 0 || textAngle === -0) {
            return 'right'; // is checking for -0 necessary?
        } else if (textAngle === 3 || textAngle === -3) {
            return 'left';
        } else {
            return 'down'; // default to down
        }
    }
    getNeighbours(vertexId = null) {
        if (vertexId === null) {
            return this.neighbours.slice();
        }
        let arr = Array();
        for (let i = 0; i < this.neighbours.length; i++) {
            if (this.neighbours[i] !== vertexId) {
                arr.push(this.neighbours[i]);
            }
        }
        return arr;
    }
    getDrawnNeighbours(vertices) {
        let arr = Array();
        for (let i = 0; i < this.neighbours.length; i++) {
            if (vertices[this.neighbours[i]].value.isDrawn) {
                arr.push(this.neighbours[i]);
            }
        }
        return arr;
    }
    getNeighbourCount() {
        return this.neighbourCount;
    }
    getSpanningTreeNeighbours(vertexId = null) {
        let neighbours = Array();
        for (let i = 0; i < this.spanningTreeChildren.length; i++) {
            if (vertexId === undefined || vertexId != this.spanningTreeChildren[i]) {
                neighbours.push(this.spanningTreeChildren[i]);
            }
        }
        if (this.parentVertexId != null) {
            if (vertexId === undefined || vertexId != this.parentVertexId) {
                neighbours.push(this.parentVertexId);
            }
        }
        return neighbours;
    }
    getNextInRing(vertices, ringId, previousVertexId) {
        let neighbours = this.getNeighbours();
        for (let i = 0; i < neighbours.length; i++) {
            if (ArrayHelper.contains(vertices[neighbours[i]].value.rings, {
                value: ringId
            }) &&
                neighbours[i] != previousVertexId) {
                return neighbours[i];
            }
        }
        return null;
    }
}

module.exports = Vertex;