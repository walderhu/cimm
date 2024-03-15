from typing import List
from ArrayHelper import ArrayHelper
# from Vertex import Vertex
# from Ring import Ring



class Atom:
    'A class representing an atom.'

    # A map mapping element symbols to the atomic number.
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

    # A map mapping element symbols to their maximum bonds.
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

    # A map mapping element symbols to the atomic mass.
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

    def __init__(self, element: str, bondType: str='-'):
        f""" The constructor of the class Atom.
        {self.element: str} element The element symbol of this atom. Single-letter symbols are always uppercase. Examples: H, C, F, Br, Si, ...
        {self.drawExplicit: bool} drawExplicit A boolean indicating whether or not this atom is drawn explicitly (for example, a carbon atom). This overrides the default behaviour.
        {self.ringbonds: list} ringbonds An array containing the ringbond ids and bond types as specified in the original SMILE.
        {self.branchBond: str} branchBond The branch bond as defined in the SMILES.
        {self.ringbonds: List[int]} ringbonds[].id The ringbond id as defined in the SMILES.
        {self.ringbonds: List[str]} ringbonds[].bondType The bond type of the ringbond as defined in the SMILES.
        {self.rings: List[int]} rings The ids of rings which contain this atom.
        {self.bondType} bondType The bond type associated with this array. Examples: -, =, #, ...
        {self.isBridge: bool} isBridge A boolean indicating whether or not this atom is part of a bridge in a bridged ring (contained by the largest ring).
        {self.isBridgeNode: bool} isBridgeNode A boolean indicating whether or not this atom is a bridge node (a member of the largest ring in a bridged ring which is connected to a bridge-atom).
        {self.originalRings: List[int]} originalRings Used to back up rings when they are replaced by a bridged ring.
        {self.bridgedRing: int} bridgedRing The id of the bridged ring if the atom is part of a bridged ring.
        {self.anchoredRings: List[int]} anchoredRings The ids of the rings that are anchored to this atom. The centers of anchored rings are translated when this atom is translated.
        {self.bracket: Any} bracket If this atom is defined as a bracket atom in the original SMILES, this object contains all the bracket information. Example: (hcount: (Number), charge: ['--', '-', '+', '++'], isotope: (Number) ).
        {self.plane: int} plane Specifies on which "plane" the atoms is in stereochemical deptictions (-1 back, 0 middle, 1 front).
        {self.attachedPseudoElements: list} attachedPseudoElements A map with containing information for pseudo elements or concatinated elements. The key is comprised of the element symbol and the hydrogen count.
        {self.attachedPseudoElements: List[str]} attachedPseudoElement[].element The element symbol.
        {self.attachedPseudoElements: List[int]} attachedPseudoElement[].count The number of occurences that match the key.
        {self.attachedPseudoElements: List[int]} attachedPseudoElement[].hyrogenCount The number of hydrogens attached to each atom matching the key.
        {self.hasAttachedPseudoElements: bool} hasAttachedPseudoElements A boolean indicating whether or not this attom will be drawn with an attached pseudo element or concatinated elements.
        {self.isDrawn: bool} isDrawn A boolean indicating whether or not this atom is drawn. In contrast to drawExplicit, the bond is drawn neither.
        {self.isConnectedToRing: bool} isConnectedToRing A boolean indicating whether or not this atom is directly connected (but not a member of) a ring.
        {self.neighbouringElements: List[str]} neighbouringElements An array containing the element symbols of neighbouring atoms.
        {self.isPartOfAromaticRing: bool} isPartOfAromaticRing A boolean indicating whether or not this atom is part of an explicitly defined aromatic ring. Example: c1ccccc1.
        {self.bondCount: int} bondCount The number of bonds in which this atom is participating.
        {self.chirality: str} chirality The chirality of this atom if it is a stereocenter (R or S).
        {self.priority: int} priority The priority of this atom acording to the CIP rules, where 0 is the highest priority.
        {self.mainChain: bool} mainChain A boolean indicating whether or not this atom is part of the main chain (used for chirality).
        {self.hydrogenDirection: str} hydrogenDirection The direction of the hydrogen, either up or down. Only for stereocenters with and explicit hydrogen.
        {self.subtreeDepth: int} subtreeDepth The depth of the subtree coming from a stereocenter. """
        
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

    def addNeighbouringElement(self, element: str):
        'Adds a neighbouring element to this atom.'
        self.neighbouringElements.append(element)

    def attachPseudoElement(self, element, previousElement, hydrogenCount=0, charge=0):
        'Attaches a pseudo element (e.g. Ac) to the atom.'
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
        'Returns the attached pseudo elements sorted by hydrogen count (ascending).'
        ordered = {}
        for key in sorted(self.attachedPseudoElements.keys()):
            ordered[key] = self.attachedPseudoElements[key]
        return ordered

    def getAttachedPseudoElementsCount(self):
        'Returns the number of attached pseudo elements.'
        return len(self.attachedPseudoElements)

    def isHeteroAtom(self):
        'Returns whether this atom is a heteroatom (not C and not H).'
        return self.element not in ('C', 'H')

    def addAnchoredRing(self, ringId):
        'Defines this atom as the anchor for a ring. When doing repositionings of the vertices and the vertex associated with this atom is moved, the center of this ring is moved as well.'
        if not ArrayHelper.contains(self.anchoredRings, {'value': ringId}):
            self.anchoredRings.append(ringId)

    def getRingbondCount(self):
        'Returns the number of ringbonds (breaks in rings to generate the MST of the smiles) within this atom is connected to.'
        return len(self.ringbonds)

    def backupRings(self):
        'Backs up the current rings.'
        self.originalRings = self.rings[:]

    def restoreRings(self):
        'Restores the most recent backed up rings.'
        self.rings = self.originalRings[:]

    def haveCommonRingbond(self, atomA, atomB):
        'Checks whether or not two atoms share a common ringbond id. A ringbond is a break in a ring created when generating the spanning tree of a structure.'
        for ringbondA in atomA.ringbonds:
            for ringbondB in atomB.ringbonds:
                if ringbondA['id'] == ringbondB['id']:
                    return True
        return False

    def neighbouringElementsEqual(self, arr):
        'Check whether or not the neighbouring elements of this atom equal the supplied array.'
        if len(arr) != len(self.neighbouringElements):
            return False
        arr.sort()
        self.neighbouringElements.sort()
        for i in range(len(self.neighbouringElements)):
            if arr[i] != self.neighbouringElements[i]:
                return False
        return True

    def getAtomicNumber(self):
        'Get the atomic number of this atom.'
        return Atom.atomicNumbers[self.element]

    def getMaxBonds(self):
        'Get the maximum number of bonds for this atom.'
        return Atom.maxBonds[self.element]
