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
        f""" The constructor for the class Edge.
         {self.id: int} id The id of this edge.
         {self.sourceId: int} sourceId The id of the source vertex.
         {self.targetId: int} targetId The id of the target vertex.
         {self.weight: int} weight The weight of this edge. That is, the degree of the bond (single bond = 1, double bond = 2, etc).
         {self.bondType: str} [bondType='-'] The bond type of this edge.
         {self.isPartOfAromaticRing: bool} [isPartOfAromaticRing=false] Whether or not this edge is part of an aromatic ring.
         {self.center: bool} [center=false] Wheter or not the bond is centered. For example, this affects straight double bonds.
         {self.wedge: str} [wedge=''] Wedge direction. Either '', 'up' or 'down'
        """
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
