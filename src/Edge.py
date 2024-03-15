class Edge:
    'A class representing an edge.'
    bonds = {
        '-': 1,
        '/': 1,
        '\\': 1,
        '=': 2,
        '#': 3,
        '$': 4
    } # An object mapping the bond type to the number of bonds.
    
    def __init__(self, sourceId: int, targetId: int, weight: int=1):
        'The constructor for the class Edge.'
        self.id = None
        self.sourceId = sourceId
        self.targetId = targetId
        self.weight = weight
        self.bondType = '-'
        self.isPartOfAromaticRing = False
        self.center = False
        self.wedge = ''

    def setBondType(self, bondType):
        'Set the bond type of this edge. This also sets the edge weight.'
        self.bondType = bondType
        self.weight = Edge.bonds[bondType]
