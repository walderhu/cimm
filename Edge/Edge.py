class Edge:
    bonds = {
        '-': 1,
        '/': 1,
        '\\': 1,
        '=': 2,
        '#': 3,
        '$': 4
    }

    def __init__(self, sourceId, targetId, weight=1):
        self.id = None
        self.sourceId = sourceId
        self.targetId = targetId
        self.weight = weight
        self.bondType = '-'
        self.isPartOfAromaticRing = False
        self.center = False
        self.wedge = ''

    def setBondType(self, bondType):
        self.bondType = bondType
        self.weight = Edge.bonds[bondType]

