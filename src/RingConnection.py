from Ring import Ring
from Vertex import Vertex
from typing import List, Set


class RingConnection:
    """A class representing a ring connection.
id The id of this ring connection.
firstRingId A ring id.
secondRingId A ring id.
vertices A set containing the vertex ids participating in the ring connection."""

    def __init__(self, firstRing: 'Ring', secondRing: 'Ring') -> None:
        'The constructor for the class RingConnection.'
        self.id = None
        self.firstRingId = firstRing.id
        self.secondRingId = secondRing.id
        self.vertices = set()
        [self.addVertex(m) for m in firstRing.members\
          for n in secondRing.members if m == n]

    def addVertex(self, vertexId: float) -> None:
        'Adding a vertex to the ring connection.'
        self.vertices.add(vertexId)

    def updateOther(self, ringId: float, otherRingId: float) -> None:
        'Update the ring id of this ring connection that is not the ring id supplied as the second argument.'
        if self.firstRingId == otherRingId:
            self.secondRingId = ringId
        else:
            self.firstRingId = ringId

    def containsRing(self, ringId: float) -> bool:
        'Returns a boolean indicating whether or not a ring with a given id is participating in this ring connection.'
        return self.firstRingId == ringId or self.secondRingId == ringId

    def isBridge(self, vertices: List['Vertex']) -> bool:
        'Checks whether or not this ring connection is a bridge in a bridged ring.'
        if len(self.vertices) > 2:
            return True
        for vertexId in self.vertices:
            if len(vertices[vertexId].value.rings) > 2:
                return True
        else:
            return False

    @staticmethod
    def isBridge(ringConnections: List['RingConnection'], vertices: List['Vertex'], firstRingId: float, secondRingId: float) -> bool:
        'Checks whether or not two rings are connected by a bridged bond.'
        for ringConnection in ringConnections:
            if (ringConnection.firstRingId == firstRingId and ringConnection.secondRingId == secondRingId) or \
               (ringConnection.firstRingId == secondRingId and ringConnection.secondRingId == firstRingId):
                return ringConnection.isBridge(vertices)
        return False

    @staticmethod
    def getNeighbours(ringConnections: List['RingConnection'], ringId: float) -> List[float]:
        'Retruns the neighbouring rings of a given ring.'
        neighbours = []
        for ringConnection in ringConnections:
            if ringConnection.firstRingId == ringId:
                neighbours.append(ringConnection.secondRingId)
            elif ringConnection.secondRingId == ringId:
                neighbours.append(ringConnection.firstRingId)
        return neighbours

    @staticmethod
    def getVertices(ringConnections: List['RingConnection'], firstRingId: float, secondRingId: float) -> List[float]:
        'Returns an array of vertex ids associated with a given ring connection.'
        for ringConnection in ringConnections:
            if (ringConnection.firstRingId == firstRingId and ringConnection.secondRingId == secondRingId) or \
               (ringConnection.firstRingId == secondRingId and ringConnection.secondRingId == firstRingId):
                return list(ringConnection.vertices)
