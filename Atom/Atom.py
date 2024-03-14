from ArrayHelper import contains

class Atom:
    atomicNumbers = {
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
    }

    maxBonds = {
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
    }

    mass = {
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
    }

    def __init__(self, element, bondType='-'):
        self.idx = None
        self.element = element.upper() if len(element) == 1 else element
        self.drawExplicit = False
        self.ringbonds = []
        self.rings = []
        self.bondType = bondType
        self.branchBond = None
        self.isBridge = False
        self.isBridgeNode = False
        self.originalRings = []
        self.bridgedRing = None
        self.anchoredRings = []
        self.bracket = None
        self.plane = 0
        self.attachedPseudoElements = {}
        self.hasAttachedPseudoElements = False
        self.isDrawn = True
        self.isConnectedToRing = False
        self.neighbouringElements = []
        self.isPartOfAromaticRing = element != self.element
        self.bondCount = 0
        self.chirality = ''
        self.isStereoCenter = False
        self.priority = 0
        self.mainChain = False
        self.hydrogenDirection = 'down'
        self.subtreeDepth = 1
        self.hasHydrogen = False

    def addNeighbouringElement(self, element):
        self.neighbouringElements.append(element)

    def attachPseudoElement(self, element, previousElement, hydrogenCount=0, charge=0):
        if hydrogenCount is None:
            hydrogenCount = 0
        if charge is None:
            charge = 0
        key = str(hydrogenCount) + element + str(charge)
        if key in self.attachedPseudoElements:
            self.attachedPseudoElements[key]['count'] += 1
        else:
            self.attachedPseudoElements[key] = {
                'element': element,
                'count': 1,
                'hydrogenCount': hydrogenCount,
                'previousElement': previousElement,
                'charge': charge
            }
        self.hasAttachedPseudoElements = True

    def getAttachedPseudoElements(self):
        ordered = {}
        for key in sorted(self.attachedPseudoElements.keys()):
            ordered[key] = self.attachedPseudoElements[key]
        return ordered

    def getAttachedPseudoElementsCount(self):
        return len(self.attachedPseudoElements)

    def isHeteroAtom(self):
        return self.element != 'C' and self.element != 'H'

    def addAnchoredRing(self, ringId):
        if not contains(self.anchoredRings, {'value': ringId}):
            self.anchoredRings.append(ringId)

    def getRingbondCount(self):
        return len(self.ringbonds)

    def backupRings(self):
        self.originalRings = self.rings[:]

    def restoreRings(self):
        self.rings = self.originalRings[:]

    def haveCommonRingbond(self, atomA, atomB):
        for ringbondA in atomA.ringbonds:
            for ringbondB in atomB.ringbonds:
                if ringbondA['id'] == ringbondB['id']:
                    return True
        return False

    def neighbouringElementsEqual(self, arr):
        if len(arr) != len(self.neighbouringElements):
            return False
        arr.sort()
        self.neighbouringElements.sort()
        for i in range(len(self.neighbouringElements)):
            if arr[i] != self.neighbouringElements[i]:
                return False
        return True

    def getAtomicNumber(self):
        return Atom.atomicNumbers[self.element]

    def getMaxBonds(self):
        return Atom.maxBonds[self.element]


