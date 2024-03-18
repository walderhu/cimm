
const Graph = require('./Graph')
class SSSR {
    static getRings(graph, experimental = false) {
        let adjacencyMatrix = graph.getComponentsAdjacencyMatrix();
        if (adjacencyMatrix.length === 0) {
            return null;
        }
        let connectedComponents = Graph.getConnectedComponents(adjacencyMatrix);
        let rings = Array();
        for (var i = 0; i < connectedComponents.length; i++) {
            let connectedComponent = connectedComponents[i];
            let ccAdjacencyMatrix = graph.getSubgraphAdjacencyMatrix([...connectedComponent]);
            let arrBondCount = new Uint16Array(ccAdjacencyMatrix.length);
            let arrRingCount = new Uint16Array(ccAdjacencyMatrix.length);
            for (var j = 0; j < ccAdjacencyMatrix.length; j++) {
                arrRingCount[j] = 0;
                arrBondCount[j] = 0;
                for (var k = 0; k < ccAdjacencyMatrix[j].length; k++) {
                    arrBondCount[j] += ccAdjacencyMatrix[j][k];
                }
            }
            let nEdges = 0;
            for (var j = 0; j < ccAdjacencyMatrix.length; j++) {
                for (var k = j + 1; k < ccAdjacencyMatrix.length; k++) {
                    nEdges += ccAdjacencyMatrix[j][k];
                }
            }
            let nSssr = nEdges - ccAdjacencyMatrix.length + 1;
            let allThree = true;
            for (var j = 0; j < arrBondCount.length; j++) {
                if (arrBondCount[j] !== 3) {
                    allThree = false;
                }
            }
            if (allThree) {
                nSssr = 2.0 + nEdges - ccAdjacencyMatrix.length;
            }
            if (nSssr === 1) {
                rings.push([...connectedComponent]);
                continue;
            }
            if (experimental) {
                nSssr = 999;
            }
            let { d, pe, pe_prime } = SSSR.getPathIncludedDistanceMatrices(ccAdjacencyMatrix);
            let c = SSSR.getRingCandidates(d, pe, pe_prime);
            let sssr = SSSR.getSSSR(c, d, ccAdjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nSssr);
            for (var j = 0; j < sssr.length; j++) {
                let ring = Array(sssr[j].size);
                let index = 0;
                for (let val of sssr[j]) {
                    ring[index++] = connectedComponent[val];
                }
                rings.push(ring);
            }
        }
        return rings;
    }

    static matrixToString(matrix) {
        let str = '';
        for (var i = 0; i < matrix.length; i++) {
            for (var j = 0; j < matrix[i].length; j++) {
                str += matrix[i][j] + ' ';
            }
            str += '\n';
        }
        return str;
    }

    static getPathIncludedDistanceMatrices(adjacencyMatrix) {
        let length = adjacencyMatrix.length;
        let d = Array(length);
        let pe = Array(length);
        let pe_prime = Array(length);
        var l = 0;
        var m = 0;
        var n = 0;
        var i = length;
        while (i--) {
            d[i] = Array(length);
            pe[i] = Array(length);
            pe_prime[i] = Array(length);
            var j = length;
            while (j--) {
                d[i][j] = (i === j || adjacencyMatrix[i][j] === 1) ? adjacencyMatrix[i][j] : Number.POSITIVE_INFINITY;
                if (d[i][j] === 1) {
                    pe[i][j] = [[[i, j]]];
                } else {
                    pe[i][j] = Array();
                }
                pe_prime[i][j] = Array();
            }
        }
        var k = length;
        var j;
        while (k--) {
            i = length;
            while (i--) {
                j = length;
                while (j--) {
                    const previousPathLength = d[i][j];
                    const newPathLength = d[i][k] + d[k][j];
                    if (previousPathLength > newPathLength) {
                        var l, m, n;
                        if (previousPathLength === newPathLength + 1) {
                            pe_prime[i][j] = [pe[i][j].length];
                            l = pe[i][j].length
                            while (l--) {
                                pe_prime[i][j][l] = [pe[i][j][l].length];
                                m = pe[i][j][l].length
                                while (m--) {
                                    pe_prime[i][j][l][m] = [pe[i][j][l][m].length];
                                    n = pe[i][j][l][m].length;
                                    while (n--) {
                                        pe_prime[i][j][l][m][n] = [pe[i][j][l][m][0], pe[i][j][l][m][1]];
                                    }
                                }
                            }
                        } else {
                            pe_prime[i][j] = Array();
                        }
                        d[i][j] = newPathLength;
                        pe[i][j] = [[]];
                        l = pe[i][k][0].length;
                        while (l--) {
                            pe[i][j][0].push(pe[i][k][0][l]);
                        }
                        l = pe[k][j][0].length;
                        while (l--) {
                            pe[i][j][0].push(pe[k][j][0][l]);
                        }
                    } else if (previousPathLength === newPathLength) {
                        if (pe[i][k].length && pe[k][j].length) {
                            var l;
                            if (pe[i][j].length) {
                                let tmp = Array();
                                l = pe[i][k][0].length;
                                while (l--) {
                                    tmp.push(pe[i][k][0][l]);
                                }
                                l = pe[k][j][0].length;
                                while (l--) {
                                    tmp.push(pe[k][j][0][l]);
                                }
                                pe[i][j].push(tmp);
                            } else {
                                let tmp = Array();
                                l = pe[i][k][0].length;
                                while (l--) {
                                    tmp.push(pe[i][k][0][l]);
                                }
                                l = pe[k][j][0].length;
                                while (l--) {
                                    tmp.push(pe[k][j][0][l]);
                                }
                                pe[i][j][0] = tmp
                            }
                        }
                    } else if (previousPathLength === newPathLength - 1) {
                        var l;
                        if (pe_prime[i][j].length) {
                            let tmp = Array();
                            l = pe[i][k][0].length;
                            while (l--) {
                                tmp.push(pe[i][k][0][l]);
                            }
                            l = pe[k][j][0].length;
                            while (l--) {
                                tmp.push(pe[k][j][0][l]);
                            }
                            pe_prime[i][j].push(tmp);
                        } else {
                            let tmp = Array();
                            l = pe[i][k][0].length;
                            while (l--) {
                                tmp.push(pe[i][k][0][l]);
                            }
                            l = pe[k][j][0].length;
                            while (l--) {
                                tmp.push(pe[k][j][0][l]);
                            }
                            pe_prime[i][j][0] = tmp;
                        }
                    }
                }
            }
        }
        return {
            d: d,
            pe: pe,
            pe_prime: pe_prime
        };
    }

    static getRingCandidates(d, pe, pe_prime) {
        let length = d.length;
        let candidates = Array();
        let c = 0;
        for (let i = 0; i < length; i++) {
            for (let j = 0; j < length; j++) {
                if (d[i][j] === 0 || (pe[i][j].length === 1 && pe_prime[i][j] === 0)) {
                    continue;
                } else {
                    if (pe_prime[i][j].length !== 0) {
                        c = 2 * (d[i][j] + 0.5);
                    } else {
                        c = 2 * d[i][j];
                    }
                    if (c !== Infinity) {
                        candidates.push([c, pe[i][j], pe_prime[i][j]]);
                    }
                }
            }
        }
        candidates.sort(function (a, b) {
            return a[0] - b[0];
        });
        return candidates;
    }











    static getSSSR(c, d, adjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nsssr) {
        let cSssr = Array();
        let allBonds = Array();
        for (let i = 0; i < c.length; i++) {
            if (c[i][0] % 2 !== 0) {
                for (let j = 0; j < c[i][2].length; j++) {
                    let bonds = c[i][1][0].concat(c[i][2][j]);
                    for (var k = 0; k < bonds.length; k++) {
                        if (bonds[k][0].constructor === Array) bonds[k] = bonds[k][0];
                    }
                    let atoms = SSSR.bondsToAtoms(bonds);
                    if (SSSR.getBondCount(atoms, adjacencyMatrix) === atoms.size && !SSSR.pathSetsContain(cSssr, atoms, bonds, allBonds, arrBondCount, arrRingCount)) {
                        cSssr.push(atoms);
                        allBonds = allBonds.concat(bonds);
                    }
                    if (cSssr.length > nsssr) {
                        return cSssr;
                    }
                }
            } else {
                for (let j = 0; j < c[i][1].length - 1; j++) {
                    let bonds = c[i][1][j].concat(c[i][1][j + 1]);
                    for (var k = 0; k < bonds.length; k++) {
                        if (bonds[k][0].constructor === Array) bonds[k] = bonds[k][0];
                    }
                    let atoms = SSSR.bondsToAtoms(bonds);
                    if (SSSR.getBondCount(atoms, adjacencyMatrix) === atoms.size && !SSSR.pathSetsContain(cSssr, atoms, bonds, allBonds, arrBondCount, arrRingCount)) {
                        cSssr.push(atoms);
                        allBonds = allBonds.concat(bonds);
                    }
                    if (cSssr.length > nsssr) {
                        return cSssr;
                    }
                }
            }
        }
        return cSssr;
    }








    static getEdgeCount(adjacencyMatrix) {
        let edgeCount = 0;
        let length = adjacencyMatrix.length;
        var i = length - 1;
        while (i--) {
            var j = length;
            while (j--) {
                if (adjacencyMatrix[i][j] === 1) {
                    edgeCount++;
                }
            }
        }
        return edgeCount;
    }


    static getEdgeList(adjacencyMatrix) {
        let length = adjacencyMatrix.length;
        let edgeList = Array();
        var i = length - 1;
        while (i--) {
            var j = length;
            while (j--) {
                if (adjacencyMatrix[i][j] === 1) {
                    edgeList.push([i, j]);
                }
            }
        }
        return edgeList;
    }



    static bondsToAtoms(bonds) {
        let atoms = new Set();
        var i = bonds.length;
        while (i--) {
            atoms.add(bonds[i][0]);
            atoms.add(bonds[i][1]);
        }
        return atoms;
    }

    static getBondCount(atoms, adjacencyMatrix) {
        let count = 0;
        for (let u of atoms) {
            for (let v of atoms) {
                if (u === v) {
                    continue;
                }
                count += adjacencyMatrix[u][v]
            }
        }
        return count / 2;
    }

















    static pathSetsContain(pathSets, pathSet, bonds, allBonds, arrBondCount, arrRingCount) {
        var i = pathSets.length;
        while (i--) {
            if (SSSR.isSupersetOf(pathSet, pathSets[i])) {
                return true;
            }
            if (pathSets[i].size !== pathSet.size) {
                continue;
            }
            if (SSSR.areSetsEqual(pathSets[i], pathSet)) {
                return true;
            }
        }
        let count = 0;
        let allContained = false;
        i = bonds.length;
        while (i--) {
            var j = allBonds.length;
            while (j--) {
                if (bonds[i][0] === allBonds[j][0] && bonds[i][1] === allBonds[j][1] ||
                    bonds[i][1] === allBonds[j][0] && bonds[i][0] === allBonds[j][1]) {
                    count++;
                }
                if (count === bonds.length) {
                    allContained = true;
                }
            }
        }
        let specialCase = false;
        if (allContained) {
            for (let element of pathSet) {
                if (arrRingCount[element] < arrBondCount[element]) {
                    specialCase = true;
                    break;
                }
            }
        }
        if (allContained && !specialCase) {
            return true;
        }
        for (let element of pathSet) {
            arrRingCount[element]++;
        }
        return false;
    }











    static areSetsEqual(setA, setB) {
        if (setA.size !== setB.size) {
            return false;
        }
        for (let element of setA) {
            if (!setB.has(element)) {
                return false;
            }
        }
        return true;
    }



    static isSupersetOf(setA, setB) {
        for (var element of setB) {
            if (!setA.has(element)) {
                return false;
            }
        }
        return true;
    }
}
module.exports = SSSR;