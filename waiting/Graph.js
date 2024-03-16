
const MathHelper = require('./MathHelper')
const Vector2 = require('./Vector2')
const Vertex = require('./Vertex')
const Edge = require('./Edge')
const Ring = require('./Ring')
const Atom = require('./Atom')
class Graph {
    constructor(parseTree, isomeric = false) {
        this.vertices = Array();
        this.edges = Array();
        this.atomIdxToVertexId = Array();
        this.vertexIdsToEdgeId = {};
        this.isomeric = isomeric;
        this._atomIdx = 0;
        this._time = 0;
        this._init(parseTree);
    }
    _init(node, order = 0, parentVertexId = null, isBranch = false) {
        const element = node.atom.element ? node.atom.element : node.atom;
        let atom = new Atom(element, node.bond);
        if (element !== 'H' || (!node.hasNext && parentVertexId === null)) {
            atom.idx = this._atomIdx;
            this._atomIdx++;
        }
        atom.branchBond = node.branchBond;
        atom.ringbonds = node.ringbonds;
        atom.bracket = node.atom.element ? node.atom : null;
        atom.class = node.atom.class
        let vertex = new Vertex(atom);
        let parentVertex = this.vertices[parentVertexId];
        this.addVertex(vertex);
        if (atom.idx !== null) {
            this.atomIdxToVertexId.push(vertex.id);
        }
        if (parentVertexId !== null) {
            vertex.setParentVertexId(parentVertexId);
            vertex.value.addNeighbouringElement(parentVertex.value.element);
            parentVertex.addChild(vertex.id);
            parentVertex.value.addNeighbouringElement(atom.element);
            parentVertex.spanningTreeChildren.push(vertex.id);
            let edge = new Edge(parentVertexId, vertex.id, 1);
            let vertexId = null;
            if (isBranch) {
                edge.setBondType(vertex.value.branchBond || '-');
                vertexId = vertex.id;
                edge.setBondType(vertex.value.branchBond || '-');
                vertexId = vertex.id;
            } else {
                edge.setBondType(parentVertex.value.bondType || '-');
                vertexId = parentVertex.id;
            }
            let edgeId = this.addEdge(edge);
        }
        let offset = node.ringbondCount + 1;
        if (atom.bracket) {
            offset += atom.bracket.hcount;
        }
        let stereoHydrogens = 0;
        if (atom.bracket && atom.bracket.chirality) {
            atom.isStereoCenter = true;
            stereoHydrogens = atom.bracket.hcount;
            for (var i = 0; i < stereoHydrogens; i++) {
                this._init({
                    atom: 'H',
                    isBracket: 'false',
                    branches: Array(),
                    branchCount: 0,
                    ringbonds: Array(),
                    ringbondCount: false,
                    next: null,
                    hasNext: false,
                    bond: '-'
                }, i, vertex.id, true);
            }
        }
        for (var i = 0; i < node.branchCount; i++) {
            this._init(node.branches[i], i + offset, vertex.id, true);
        }
        if (node.hasNext) {
            this._init(node.next, node.branchCount + offset, vertex.id);
        }
    }
    clear() {
        this.vertices = Array();
        this.edges = Array();
        this.vertexIdsToEdgeId = {};
    }
    addVertex(vertex) {
        vertex.id = this.vertices.length;
        this.vertices.push(vertex);
        return vertex.id;
    }
    addEdge(edge) {
        let source = this.vertices[edge.sourceId];
        let target = this.vertices[edge.targetId];
        edge.id = this.edges.length;
        this.edges.push(edge);
        this.vertexIdsToEdgeId[edge.sourceId + '_' + edge.targetId] = edge.id;
        this.vertexIdsToEdgeId[edge.targetId + '_' + edge.sourceId] = edge.id;
        edge.isPartOfAromaticRing = source.value.isPartOfAromaticRing && target.value.isPartOfAromaticRing;
        source.value.bondCount += edge.weight;
        target.value.bondCount += edge.weight;
        source.edges.push(edge.id);
        target.edges.push(edge.id);
        return edge.id;
    }
    getEdge(vertexIdA, vertexIdB) {
        let edgeId = this.vertexIdsToEdgeId[vertexIdA + '_' + vertexIdB];
        return edgeId === undefined ? null : this.edges[edgeId];
    }
    getEdges(vertexId) {
        let edgeIds = Array();
        let vertex = this.vertices[vertexId];
        for (var i = 0; i < vertex.neighbours.length; i++) {
            edgeIds.push(this.vertexIdsToEdgeId[vertexId + '_' + vertex.neighbours[i]]);
        }
        return edgeIds;
    }
    hasEdge(vertexIdA, vertexIdB) {
        return this.vertexIdsToEdgeId[vertexIdA + '_' + vertexIdB] !== undefined
    }
    getVertexList() {
        let arr = [this.vertices.length];
        for (var i = 0; i < this.vertices.length; i++) {
            arr[i] = this.vertices[i].id;
        }
        return arr;
    }
    getEdgeList() {
        let arr = Array(this.edges.length);
        for (var i = 0; i < this.edges.length; i++) {
            arr[i] = [this.edges[i].sourceId, this.edges[i].targetId];
        }
        return arr;
    }
    getAdjacencyMatrix() {
        let length = this.vertices.length;
        let adjacencyMatrix = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyMatrix[i] = new Array(length);
            adjacencyMatrix[i].fill(0);
        }
        for (var i = 0; i < this.edges.length; i++) {
            let edge = this.edges[i];
            adjacencyMatrix[edge.sourceId][edge.targetId] = 1;
            adjacencyMatrix[edge.targetId][edge.sourceId] = 1;
        }
        return adjacencyMatrix;
    }
    getComponentsAdjacencyMatrix() {
        let length = this.vertices.length;
        let adjacencyMatrix = Array(length);
        let bridges = this.getBridges();
        for (var i = 0; i < length; i++) {
            adjacencyMatrix[i] = new Array(length);
            adjacencyMatrix[i].fill(0);
        }
        for (var i = 0; i < this.edges.length; i++) {
            let edge = this.edges[i];
            adjacencyMatrix[edge.sourceId][edge.targetId] = 1;
            adjacencyMatrix[edge.targetId][edge.sourceId] = 1;
        }
        for (var i = 0; i < bridges.length; i++) {
            adjacencyMatrix[bridges[i][0]][bridges[i][1]] = 0;
            adjacencyMatrix[bridges[i][1]][bridges[i][0]] = 0;
        }
        return adjacencyMatrix;
    }
    getSubgraphAdjacencyMatrix(vertexIds) {
        let length = vertexIds.length;
        let adjacencyMatrix = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyMatrix[i] = new Array(length);
            adjacencyMatrix[i].fill(0);
            for (var j = 0; j < length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.hasEdge(vertexIds[i], vertexIds[j])) {
                    adjacencyMatrix[i][j] = 1;
                }
            }
        }
        return adjacencyMatrix;
    }
    getDistanceMatrix() {
        let length = this.vertices.length;
        let adja = this.getAdjacencyMatrix();
        let dist = Array(length);
        for (var i = 0; i < length; i++) {
            dist[i] = Array(length);
            dist[i].fill(Infinity);
        }
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (adja[i][j] === 1) {
                    dist[i][j] = 1;
                }
            }
        }
        for (var k = 0; k < length; k++) {
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j]
                    }
                }
            }
        }
        return dist;
    }
    getSubgraphDistanceMatrix(vertexIds) {
        let length = vertexIds.length;
        let adja = this.getSubgraphAdjacencyMatrix(vertexIds);
        let dist = Array(length);
        for (var i = 0; i < length; i++) {
            dist[i] = Array(length);
            dist[i].fill(Infinity);
        }
        for (var i = 0; i < length; i++) {
            for (var j = 0; j < length; j++) {
                if (adja[i][j] === 1) {
                    dist[i][j] = 1;
                }
            }
        }
        for (var k = 0; k < length; k++) {
            for (var i = 0; i < length; i++) {
                for (var j = 0; j < length; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j]
                    }
                }
            }
        }
        return dist;
    }
    getAdjacencyList() {
        let length = this.vertices.length;
        let adjacencyList = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyList[i] = [];
            for (var j = 0; j < length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.hasEdge(this.vertices[i].id, this.vertices[j].id)) {
                    adjacencyList[i].push(j);
                }
            }
        }
        return adjacencyList;
    }
    getSubgraphAdjacencyList(vertexIds) {
        let length = vertexIds.length;
        let adjacencyList = Array(length);
        for (var i = 0; i < length; i++) {
            adjacencyList[i] = Array();
            for (var j = 0; j < length; j++) {
                if (i === j) {
                    continue;
                }
                if (this.hasEdge(vertexIds[i], vertexIds[j])) {
                    adjacencyList[i].push(j);
                }
            }
        }
        return adjacencyList;
    }
    getBridges() {
        let length = this.vertices.length;
        let visited = new Array(length);
        let disc = new Array(length);
        let low = new Array(length);
        let parent = new Array(length);
        let adj = this.getAdjacencyList();
        let outBridges = Array();
        visited.fill(false);
        parent.fill(null);
        this._time = 0;
        for (var i = 0; i < length; i++) {
            if (!visited[i]) {
                this._bridgeDfs(i, visited, disc, low, parent, adj, outBridges);
            }
        }
        return outBridges;
    }
    traverseBF(startVertexId, callback) {
        let length = this.vertices.length;
        let visited = new Array(length);
        visited.fill(false);
        var queue = [startVertexId];
        while (queue.length > 0) {
            let u = queue.shift();
            let vertex = this.vertices[u];
            callback(vertex);
            for (var i = 0; i < vertex.neighbours.length; i++) {
                let v = vertex.neighbours[i]
                if (!visited[v]) {
                    visited[v] = true;
                    queue.push(v);
                }
            }
        }
    }
    getTreeDepth(vertexId, parentVertexId) {
        if (vertexId === null || parentVertexId === null) {
            return 0;
        }
        let neighbours = this.vertices[vertexId].getSpanningTreeNeighbours(parentVertexId);
        let max = 0;
        for (var i = 0; i < neighbours.length; i++) {
            let childId = neighbours[i];
            let d = this.getTreeDepth(childId, vertexId);
            if (d > max) {
                max = d;
            }
        }
        return max + 1;
    }
    traverseTree(vertexId, parentVertexId, callback, maxDepth = 999999, ignoreFirst = false, depth = 1, visited = null) {
        if (visited === null) {
            visited = new Uint8Array(this.vertices.length);
        }
        if (depth > maxDepth + 1 || visited[vertexId] === 1) {
            return;
        }
        visited[vertexId] = 1;
        let vertex = this.vertices[vertexId];
        let neighbours = vertex.getNeighbours(parentVertexId);
        if (!ignoreFirst || depth > 1) {
            callback(vertex);
        }
        for (var i = 0; i < neighbours.length; i++) {
            this.traverseTree(neighbours[i], vertexId, callback, maxDepth, ignoreFirst, depth + 1, visited);
        }
    }
    kkLayout(vertexIds, center, startVertexId, ring, bondLength,
        threshold = 0.1, innerThreshold = 0.1, maxIteration = 2000,
        maxInnerIteration = 50, maxEnergy = 1e9) {
        let edgeStrength = bondLength;
        var i = vertexIds.length;
        while (i--) {
            let vertex = this.vertices[vertexIds[i]];
            var j = vertex.neighbours.length;
        }
        let matDist = this.getSubgraphDistanceMatrix(vertexIds);
        let length = vertexIds.length;
        let radius = MathHelper.polyCircumradius(500, length);
        let angle = MathHelper.centralAngle(length);
        let a = 0.0;
        let arrPositionX = new Float32Array(length);
        let arrPositionY = new Float32Array(length);
        let arrPositioned = Array(length);
        i = length;
        while (i--) {
            let vertex = this.vertices[vertexIds[i]];
            if (!vertex.positioned) {
                arrPositionX[i] = center.x + Math.cos(a) * radius;
                arrPositionY[i] = center.y + Math.sin(a) * radius;
            } else {
                arrPositionX[i] = vertex.position.x;
                arrPositionY[i] = vertex.position.y;
            }
            arrPositioned[i] = vertex.positioned;
            a += angle;
        }
        let matLength = Array(length);
        i = length;
        while (i--) {
            matLength[i] = new Array(length);
            var j = length;
            while (j--) {
                matLength[i][j] = bondLength * matDist[i][j];
            }
        }
        let matStrength = Array(length);
        i = length;
        while (i--) {
            matStrength[i] = Array(length);
            var j = length;
            while (j--) {
                matStrength[i][j] = edgeStrength * Math.pow(matDist[i][j], -2.0);
            }
        }
        let matEnergy = Array(length);
        let arrEnergySumX = new Float32Array(length);
        let arrEnergySumY = new Float32Array(length);
        i = length;
        while (i--) {
            matEnergy[i] = Array(length);
        }
        i = length;
        let ux, uy, dEx, dEy, vx, vy, denom;
        while (i--) {
            ux = arrPositionX[i];
            uy = arrPositionY[i];
            dEx = 0.0;
            dEy = 0.0;
            let j = length;
            while (j--) {
                if (i === j) {
                    continue;
                }
                vx = arrPositionX[j];
                vy = arrPositionY[j];
                denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                matEnergy[i][j] = [
                    matStrength[i][j] * ((ux - vx) - matLength[i][j] * (ux - vx) * denom),
                    matStrength[i][j] * ((uy - vy) - matLength[i][j] * (uy - vy) * denom)
                ]
                matEnergy[j][i] = matEnergy[i][j];
                dEx += matEnergy[i][j][0];
                dEy += matEnergy[i][j][1];
            }
            arrEnergySumX[i] = dEx;
            arrEnergySumY[i] = dEy;
        }
        let energy = function (index) {
            return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]];
        }
        let highestEnergy = function () {
            let maxEnergy = 0.0;
            let maxEnergyId = 0;
            let maxDEX = 0.0;
            let maxDEY = 0.0
            i = length;
            while (i--) {
                let [delta, dEX, dEY] = energy(i);
                if (delta > maxEnergy && arrPositioned[i] === false) {
                    maxEnergy = delta;
                    maxEnergyId = i;
                    maxDEX = dEX;
                    maxDEY = dEY;
                }
            }
            return [maxEnergyId, maxEnergy, maxDEX, maxDEY];
        }
        let update = function (index, dEX, dEY) {
            let dxx = 0.0;
            let dyy = 0.0;
            let dxy = 0.0;
            let ux = arrPositionX[index];
            let uy = arrPositionY[index];
            let arrL = matLength[index];
            let arrK = matStrength[index];
            i = length;
            while (i--) {
                if (i === index) {
                    continue;
                }
                let vx = arrPositionX[i];
                let vy = arrPositionY[i];
                let l = arrL[i];
                let k = arrK[i];
                let m = (ux - vx) * (ux - vx);
                let denom = 1.0 / Math.pow(m + (uy - vy) * (uy - vy), 1.5);
                dxx += k * (1 - l * (uy - vy) * (uy - vy) * denom);
                dyy += k * (1 - l * m * denom);
                dxy += k * (l * (ux - vx) * (uy - vy) * denom);
            }
            if (dxx === 0) {
                dxx = 0.1;
            }
            if (dyy === 0) {
                dyy = 0.1;
            }
            if (dxy === 0) {
                dxy = 0.1;
            }
            let dy = (dEX / dxx + dEY / dxy);
            dy /= (dxy / dxx - dyy / dxy);
            let dx = -(dxy * dy + dEX) / dxx;
            arrPositionX[index] += dx;
            arrPositionY[index] += dy;
            let arrE = matEnergy[index];
            dEX = 0.0;
            dEY = 0.0;
            ux = arrPositionX[index];
            uy = arrPositionY[index];
            let vx, vy, prevEx, prevEy, denom;
            i = length;
            while (i--) {
                if (index === i) {
                    continue;
                }
                vx = arrPositionX[i];
                vy = arrPositionY[i];
                prevEx = arrE[i][0];
                prevEy = arrE[i][1];
                denom = 1.0 / Math.sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy));
                dx = arrK[i] * ((ux - vx) - arrL[i] * (ux - vx) * denom);
                dy = arrK[i] * ((uy - vy) - arrL[i] * (uy - vy) * denom);
                arrE[i] = [dx, dy];
                dEX += dx;
                dEY += dy;
                arrEnergySumX[i] += dx - prevEx;
                arrEnergySumY[i] += dy - prevEy;
            }
            arrEnergySumX[index] = dEX;
            arrEnergySumY[index] = dEY;
        }
        let maxEnergyId = 0;
        let dEX = 0.0;
        let dEY = 0.0;
        let delta = 0.0;
        let iteration = 0;
        let innerIteration = 0;
        while (maxEnergy > threshold && maxIteration > iteration) {
            iteration++;
            [maxEnergyId, maxEnergy, dEX, dEY] = highestEnergy();
            delta = maxEnergy;
            innerIteration = 0;
            while (delta > innerThreshold && maxInnerIteration > innerIteration) {
                innerIteration++;
                update(maxEnergyId, dEX, dEY);
                [delta, dEX, dEY] = energy(maxEnergyId);
            }
        }
        i = length;
        while (i--) {
            let index = vertexIds[i];
            let vertex = this.vertices[index];
            vertex.position.x = arrPositionX[i];
            vertex.position.y = arrPositionY[i];
            vertex.positioned = true;
            vertex.forcePositioned = true;
        }
    }
    _bridgeDfs(u, visited, disc, low, parent, adj, outBridges) {
        visited[u] = true;
        disc[u] = low[u] = ++this._time;
        for (var i = 0; i < adj[u].length; i++) {
            let v = adj[u][i];
            if (!visited[v]) {
                parent[v] = u;
                this._bridgeDfs(v, visited, disc, low, parent, adj, outBridges);
                low[u] = Math.min(low[u], low[v]);
                if (low[v] > disc[u]) {
                    outBridges.push([u, v]);
                }
            } else if (v !== parent[u]) {
                low[u] = Math.min(low[u], disc[v]);
            }
        }
    }
    static getConnectedComponents(adjacencyMatrix) {
        let length = adjacencyMatrix.length;
        let visited = new Array(length);
        let components = new Array();
        let count = 0;
        visited.fill(false);
        for (var u = 0; u < length; u++) {
            if (!visited[u]) {
                let component = Array();
                visited[u] = true;
                component.push(u);
                count++;
                Graph._ccGetDfs(u, visited, adjacencyMatrix, component);
                if (component.length > 1) {
                    components.push(component);
                }
            }
        }
        return components;
    }
    static getConnectedComponentCount(adjacencyMatrix) {
        let length = adjacencyMatrix.length;
        let visited = new Array(length);
        let count = 0;
        visited.fill(false);
        for (var u = 0; u < length; u++) {
            if (!visited[u]) {
                visited[u] = true;
                count++;
                Graph._ccCountDfs(u, visited, adjacencyMatrix);
            }
        }
        return count;
    }
    static _ccCountDfs(u, visited, adjacencyMatrix) {
        for (var v = 0; v < adjacencyMatrix[u].length; v++) {
            let c = adjacencyMatrix[u][v];
            if (!c || visited[v] || u === v) {
                continue;
            }
            visited[v] = true;
            Graph._ccCountDfs(v, visited, adjacencyMatrix);
        }
    }
    static _ccGetDfs(u, visited, adjacencyMatrix, component) {
        for (var v = 0; v < adjacencyMatrix[u].length; v++) {
            let c = adjacencyMatrix[u][v];
            if (!c || visited[v] || u === v) {
                continue;
            }
            visited[v] = true;
            component.push(v);
            Graph._ccGetDfs(v, visited, adjacencyMatrix, component);
        }
    }
}
module.exports = Graph