from typing import List
from MathHelper import MathHelper
from ArrayHelper import ArrayHelper
from Vector2 import Vector2
from Atom import Atom

class Vertex:
    """ A class representing a vertex.
- id The id of this vertex.
- value The atom associated with this vertex.
- position The position of this vertex.
- previousPosition The position of the previous vertex.
- parentVertexId The id of the previous vertex.
- children The ids of the children of this vertex.
- spanningTreeChildren The ids of the children of this vertex as defined in the spanning tree defined by the SMILES.
- edges The ids of edges associated with this vertex.
- positioned A boolean indicating whether or not this vertex has been positioned.
- angle The angle of this vertex.
- dir The direction of this vertex.
- neighbourCount The number of neighbouring vertices.
- neighbours The vertex ids of neighbouring vertices.
- neighbouringElements The element symbols associated with neighbouring vertices.
- forcePositioned A boolean indicating whether or not this vertex was positioned using a force-based approach."""

    def __init__(self, value: 'Atom', x: float = 0, y: float = 0) -> None:
        'The constructor for the class Vertex.'
        self.id = None
        self.value = value
        self.position = Vector2(x or 0, y or 0)
        self.previousPosition = Vector2(0, 0)
        self.parentVertexId = None
        self.children = []
        self.spanningTreeChildren = []
        self.edges = []
        self.positioned = False
        self.angle = None
        self.dir = 1.0
        self.neighbourCount = 0
        self.neighbours = []
        self.neighbouringElements = []
        self.forcePositioned = False


    def setPosition(self, x: float, y: float) -> None:
        'Set the 2D coordinates of the vertex.'
        self.position.x = x
        self.position.y = y

    def setPositionFromVector(self, v: 'Vector2') -> None:
        'Set the 2D coordinates of the vertex from a Vector2.'
        self.position.x = v.x
        self.position.y = v.y

    def addChild(self, vertexId: float) -> None:
        'Add a child vertex id to this vertex.'
        self.children.append(vertexId)
        self.neighbours.append(vertexId)
        self.neighbourCount += 1

    def addRingbondChild(self, vertexId: float, ringbondIndex: float) -> None:
        """Add a child vertex id to this vertex as the second child of the neighbours array,
except this vertex is the first vertex of the SMILE string, then it is added as the first.
This is used to get the correct ordering of neighbours for parity calculations.
If a hydrogen is implicitly attached to the chiral center, insert as the third child."""
        self.children.append(vertexId)
        if self.value.bracket:
            index = 1
            if self.id == 0 and self.value.bracket.hcount == 0:
                index = 0
            if self.value.bracket.hcount == 1 and ringbondIndex == 0:
                index = 2
            if self.value.bracket.hcount == 1 and ringbondIndex == 1:
                if len(self.neighbours) < 3:
                    index = 2
                else:
                    index = 3
            if self.value.bracket.hcount is None and ringbondIndex == 0:
                index = 1
            if self.value.bracket.hcount is None and ringbondIndex == 1:
                if len(self.neighbours) < 3:
                    index = 1
                else:
                    index = 2
            self.neighbours.insert(index, vertexId)
        else:
            self.neighbours.append(vertexId)
        self.neighbourCount += 1

    def setParentVertexId(self, parentVertexId: float) -> None:
        'Set the vertex id of the parent.'
        self.neighbourCount += 1
        self.parentVertexId = parentVertexId
        self.neighbours.append(parentVertexId)

    def isTerminal(self) -> bool:
        """Returns true if this vertex is terminal (has no parent or child vertices),
otherwise returns false. Always returns true if associated value 
has property hasAttachedPseudoElements set to true."""
        if self.value.hasAttachedPseudoElements:
            return True
        return (self.parentVertexId == None and len(self.children) < 2) or len(self.children) == 0

    def clone(self) -> 'Vertex':
        'Clones this vertex and returns the clone.'
        clone = Vertex(self.value, self.position.x, self.position.y)
        clone.id = self.id
        clone.previousPosition = Vector2(self.previousPosition.x, self.previousPosition.y)
        clone.parentVertexId = self.parentVertexId
        clone.children = ArrayHelper.clone(self.children)
        clone.spanningTreeChildren = ArrayHelper.clone(self.spanningTreeChildren)
        clone.edges = ArrayHelper.clone(self.edges)
        clone.positioned = self.positioned
        clone.angle = self.angle
        clone.forcePositioned = self.forcePositioned
        return clone

    def equals(self, vertex: 'Vertex') -> bool:
        'Returns true if this vertex and the supplied vertex both have the same id, else returns false.'
        return self.id == vertex.id

    def getAngle(self, referenceVector: 'Vector2'=None, returnAsDegrees: bool=False) -> float:
        """Returns the angle of this vertexes positional vector. 
    If a reference vector is supplied in relations to this vector, else in relations to the coordinate system."""
        if not referenceVector:
            u = Vector2.subtract(self.position, self.previousPosition)
        else:
            u = Vector2.subtract(self.position, referenceVector)
        if returnAsDegrees:
            return MathHelper.toDeg(u.angle())
        return u.angle()

    def getTextDirection(self, vertices: List['Vertex'], onlyHorizontal: bool=False) -> str:
        'Returns the suggested text direction when text is added at the position of this vertex.'
        neighbours = self.get_drawn_neighbours(vertices)
        angles = [self.get_angle(vertices[neighbour].position) for neighbour in neighbours]
        textAngle = MathHelper.mean_angle(angles)
        if len(vertices) == 1:
            return 'right'
        elif self.isTerminal() or onlyHorizontal:
            if round(textAngle * 100) / 100 == 1.57:
                textAngle -= 0.2
            textAngle = round(round(textAngle / MathHelper.PI) * MathHelper.PI)
        else:
            halfPi = MathHelper.PI / 2.0
            textAngle = round(round(textAngle / halfPi) * halfPi)

        if textAngle == 2:
            return 'down'
        elif textAngle == -2:
            return 'up'
        elif textAngle in (-0, 0):
            return 'right'
        elif textAngle in (-3, 3):
            return 'left'
        else:
            return 'down'

    def getNeighbours(self, vertexId: float=None) -> List[float]:
        'Returns an array of ids of neighbouring vertices.'
        return self.neighbours.copy() if vertexId == None else [elem for elem in self.neighbours if elem != vertexId]

    def getDrawnNeighbours(self, vertices: List['Vertex']) -> List[float]:
        'Returns an array of ids of neighbouring vertices that will be drawn (vertex.value.isDrawn is True).'
        return [self.neighbours[i] for i in range(len(self.neighbours)) if vertices[self.neighbours[i]].value.isDrawn]

    def getNeighbourCount(self) -> int:
        'Returns the number of neighbours of this vertex.'
        return self.neighbourCount

    def getSpanningTreeNeighbours(self, vertexId: float=None) -> List[float]:
        'Returns a list of ids of vertices neighbouring this one in the original spanning tree, excluding the ringbond connections.'
        neighbours = [elem for elem in self.spanningTreeChildren if (vertexId is None) or (elem != vertexId)]
        if (self.parentVertexId is not None) and ((vertexId is None) or (vertexId != self.parentVertexId)):
            neighbours.append(self.parentVertexId)
        return neighbours

    def get_next_in_ring(self, vertices: List['Vertex'], ring_id: float, previous_vertex_id: float) -> float:
        'Gets the next vertex in the ring in opposide direction to the supplied vertex id.'
        for neighbour in self.getNeighbours():
            if ring_id in vertices[neighbour].value.rings and neighbour != previous_vertex_id:
                return neighbour
        else:
            return None
