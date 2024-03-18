from Graph import Graph
from typing import List, Final, Callable, Dict, Set, Tuple

class SSSR:
    ' A class encapsulating the functionality to find the smallest set of smallest rings in a graph. */'
    
    @staticmethod
    def getRings(graph: 'Graph', experimental: bool=False) -> List[List[float]]:
        'Returns an array containing arrays, each representing a ring from the smallest set of smallest rings in the graph.'
        adjacencyMatrix = graph.getComponentsAdjacencyMatrix()
        if len(adjacencyMatrix) == 0:
            return None
        connectedComponents = Graph.getConnectedComponents(adjacencyMatrix)
        for connectedComponent in connectedComponents:
            ccAdjacencyMatrix = graph.getSubgraphAdjacencyMatrix(*connectedComponent)
            length = len(ccAdjacencyMatrix)
            arrRingCount = [0] * len(ccAdjacencyMatrix)
            arrBondCount = [sum(row) for row in ccAdjacencyMatrix]
            nEdges = sum(elem for row in ccAdjacencyMatrix for elem in row)
            nSssr = nEdges - length + 1
            allThree: bool = all(elem == 3 for elem in arrBondCount) 
            
            if allThree:
                nSssr = 2.0 + nEdges - length
            if type(nSssr) is int and nSssr == 1:
                rings.append([*connectedComponent])
                continue
            if experimental:
                nSssr = 999
            d, pe, pe_prime = SSSR.getPathIncludedDistanceMatrices(ccAdjacencyMatrix).values()
            c = SSSR.getRingCandidates(d, pe, pe_prime)
            sssr = SSSR.getSSSR(c, d, ccAdjacencyMatrix, pe, pe_prime, arrBondCount, arrRingCount, nSssr)
            rings = [[connectedComponent[val] for val in sssr_elem] for sssr_elem in sssr ]
        return rings
    
    @staticmethod
    def matrixToString(matrix: List[List[float]]) -> str:
        'Creates a printable string from a matrix (2D array).'
        return '\n'.join(' '.join(f'{elem}' for elem in row) for row in matrix)

    @staticmethod
    def __initialize_matrices(length: int):
        'private method for getPathIncludedDistanceMatrices'
        d = [[float('inf')] * length for _ in range(length)]
        pe = [[[[] for _ in range(length)] for _ in range(length)] for _ in range(length)]
        pe_prime = [[[[] for _ in range(length)] for _ in range(length)] for _ in range(length)]
        return d, pe, pe_prime

    @staticmethod
    def __update_matrices(d: List[List[float]], pe: List[List[List[float]]],\
        pe_prime: List[List[List[float]]], i: int, j: int, k: int) -> None:
        'private method for getPathIncludedDistanceMatrices'
        previous_path_length = d[i][j]
        new_path_length = d[i][k] + d[k][j]
        if previous_path_length > new_path_length:
            d[i][j] = new_path_length
            pe[i][j] = [[]]
            pe[i][j][0] = pe[i][k][0] + pe[k][j][0]
            if previous_path_length == new_path_length + 1:
                pe_prime[i][j] = [[len(pe[i][j])]]
                for l in range(len(pe[i][j])):
                    pe_prime[i][j][l] = [[len(pe[i][j][l])]]
                    for m in range(len(pe[i][j][l])):
                        pe_prime[i][j][l][m] = [[len(pe[i][j][l][m])]]
                        for n in range(len(pe[i][j][l][m])):
                            pe_prime[i][j][l][m][n] = [pe[i][j][l][m][0], pe[i][j][l][m][1]]
            else:
                pe_prime[i][j] = [[]]
        elif previous_path_length == new_path_length:
            if pe[i][k] and pe[k][j]:
                if pe[i][j]:
                    pe[i][j].append(pe[i][k][0] + pe[k][j][0])
                else:
                    pe[i][j][0] = pe[i][k][0] + pe[k][j][0]
        elif previous_path_length == new_path_length - 1:
            if pe_prime[i][j]:
                pe_prime[i][j].append(pe[i][k][0] + pe[k][j][0])
            else:
                pe_prime[i][j][0] = pe[i][k][0] + pe[k][j][0]

    @staticmethod
    def getPathIncludedDistanceMatrices(adjacencyMatrix: List[List[float]]) -> dict:
        length = len(adjacencyMatrix)
        d, pe, pe_prime = SSSR.__initialize_matrices(length)
        for i in range(length):
            for j in range(length):
                d[i][j] = adjacencyMatrix[i][j] if i == j or adjacencyMatrix[i][j] == 1 else float('inf')
                if d[i][j] == 1:
                    pe[i][j] = [[[i, j]]]

        for k in range(length):
            for i in range(length):
                for j in range(length):
                    SSSR.__update_matrices(d, pe, pe_prime, i, j, k)
        return {'d': d, 'pe': pe, 'pe_prime': pe_prime}

    @staticmethod
    def getRingCandidates(d: List[List[float]], pe: List[List[float]],\
        pe_prime: List[List[float]]) -> List[List[float]]:
        'Get the ring candidates from the path-included distance matrices.'
        length = len(d)
        candidates = []
        c = 0
        for i in range(length):
            for j in range(length):
                if not (d[i][j] == 0 or (len(pe[i][j]) == 1 and pe_prime[i][j] == 0)):
                    c = 2 * (d[i][j] + 0.5) if len(pe_prime[i][j]) else 2 * d[i][j]
                    if c is not None:
                        candidates.append([c, pe[i][j], pe_prime[i][j]])
        candidates.sort(key=lambda x: x[0])
        return candidates

    @staticmethod
    def getSSSR(c: List[List[float]], d: List[List[float]], adjacencyMatrix: List[List[float]],
        pe: List[List[float]], pe_prime: List[List[float]], arrBondCount: List, arrRingCount: List,
        nsssr: float) -> List[Set]:
        'Searches the candidates for the smallest set of smallest rings.'
        c_sssr, all_bonds = [], []
        for i in range(len(c)):
            if c[i][0] % 2 != 0:
                c_sssr, all_bonds = SSSR.__process_odd_case(c[i],\
                    c_sssr, all_bonds, adjacencyMatrix, nsssr)
            else:
                c_sssr, all_bonds = SSSR.__process_even_case(c[i],\
                    c_sssr, all_bonds, adjacencyMatrix, nsssr)
        return c_sssr

    @staticmethod
    def __process_odd_case(data: List[float], c_sssr: List[Set], all_bonds: List[Set],
                        adjacencyMatrix: List[List[float]], nsssr: float) -> Tuple[List[Set], List[Set]]:
        'private method for getSSSR'
        for j in range(len(data[2])):
            bonds = data[1][0] + data[2][j]
            bonds = SSSR.__flatten_nested_lists(bonds)
            atoms = SSSR.bondsToAtoms(bonds)
            if SSSR.bondsToAtoms(atoms, adjacencyMatrix) == len(atoms) and \
                    not SSSR.pathSetsContain(c_sssr, atoms, bonds, all_bonds):
                c_sssr.append(atoms)
                all_bonds += bonds
                
            if len(c_sssr) > nsssr:
                return c_sssr, all_bonds
                
        return c_sssr, all_bonds

    @staticmethod
    def __process_even_case(data: List[float], c_sssr: List[Set], all_bonds: List[Set],
                        adjacencyMatrix: List[List[float]], nsssr: float) -> Tuple[List[Set], List[Set]]:
        'private method for getSSSR'
        for j in range(len(data[1]) - 1):
            bonds = data[1][j] + data[1][j + 1]
            bonds = SSSR.__flatten_nested_lists(bonds)
            atoms = SSSR.bonds_to_atoms(bonds)
            if SSSR.get_bond_count(atoms, adjacencyMatrix) == len(atoms) and \
                    not SSSR.pathSetsContain(c_sssr, atoms, bonds, all_bonds):
                c_sssr.append(atoms)
                all_bonds += bonds
                
            if len(c_sssr) > nsssr:
                return c_sssr, all_bonds
            
        return c_sssr, all_bonds

    @staticmethod
    def __flatten_nested_lists(lst: List[List]) -> List:
        'private method for getSSSR'
        return [item for sublist in lst for item in sublist]

    @staticmethod
    def getEdgeCount(adjacencyMatrix: List[List[int]]) -> int:
        'Returns the number of edges in a graph defined by an adjacency matrix.'
        return sum(row.count(1) for row in adjacencyMatrix)
    
    @staticmethod
    def getEdgeList(adjacencyMatrix: List[List[int]]) -> List[List[int]]:
        'Returns an edge list constructed form an adjacency matrix.'
        length = range(len(adjacencyMatrix))
        return [[i, j] for i in length for j in length if adjacencyMatrix[i][j] == 1]
    
    @staticmethod
    def bondsToAtoms(bonds: List[int]) -> Set[int]:
        'Return a set of vertex indices contained in an array of bonds.'
        atoms = set()
        i = len(bonds)
        while i > 0:
            i -= 1
            atoms.add(bonds[i][0])
            atoms.add(bonds[i][1])
        return atoms
    
    @staticmethod
    def bondsToAtoms(bonds: List[int]) -> Set[int]:
        'Return a set of vertex indices contained in an array of bonds.'
        return {bond[0] for bond in bonds} | {bond[1] for bond in bonds}
    
    @staticmethod
    def getBondCount(atoms: Set[int], adjacency_matrix: List[List[int]]) -> int:
        'Returns the number of bonds within a set of atoms.'
        return sum(adjacency_matrix[u][v] for u in atoms for v in atoms if u == v) // 2    
    
    @staticmethod
    def pathSetsContain(path_sets: Set, path_set: Set[int], bonds: List[List[int]],\
        all_bonds: List[List[int]], arr_bond_count: List, arr_ring_count: List) -> bool:
        'Checks whether or not a given path already exists in an array of paths.'
        for existing_set in path_sets:
            if path_set.issuperset(existing_set):
                return True
            if len(existing_set) != len(path_set):
                continue
            if existing_set == path_set:
                return True
    
        count = 0
        all_contained = False
        for bond in bonds:
            for all_bond in all_bonds:
                if (bond[0] == all_bond[0] and bond[1] == all_bond[1]) or \
                   (bond[1] == all_bond[0] and bond[0] == all_bond[1]):
                    count += 1
            if count == len(bonds):
                all_contained = True
    
        special_case = False
        if all_contained:
            for element in path_set:
                if arr_ring_count[element] < arr_bond_count[element]:
                    special_case = True
                    break
    
        if all_contained and not special_case:
            return True
        for element in path_set:
            arr_ring_count[element] += 1
        return False
    
    @staticmethod
    def areSetsEqual(setA: Set[int], setB: Set[int]) -> bool:
        'Checks whether or not two sets are equal (contain the same elements).'
        return set(setA) == set(setB)
    
    @staticmethod
    def is_superset_of(setA: Set[int], setB: Set[int]) -> bool:
        'Checks whether or not a set (setA) is a superset of another set (setB).'
        return set(setA) >= set(setB)

        