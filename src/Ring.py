from math import pi
from ArrayHelper import ArrayHelper
from Vector2 import Vector2
from Vertex import Vertex
from RingConnection import RingConnection
from typing import List, Callable


class Ring:
    """A class representing a ring.
id The id of this ring.
members An array containing the vertex ids of the ring members.
edges An array containing the edge ids of the edges between the ring members.
insiders An array containing the vertex ids of the vertices contained within the ring if it is a bridged ring.
neighbours An array containing the ids of neighbouring rings.
positioned A boolean indicating whether or not this ring has been positioned.
center The center of this ring.
rings The rings contained within this ring if this ring is bridged.
isBridged A boolean whether or not this ring is bridged.
isPartOfBridged A boolean whether or not this ring is part of a bridge ring.
isSpiro A boolean whether or not this ring is part of a spiro.
isFused A boolean whether or not this ring is part of a fused ring.
centralAngle The central angle of this ring.
canFlip A boolean indicating whether or not this ring allows flipping of attached vertices to the inside of the ring."""

    def __init__(self, members: List[float]) -> None:
        'The constructor for the class Ring.'
        self.id = None
        self.members = members
        self.edges = []
        self.insiders = []
        self.neighbours = []
        self.positioned = False
        self.center = Vector2(0, 0)
        self.rings = []
        self.isBridged = False
        self.isPartOfBridged = False
        self.isSpiro = False
        self.isFused = False
        self.centralAngle = 0.0
        self.canFlip = True

    def clone(self) -> 'Ring':
        'Clones this ring and returns the clone.'
        clone = Ring(self.members)
        clone.id = self.id
        clone.insiders = ArrayHelper.clone(self.insiders)
        clone.neighbours = ArrayHelper.clone(self.neighbours)
        clone.positioned = self.positioned
        clone.center = self.center.clone()
        clone.rings = ArrayHelper.clone(self.rings)
        clone.isBridged = self.isBridged
        clone.isPartOfBridged = self.isPartOfBridged
        clone.isSpiro = self.isSpiro
        clone.isFused = self.isFused
        clone.centralAngle = self.centralAngle
        clone.canFlip = self.canFlip
        return clone

    def get_size(self) -> int:
        'Returns the size (number of members) of this ring.'
        return len(self.members)

    def get_polygon(self, vertices: List['Vertex']) -> List['Vector2']:
        'Gets the polygon representation (an array of the ring-members positional vectors) of this ring.'
        return [vertices[member].position for member in self.members]

    def getAngle(self) -> float:
        'Returns the angle of this ring in relation to the coordinate system.'
        return pi - self.centralAngle

    def each_member(self, vertices: List['Vertex'], callback: Callable, startVertexId: float = None, previousVertexId: float = None) -> None:
        'Loops over the members of this ring from a given start position in a direction opposite to the vertex id passed as the previousId.'
        if startVertexId in (None, 0):
            startVertexId = self.members[0]
        current = startVertexId
        max_iter = 0
        while (current is not None) and (max_iter < 100):
            prev = current
            callback(prev)
            current = vertices[current].get_next_in_ring(
                vertices, self.id, previousVertexId)
            previousVertexId = prev
            if current == startVertexId:
                current = None
            max_iter += 1

    def get_ordered_neighbours(self, ringConnections: List['RingConnection']) -> List[dict]:
        'Returns an array containing the neighbouring rings of this ring ordered by ring size.'
        orderedNeighbours = [None] * len(self.neighbours)
        for i, neighbour in enumerate(self.neighbours):
            vertices = RingConnection.get_vertices(
                ringConnections, self.id, neighbour)
            orderedNeighbours[i] = {
                'n': len(vertices),
                'neighbour': neighbour
            }
        orderedNeighbours.sort(key=lambda x: x['n'], reverse=True)
        return orderedNeighbours

    def is_benzene_like(self, vertices: List['Vertex']) -> bool:
        'Check whether this ring is an implicitly defined benzene-like (e.g. C1=CC=CC=C1) with 6 members and 3 double bonds.'
        db = self.get_double_bond_count(vertices)
        length = len(self.members)
        return (db == 3 and length == 6) or (db == 2 and length == 5)

    def get_double_bond_count(self, vertices: List['Vertex']) -> int:
        'Get the number of double bonds inside this ring.'
        return sum(1 for i in self.members if '=' in (vertices[i].value.bondType, vertices[i].value.branchBond))

    def contains(self, vertexId: float) -> bool:
        'Checks whether or not this ring contains a member with a given vertex id.'
        return vertexId in self.members
