from MathHelper import MathHelper
from Vector2 import Vector2
from Vertex import Vertex
from Edge import Edge
from Ring import Ring
from Atom import Atom

from math import sin, cos, pow, sqrt
from typing import List, Dict, Any, Callable, Final, Union


class Graph:
    """A class representing the molecular graph. 
vertices The vertices of the graph.
edges The edges of this graph.
atomIdxToVertexId A map mapping atom indices to vertex ids.
vertexIdsToEdgeId A map mapping vertex ids to the edge between the two vertices. The key is defined as vertexAId + '_' + vertexBId.
isometric A boolean indicating whether or not the SMILES associated with this graph is isometric."""

    def __init__(self, parseTree: Any, isomeric: bool = False) -> None:
        'The constructor of the class Graph.'
        self.vertices = []
        self.edges = []
        self.atomIdxToVertexId = []
        self.vertexIdsToEdgeId = {}
        self.isomeric = isomeric
        self._atomIdx = 0
        self._time = 0
        self.__init(parseTree)

    def __init(self, node: 'Graph', order: float = 0, parent_vertex_id: float = None, is_branch: bool = False):
        'Create a new vertex object'
        element: Final = node['atom']['element'] if 'element' in node['atom'] else node['atom']
        atom = Atom(element, node['bond'])
        if element != 'H' or (not node['hasNext'] and parent_vertex_id is None):
            atom.idx = self._atomIdx
            self._atomIdx += 1

        atom.branchBond = node.branchBond
        atom.ringbonds = node.ringbonds
        atom.bracket = node['atom']['element'] if 'element' in node['atom'] else None
        atom.class_ = node['atom']['class']
        vertex = Vertex(atom)
        parent_vertex = self.vertices[parent_vertex_id] if parent_vertex_id is not None else None
        self.add_vertex(vertex)
        if atom.idx is not None:
            self.atom_idx_to_vertex_id.append(vertex.id)
        if parent_vertex_id is not None:
            vertex.set_parent_vertex_id(parent_vertex_id)
            vertex.value.add_neighbouring_element(parent_vertex.value.element)
            parent_vertex.add_child(vertex.id)
            parent_vertex.value.add_neighbouring_element(atom.element)
            parent_vertex.spanning_tree_children.append(vertex.id)
            edge = Edge(parent_vertex_id, vertex.id, 1)
            vertex_id = None
            if is_branch:
                edge.set_bond_type(vertex.value.branch_bond or '-')
                vertex_id = vertex.id
            else:
                edge.set_bond_type(parent_vertex.value.bond_type or '-')
                vertex_id = parent_vertex.id
            edge_id = self.add_edge(edge)
        offset = node['ringbondCount'] + 1
        if atom.bracket:
            offset += atom.bracket['hcount']
        stereo_hydrogens = 0
        if atom.bracket and 'chirality' in atom.bracket:
            atom.is_stereo_center = True
            stereo_hydrogens = atom.bracket['hcount']
            for i in range(stereo_hydrogens):
                self.__init({
                    'atom': 'H',
                    'isBracket': False,
                    'branches': [],
                    'branchCount': 0,
                    'ringbonds': [],
                    'ringbondCount': False,
                    'next': None,
                    'hasNext': False,
                    'bond': '-'
                }, i, vertex.id, True)
        for i in range(node['branchCount']):
            self.__init(node['branches'][i], i + offset, vertex.id, True)
        if node['hasNext']:
            self.__init(node['next'], node['branchCount'] + offset, vertex.id)

    def clear(self):
        'Clears all the elements in this graph (edges and vertices).'
        self.vertices = []
        self.edges = []
        self.vertexIdsToEdgeId = {}

    def addVertex(self, vertex: 'Vertex') -> float:
        'Add a vertex to the graph.'
        vertex.id = len(self.vertices)
        self.vertices.append(vertex)
        return vertex.id

    def addEdge(self, edge: 'Edge') -> float:
        'Add an edge to the graph.'
        source = self.vertices[edge.sourceId]
        target = self.vertices[edge.targetId]
        edge.id = len(self.edges)
        self.edges.append(edge)

        self.vertexIdsToEdgeId[f'{edge.sourceId}_{edge.targetId}'] = edge.id
        self.vertexIdsToEdgeId[f'{edge.targetId}_{edge.sourceId}'] = edge.id

        edge.isPartOfAromaticRing = source.value.isPartOfAromaticRing and target.value.isPartOfAromaticRing

        source.value.bondCount += edge.weight
        target.value.bondCount += edge.weight

        source.edges.append(edge.id)
        target.edges.append(edge.id)

        return edge.id

    def getEdge(self, vertexIdA: float, vertexIdB: float) -> Union['Edge', None]:
        'Returns the edge between two given vertices.'
        edgeId = self.vertexIdsToEdgeId[f'{vertexIdA}_{vertexIdB}']
        return None if edgeId is None else self.edges[edgeId]

    def hasEdge(self, vertexIdA: float, vertexIdB: float) -> bool:
        'Check whether or not two vertices are connected by an edge.'
        return self.vertexIdsToEdgeId[f'{vertexIdA}_{vertexIdB}'] is not None

    def getVertexList(self) -> List[float]:
        'Returns an array containing the vertex ids of this graph.'
        return [elem.id for elem in self.vertices]

    def getEdgeList(self) -> List[List[float]]:
        'Returns an array containing source, target arrays of this graphs edges.'
        return [[elem.sourceId, elem.targetId] for elem in self.edges]

    def getAdjacencyMatrix(self) -> List[List[int]]:
        'Get the adjacency matrix of the graph.'
        length = len(self.vertices)
        adjacencyMatrix = [[0] * length for _ in range(length)]
        for edge in self.edges:
            adjacencyMatrix[edge.sourceId][edge.targetId] = 1
            adjacencyMatrix[edge.targetId][edge.sourceId] = 1
        return adjacencyMatrix

    def getComponentsAdjacencyMatrix(self) -> List[List[int]]:
        """Get the adjacency matrix of the graph with all bridges removed (thus the components).
        Thus the remaining vertices are all part of ring systems."""
        adjacencyMatrix = self.getAdjacencyMatrix()
        for bridge in self.getBridges():
            adjacencyMatrix[bridge[0]][bridge[1]] = 0
            adjacencyMatrix[bridge[1]][bridge[0]] = 0
        return adjacencyMatrix



    def getSubgraphAdjacencyMatrix(self, vertexIds: List[int]) -> List[List[int]]:
        'Get the adjacency matrix of a subgraph.'
        adjacencyMatrix = [[1 if i != j and self.hasEdge(sourceId, targetId) else 0
                            for i, sourceId in enumerate(vertexIds)]
                           for j, targetId in enumerate(vertexIds)]
        return adjacencyMatrix
    #реализация с вложенным генератором мне нравится больше, но если читабельность плохая, можно оставить ориг идею
    # def getSubgraphAdjacencyMatrix(self, vertexIds: List[int]) -> List[List[int]]:
    #     'Get the adjacency matrix of a subgraph.'
    #     length = len(vertexIds)
    #     adjacencyMatrix = [[0] * length for _ in range(length)]
    #     for i, sourceId in enumerate(vertexIds):
    #         for j, targetId in enumerate(vertexIds):
    #             if i != j and self.hasEdge(sourceId, targetId):
    #                 adjacencyMatrix[i][j] = 1
    #     return adjacencyMatrix

    def getDistanceMatrix(self) -> List[List[int]]:
        """Get the distance matrix of the graph. Floyd-Warshall algorithm for
calculating the distance matrix between all pairs of vertices in a graph"""
        length = len(self.vertices)
        adja = self.getAdjacencyMatrix()
        dist = [[1 if adja[i][j] == 1 else None for i in range(length)]\
            for j in range(length)]
        for k in range(length):
            for i in range(length):
                for j in range(length):
                    if dist[i][j] > dist[i][k] + dist[k][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]
        return dist

    def getSubgraphDistanceMatrix(self, vertexIds: List[float]) -> List[List[int]]:
        'Get the distance matrix of a subgraph.'
        length = len(vertexIds)
        adja = self.getSubgraphAdjacencyMatrix(vertexIds)
        dist = [[1 if adja[i][j] == 1 else None for i in range(
            length)] for j in range(length)]
        for k in range(length):
            for i in range(length):
                for j in range(length):
                    if dist[i][j] > dist[i][k] + dist[k][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]
        return dist

    def getAdjacencyList(self) -> List[List[int]]:
        'Get the adjacency list of the graph.'
        length = len(self.vertices)
        adjacencyList = [[] for _ in range(length)]
        for i in range(length):
            for j in range(length):
                if i != j and self.hasEdge(self.vertices[i].id, self.vertices[j].id):
                    adjacencyList[i].append(j)
        return adjacencyList

    #   читабельность в таком подходе будет храмать, поэтому оставил вложенный цикл
    # def getAdjacencyList(self) -> List[List[int]]:
    #     'Get the adjacency list of the graph.'
    #     length = len(self.vertices)
    #     return [[j for i in range(length) if i != j and self.hasEdge(self.vertices[i].id, self.vertices[j].id)] for j in range(length)]
    

    def getSubgraphAdjacencyList(self, vertexIds: List[float]) -> List[List[int]]:
        'Get the adjacency list of a subgraph.'
        length = len(vertexIds)
        adjacencyList = [[] for _ in range(length)]
        for i in range(length):
            for j in range(length):
                if i != j and self.hasEdge(vertexIds[i], vertexIds[j]):
                    adjacencyList[i].append(j)
        return adjacencyList
        
    def getBridges(self) -> List[float]:
        length = len(self.vertices)
        outBridges, disc, low = [], [], []
        visited = [False] * length
        parent = [None] * length   
        adj = self.getAdjacencyList()
        self._time = 0
        for i in range(length):
            if visited[i] is False:
                self._bridgeDfs(i, visited, disc, low, parent, adj, outBridges)
        return outBridges

    def traverseBF(self, startVertexId: float, callback: Callable) -> None:
        'Traverses the graph in breadth-first order.'
        length = len(self.vertices)
        visited = [False] * length
        queue = [startVertexId]
        while len(queue):
            u = queue.pop(0)
            vertex = self.vertices[u]
            callback(vertex)
            for neighbour in vertex.neighbours:
                if visited[neighbour] is False:
                    visited[neighbour] = True
                    queue.append(neighbour)
                    
    def getTreeDepth(self, vertexId: float, parentVertexId: float) -> int:
        'Get the depth of a subtree in the direction opposite to the vertex specified as the parent vertex.'
        if vertexId is None or parentVertexId is None:
            return 0
        neighbours = self.vertices[vertexId].getSpanningTreeNeighbours(parentVertexId)
        if not neighbours:
            return 1
        return 1 + max(self.getTreeDepth(childId, vertexId) for childId in neighbours)

    # изначальная версия, но мне кажется моя реализация намного питоничнее
    # def getTreeDepth(self, vertexId: float, parentVertexId: float) -> int:
    #     'Get the depth of a subtree in the direction opposite to the vertex specified as the parent vertex.'
    #     if vertexId is None or parentVertexId is None:
    #         return 0
    #     neighbours = self.vertices[vertexId].getSpanningTreeNeighbours(parentVertexId)
    #     max = 0
    #     for childId in neighbours:
    #         d = self.getTreeDepth(childId, vertexId)
    #         if d > max:
    #             max = d
    #     return max + 1
    
    
    def traverseTree(self, vertexId: float, parentVertexId: float, callback: Callable,\
        maxDepth: int = 999999, ignoreFirst: bool=False, depth: float=1,\
            visited: List[int]=None) -> None:
        'Traverse a sub-tree in the graph.'
        if visited is None:
            vesited = []
        if (depth > maxDepth + 1) or visited[vertexId] == 1:
            return
        visited[vertexId] = 1
        vertex = self.vertices[vertexId]
        neighbours = vertex.getNeighbours(parentVertexId)
        if ignoreFirst is False or depth > 1:
            callback(vertex)
        for neighbour in neighbours:
            self.traverseTree(neighbour, vertexId, callback, maxDepth, ignoreFirst, depth + 1, visited)

    def kkLayout(self, vertexIds: List[float], center: 'Vector2', startVertexId: float, ring: 'Ring', bondLength,
            threshold = 0.1, innerThreshold = 0.1, maxIteration = 2000,
            maxInnerIteration = 50, maxEnergy = 1e9):
        """ Positiones the (sub)graph using Kamada and Kawais algorithm for drawing general undirected graphs.
        https://pdfs.semanticscholar.org/b8d3/bca50ccc573c5cb99f7d201e8acce6618f04.pdf
        There are undocumented layout parameters. They are undocumented for a reason, so be very careful."""
        edgeStrength = bondLength
        length = len(vertexIds)
        matDist = self.getSubgraphDistanceMatrix(vertexIds)
        radius = MathHelper.polyCircumradius(500, length)
        angle = MathHelper.centralAngle(length)
        a = 0.0
        arrPositionX, arrPositionY = [0.0] * length, [0.0] * length
        arrPositioned = [False] * length    

        for i in range(length):
            vertex = self.vertices[vertexIds[i]]
            if not vertex.positioned:
                arrPositionX[i] = center.x + cos(a) * radius
                arrPositionY[i] = center.y + sin(a) * radius
            else:
                arrPositionX[i] = vertex.position.x
                arrPositionY[i] = vertex.position.y
            arrPositioned[i] = vertex.positioned
            a += angle

        matLength = [[bondLength * matDist[i][j] for j in range(length)] for i in range(length)]
        matStrength = [[edgeStrength * matDist[i][j] ** -2.0 for j in range(length)] for i in range(length)]
        matEnergy = [[0.0] * length for _ in range(length)]
        arrEnergySumX = [0.0] * length
        arrEnergySumY = [0.0] * length

        for i in range(length):
            ux, uy = arrPositionX[i], arrPositionY[i]
            dEx, dEy = 0.0, 0.0
            for j in range(length):
                if i != j:
                    vx, vy = arrPositionX[j], arrPositionY[j]
                    denom = 1.0 / sqrt((ux - vx) ** 2 + (uy - vy) ** 2)
                    matEnergy[i][j] = [
                        matStrength[i][j] * ((ux - vx) - matLength[i][j] * (ux - vx) * denom),
                        matStrength[i][j] * ((uy - vy) - matLength[i][j] * (uy - vy) * denom)
                    ]
                    matEnergy[j][i] = matEnergy[i][j]
                    dEx += matEnergy[i][j][0]
                    dEy += matEnergy[i][j][1]
            arrEnergySumX[i], arrEnergySumY[i] = dEx, dEy
            
        maxEnergyId, iteration, innerIteration = 0, 0, 0
        dEX, dEY, delta = 0.0, 0.0, 0.0

        while maxEnergy > threshold and maxIteration > iteration:
            iteration += 1
            maxEnergyId, maxEnergy, dEX, dEY = self.__highestEnergy(length, arrEnergySumX, arrEnergySumY, arrPositioned)
            delta = maxEnergy
            innerIteration = 0

            while delta > innerThreshold and maxInnerIteration > innerIteration:
                innerIteration += 1
                self.__update(maxEnergyId, dEX, dEY, arrPositionX, arrPositionY, matLength, matStrength, length, matEnergy, arrEnergySumX, arrEnergySumY)
                delta, dEX, dEY = self.__energy(maxEnergyId, arrEnergySumX, arrEnergySumY)

        for i in range(length):
            index = vertexIds[i]
            vertex = self.vertices[index]
            vertex.position.x, vertex.position.y = arrPositionX[i], arrPositionY[i]
            vertex.positioned, vertex.forcePositioned = True, True

    @staticmethod
    def __energy(index, arrEnergySumX, arrEnergySumY):
        'auxiliary function for kkLayout'
        return [arrEnergySumX[index] * arrEnergySumX[index] + arrEnergySumY[index] * arrEnergySumY[index], arrEnergySumX[index], arrEnergySumY[index]]

    @classmethod
    def __highestEnergy(cls, length, arrEnergySumX, arrEnergySumY, arrPositioned):
        'auxiliary function for kkLayout'
        maxEnergy, maxEnergyId, maxDEX, maxDEY = 0.0, 0, 0.0, 0.0
        for i in range(length):
            delta, dEX, dEY = cls.__energy(index=i, arrEnergySumX= arrEnergySumX, arrEnergySumY=arrEnergySumY)
            if delta > maxEnergy and arrPositioned[i] == False:
                maxEnergy = delta
                maxEnergyId = i
                maxDEX, maxDEY = dEX, dEY
        return maxEnergyId, maxEnergy, maxDEX, maxDEY

    @staticmethod
    def __update(index, dEX, dEY, arrPositionX, arrPositionY, matLength, matStrength, length, matEnergy, arrEnergySumX, arrEnergySumY):
        'auxiliary function for kkLayout'
        dxx, dyy, dxy= 0.0, 0.0, 0.0
        ux, uy = arrPositionX[index], arrPositionY[index]
        arrL = matLength[index]
        arrK = matStrength[index]
        
        for i in range(length):
            if i != index:
                vx, vy = arrPositionX[i], arrPositionY[i]
                l, k = arrL[i], arrK[i]
                m = (ux - vx) * (ux - vx)
                denom = 1.0 / ((m + (uy - vy) * (uy - vy)) ** 1.5)
                dxx += k * (1 - l * (uy - vy) * (uy - vy) * denom)
                dyy += k * (1 - l * m * denom)
                dxy += k * (l * (ux - vx) * (uy - vy) * denom)

        dxx = 0.1 if dxx == 0 else dxx
        dyy = 0.1 if dyy == 0 else dyy
        dxy = 0.1 if dxy == 0 else dxy
        dy = (dEX / dxx + dEY / dxy) / (dxy / dxx - dyy / dxy)
        dx = -(dxy * dy + dEX) / dxx
        arrPositionX[index] += dx
        arrPositionY[index] += dy
        arrE = matEnergy[index]
        dEX, dEY = 0.0, 0.0
        ux, uy = arrPositionX[index], arrPositionY[index]

        for i in range(length):
            if index != i:
                vx, vy = arrPositionX[i], arrPositionY[i]
                prevEx, prevEy = arrE[i][0], arrE[i][1]
                denom = 1.0 / sqrt((ux - vx) * (ux - vx) + (uy - vy) * (uy - vy))
                dx = arrK[i] * ((ux - vx) - arrL[i] * (ux - vx) * denom)
                dy = arrK[i] * ((uy - vy) - arrL[i] * (uy - vy) * denom)
                arrE[i] = [dx, dy]
                dEX += dx
                dEY += dy
                arrEnergySumX[i] += dx - prevEx
                arrEnergySumY[i] += dy - prevEy

        arrEnergySumX[index], arrEnergySumY[index] = dEX, dEY