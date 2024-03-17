from MathHelper import MathHelper
from Vector2 import Vector2
from Vertex import Vertex
from Edge import Edge
from Ring import Ring
from Atom import Atom

from typing import List, Dict, Any, Callable, Final, Union

class Graph:
    """A class representing the molecular graph. 
vertices The vertices of the graph.
edges The edges of this graph.
atomIdxToVertexId A map mapping atom indices to vertex ids.
vertexIdsToEdgeId A map mapping vertex ids to the edge between the two vertices. The key is defined as vertexAId + '_' + vertexBId.
isometric A boolean indicating whether or not the SMILES associated with this graph is isometric."""

    def __init__(self, parseTree: Any, isomeric:bool=False) -> None:
        'The constructor of the class Graph.'
        self.vertices = []
        self.edges = []
        self.atomIdxToVertexId = []
        self.vertexIdsToEdgeId = {}
        self.isomeric = isomeric
        self._atomIdx = 0
        self._time = 0
        self.__init(parseTree)
    
    def __init(self, node: 'Graph', order: float=0, parent_vertex_id: float=None, is_branch: bool=False):
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
    
    # def getSubgraphAdjacencyMatrix(self, vertexIds: List[int]) -> List[List[int]]:
    #     'Get the adjacency matrix of a subgraph.'
    #     length = len(vertexIds)
    #     adjacencyMatrix = [[0] * length for _ in range(length)]
    #     for i, sourceId in enumerate(vertexIds):
    #         for j, targetId in enumerate(vertexIds):
    #             if i != j and self.hasEdge(sourceId, targetId):
    #                 adjacencyMatrix[i][j] = 1
    #     return adjacencyMatrix

    def getSubgraphAdjacencyMatrix(self, vertexIds: List[int]) -> List[List[int]]:
        'Get the adjacency matrix of a subgraph.'
        adjacencyMatrix = [[1 if i != j and self.hasEdge(sourceId, targetId) else 0\
            for i, sourceId in enumerate(vertexIds)]\
                for j, targetId in enumerate(vertexIds)]
        return adjacencyMatrix

    def getDistanceMatrix(self) -> List[List[int]]:
        'Get the distance matrix of the graph.'
        length = len(self.vertices)
        adja = self.getAdjacencyMatrix()
        dist = [[None] * length for _ in range(length)]
        for i in range(length):
            for j in range(length):
                if adja[i][j] == 1:
                    dist[i][j] = 1
        for k in range(length):
            for i in range(length):
                for j in range(length):
                    if dist[i][j] > dist[i][k] + dist[k][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]
        return dist
        
    