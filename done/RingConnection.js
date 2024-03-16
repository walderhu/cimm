const Vertex = require('./Vertex')
const Ring = require('./Ring')

class RingConnection {

    constructor(firstRing, secondRing) {
        this.id = null;
        this.firstRingId = firstRing.id;
        this.secondRingId = secondRing.id;
        this.vertices = new Set();

        for (var m = 0; m < firstRing.members.length; m++) {
            let c = firstRing.members[m];

            for (let n = 0; n < secondRing.members.length; n++) {
                let d = secondRing.members[n];

                if (c === d) {
                    this.addVertex(c);
                }
            }
        }
    }

    addVertex(vertexId) {
        this.vertices.add(vertexId);
    }

    updateOther(ringId, otherRingId) {
        if (this.firstRingId === otherRingId) {
            this.secondRingId = ringId;
        } else {
            this.firstRingId = ringId;
        }
    }

    containsRing(ringId) {
        return this.firstRingId === ringId || this.secondRingId === ringId;
    }

    isBridge(vertices) {
        if (this.vertices.size > 2) {
            return true;
        }

        for (let vertexId of this.vertices) {
            if (vertices[vertexId].value.rings.length > 2) {
                return true;
            }
        }
        return false;
    }

    static isBridge(ringConnections, vertices, firstRingId, secondRingId) {
        let ringConnection = null;
        for (let i = 0; i < ringConnections.length; i++) {
            ringConnection = ringConnections[i];

            if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId ||
                ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                return ringConnection.isBridge(vertices);
            }
        }
        return false;
    }

    static getNeighbours(ringConnections, ringId) {
        let neighbours = [];
        for (let i = 0; i < ringConnections.length; i++) {
            let ringConnection = ringConnections[i];

            if (ringConnection.firstRingId === ringId) {
                neighbours.push(ringConnection.secondRingId);
            } else if (ringConnection.secondRingId === ringId) {
                neighbours.push(ringConnection.firstRingId);
            }
        }
        return neighbours;
    }

    static getVertices(ringConnections, firstRingId, secondRingId) {
        for (let i = 0; i < ringConnections.length; i++) {
            let ringConnection = ringConnections[i];
            if (ringConnection.firstRingId === firstRingId && ringConnection.secondRingId === secondRingId ||
                ringConnection.firstRingId === secondRingId && ringConnection.secondRingId === firstRingId) {
                return [...ringConnection.vertices];
            }
        }
    }
}

module.exports = RingConnection