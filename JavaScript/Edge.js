class Edge {
    constructor(sourceId, targetId, weight = 1) {
        this.id = null;
        this.sourceId = sourceId;
        this.targetId = targetId;
        this.weight = weight;
        this.bondType = '-';
        this.isPartOfAromaticRing = false;
        this.center = false;
        this.wedge = '';
    }
    setBondType(bondType) {
        this.bondType = bondType;
        this.weight = Edge.bonds[bondType];
    }
    static get bonds() {
        return {
            '-': 1,
            '/': 1,
            '\\': 1,
            '=': 2,
            '#': 3,
            '$': 4
        }
    }
}

module.exports = Edge