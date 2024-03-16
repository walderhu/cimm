from Ring import Ring
from Vertex import Vertex
from typing import List, Set

class RingConnection:
    def __init__(self, firstRing, secondRing):
        self.id = None
        self.firstRingId = firstRing.id
        self.secondRingId = secondRing.id
        self.vertices = set()
        for m in firstRing.members:
            for n in secondRing.members:
                if m == n:
                    self.addVertex(m)
    
    def addVertex(self, vertexId):
        self.vertices.add(vertexId)
    
    def updateOther(self, ringId, otherRingId):
        if self.firstRingId == otherRingId:
            self.secondRingId = ringId
        else:
            self.firstRingId = ringId
    
    def containsRing(self, ringId):
        return self.firstRingId == ringId or self.secondRingId == ringId
    
    def isBridge(self, vertices):
        if len(self.vertices) > 2:
            return True
        for vertexId in self.vertices:
            if len(vertices[vertexId].value.rings) > 2:
                return True
        return False
    
    @staticmethod
    def isBridge(ringConnections, vertices, firstRingId, secondRingId):
        for ringConnection in ringConnections:
            if (ringConnection.firstRingId == firstRingId and ringConnection.secondRingId == secondRingId) or \
               (ringConnection.firstRingId == secondRingId and ringConnection.secondRingId == firstRingId):
                return ringConnection.isBridge(vertices)
        return False
    
    @staticmethod
    def getNeighbours(ringConnections, ringId):
        neighbours = []
        for ringConnection in ringConnections:
            if ringConnection.firstRingId == ringId:
                neighbours.append(ringConnection.secondRingId)
            elif ringConnection.secondRingId == ringId:
                neighbours.append(ringConnection.firstRingId)
        return neighbours
    
    @staticmethod
    def getVertices(ringConnections, firstRingId, secondRingId):
        for ringConnection in ringConnections:
            if (ringConnection.firstRingId == firstRingId and ringConnection.secondRingId == secondRingId) or \
               (ringConnection.firstRingId == secondRingId and ringConnection.secondRingId == firstRingId):
                return list(ringConnection.vertices)


