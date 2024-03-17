const ArrayHelper = require('./ArrayHelper')
const Vertex = require('./Vertex')
const Ring = require('./Ring')

class Atom {
    constructor(element, bondType = '-') {
        this.idx = null;
        this.element = element.length === 1 ? element.toUpperCase() : element;
        this.drawExplicit = false;
        this.ringbonds = Array();
        this.rings = Array();
        this.bondType = bondType;
        this.branchBond = null;
        this.isBridge = false;
        this.isBridgeNode = false;
        this.originalRings = Array();
        this.bridgedRing = null;
        this.anchoredRings = Array();
        this.bracket = null;
        this.plane = 0;
        this.attachedPseudoElements = {};
        this.hasAttachedPseudoElements = false;
        this.isDrawn = true;
        this.isConnectedToRing = false;
        this.neighbouringElements = Array();
        this.isPartOfAromaticRing = element !== this.element;
        this.bondCount = 0;
        this.chirality = '';
        this.isStereoCenter = false;
        this.priority = 0;
        this.mainChain = false;
        this.hydrogenDirection = 'down';
        this.subtreeDepth = 1;
        this.hasHydrogen = false;
        this.class = undefined;
    }
    addNeighbouringElement(element) {
        this.neighbouringElements.push(element);
    }
    attachPseudoElement(element, previousElement, hydrogenCount = 0, charge = 0) {
        if (hydrogenCount === null) {
            hydrogenCount = 0;
        }
        if (charge === null) {
            charge = 0;
        }
        let key = hydrogenCount + element + charge;
        if (this.attachedPseudoElements[key]) {
            this.attachedPseudoElements[key].count += 1;
        } else {
            this.attachedPseudoElements[key] = {
                element: element,
                count: 1,
                hydrogenCount: hydrogenCount,
                previousElement: previousElement,
                charge: charge
            };
        }
        this.hasAttachedPseudoElements = true;
    }
    getAttachedPseudoElements() {
        let ordered = {};
        let that = this;
        Object.keys(this.attachedPseudoElements).sort().forEach(function (key) {
            ordered[key] = that.attachedPseudoElements[key];
        });
        return ordered;
    }
    getAttachedPseudoElementsCount() {
        return Object.keys(this.attachedPseudoElements).length;
    }
    isHeteroAtom() {
        return this.element !== 'C' && this.element !== 'H';
    }
    addAnchoredRing(ringId) {
        if (!ArrayHelper.contains(this.anchoredRings, {
            value: ringId
        })) {
            this.anchoredRings.push(ringId);
        }
    }
    getRingbondCount() {
        return this.ringbonds.length;
    }
    backupRings() {
        this.originalRings = Array(this.rings.length);
        for (let i = 0; i < this.rings.length; i++) {
            this.originalRings[i] = this.rings[i];
        }
    }
    restoreRings() {
        this.rings = Array(this.originalRings.length);
        for (let i = 0; i < this.originalRings.length; i++) {
            this.rings[i] = this.originalRings[i];
        }
    }
    haveCommonRingbond(atomA, atomB) {
        for (let i = 0; i < atomA.ringbonds.length; i++) {
            for (let j = 0; j < atomB.ringbonds.length; j++) {
                if (atomA.ringbonds[i].id == atomB.ringbonds[j].id) {
                    return true;
                }
            }
        }
        return false;
    }
    neighbouringElementsEqual(arr) {
        if (arr.length !== this.neighbouringElements.length) {
            return false;
        }
        arr.sort();
        this.neighbouringElements.sort();
        for (var i = 0; i < this.neighbouringElements.length; i++) {
            if (arr[i] !== this.neighbouringElements[i]) {
                return false;
            }
        }
        return true;
    }
    getAtomicNumber() {
        return Atom.atomicNumbers[this.element];
    }
    getMaxBonds() {
        return Atom.maxBonds[this.element];
    }
    static get maxBonds() {
        return {
            'H': 1,
            'C': 4,
            'N': 3,
            'O': 2,
            'P': 3,
            'S': 2,
            'B': 3,
            'F': 1,
            'I': 1,
            'Cl': 1,
            'Br': 1
        };
    }
    static get atomicNumbers() {
        return {
            'H': 1,
            'He': 2,
            'Li': 3,
            'Be': 4,
            'B': 5,
            'b': 5,
            'C': 6,
            'c': 6,
            'N': 7,
            'n': 7,
            'O': 8,
            'o': 8,
            'F': 9,
            'Ne': 10,
            'Na': 11,
            'Mg': 12,
            'Al': 13,
            'Si': 14,
            'P': 15,
            'p': 15,
            'S': 16,
            's': 16,
            'Cl': 17,
            'Ar': 18,
            'K': 19,
            'Ca': 20,
            'Sc': 21,
            'Ti': 22,
            'V': 23,
            'Cr': 24,
            'Mn': 25,
            'Fe': 26,
            'Co': 27,
            'Ni': 28,
            'Cu': 29,
            'Zn': 30,
            'Ga': 31,
            'Ge': 32,
            'As': 33,
            'Se': 34,
            'Br': 35,
            'Kr': 36,
            'Rb': 37,
            'Sr': 38,
            'Y': 39,
            'Zr': 40,
            'Nb': 41,
            'Mo': 42,
            'Tc': 43,
            'Ru': 44,
            'Rh': 45,
            'Pd': 46,
            'Ag': 47,
            'Cd': 48,
            'In': 49,
            'Sn': 50,
            'Sb': 51,
            'Te': 52,
            'I': 53,
            'Xe': 54,
            'Cs': 55,
            'Ba': 56,
            'La': 57,
            'Ce': 58,
            'Pr': 59,
            'Nd': 60,
            'Pm': 61,
            'Sm': 62,
            'Eu': 63,
            'Gd': 64,
            'Tb': 65,
            'Dy': 66,
            'Ho': 67,
            'Er': 68,
            'Tm': 69,
            'Yb': 70,
            'Lu': 71,
            'Hf': 72,
            'Ta': 73,
            'W': 74,
            'Re': 75,
            'Os': 76,
            'Ir': 77,
            'Pt': 78,
            'Au': 79,
            'Hg': 80,
            'Tl': 81,
            'Pb': 82,
            'Bi': 83,
            'Po': 84,
            'At': 85,
            'Rn': 86,
            'Fr': 87,
            'Ra': 88,
            'Ac': 89,
            'Th': 90,
            'Pa': 91,
            'U': 92,
            'Np': 93,
            'Pu': 94,
            'Am': 95,
            'Cm': 96,
            'Bk': 97,
            'Cf': 98,
            'Es': 99,
            'Fm': 100,
            'Md': 101,
            'No': 102,
            'Lr': 103,
            'Rf': 104,
            'Db': 105,
            'Sg': 106,
            'Bh': 107,
            'Hs': 108,
            'Mt': 109,
            'Ds': 110,
            'Rg': 111,
            'Cn': 112,
            'Uut': 113,
            'Uuq': 114,
            'Uup': 115,
            'Uuh': 116,
            'Uus': 117,
            'Uuo': 118
        };
    }
    static get mass() {
        return {
            'H': 1,
            'He': 2,
            'Li': 3,
            'Be': 4,
            'B': 5,
            'b': 5,
            'C': 6,
            'c': 6,
            'N': 7,
            'n': 7,
            'O': 8,
            'o': 8,
            'F': 9,
            'Ne': 10,
            'Na': 11,
            'Mg': 12,
            'Al': 13,
            'Si': 14,
            'P': 15,
            'p': 15,
            'S': 16,
            's': 16,
            'Cl': 17,
            'Ar': 18,
            'K': 19,
            'Ca': 20,
            'Sc': 21,
            'Ti': 22,
            'V': 23,
            'Cr': 24,
            'Mn': 25,
            'Fe': 26,
            'Co': 27,
            'Ni': 28,
            'Cu': 29,
            'Zn': 30,
            'Ga': 31,
            'Ge': 32,
            'As': 33,
            'Se': 34,
            'Br': 35,
            'Kr': 36,
            'Rb': 37,
            'Sr': 38,
            'Y': 39,
            'Zr': 40,
            'Nb': 41,
            'Mo': 42,
            'Tc': 43,
            'Ru': 44,
            'Rh': 45,
            'Pd': 46,
            'Ag': 47,
            'Cd': 48,
            'In': 49,
            'Sn': 50,
            'Sb': 51,
            'Te': 52,
            'I': 53,
            'Xe': 54,
            'Cs': 55,
            'Ba': 56,
            'La': 57,
            'Ce': 58,
            'Pr': 59,
            'Nd': 60,
            'Pm': 61,
            'Sm': 62,
            'Eu': 63,
            'Gd': 64,
            'Tb': 65,
            'Dy': 66,
            'Ho': 67,
            'Er': 68,
            'Tm': 69,
            'Yb': 70,
            'Lu': 71,
            'Hf': 72,
            'Ta': 73,
            'W': 74,
            'Re': 75,
            'Os': 76,
            'Ir': 77,
            'Pt': 78,
            'Au': 79,
            'Hg': 80,
            'Tl': 81,
            'Pb': 82,
            'Bi': 83,
            'Po': 84,
            'At': 85,
            'Rn': 86,
            'Fr': 87,
            'Ra': 88,
            'Ac': 89,
            'Th': 90,
            'Pa': 91,
            'U': 92,
            'Np': 93,
            'Pu': 94,
            'Am': 95,
            'Cm': 96,
            'Bk': 97,
            'Cf': 98,
            'Es': 99,
            'Fm': 100,
            'Md': 101,
            'No': 102,
            'Lr': 103,
            'Rf': 104,
            'Db': 105,
            'Sg': 106,
            'Bh': 107,
            'Hs': 108,
            'Mt': 109,
            'Ds': 110,
            'Rg': 111,
            'Cn': 112,
            'Uut': 113,
            'Uuq': 114,
            'Uup': 115,
            'Uuh': 116,
            'Uus': 117,
            'Uuo': 118
        };
    }
}

module.exports = Atom;