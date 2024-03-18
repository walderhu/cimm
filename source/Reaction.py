from Parser import Parser

class Reaction:
    def __init__(self, reaction_smiles: str):
        'The constructor for the class Reaction.'
        self.reactants_smiles = []
        self.reagents_smiles = []
        self.products_smiles = []
        self.reactants_weights = []
        self.reagents_weights = []
        self.products_weights = []
        self.reactants = []
        self.reagents = []
        self.products = []
        parts = reaction_smiles.split(">")
        
        if len(parts) != 3:
            raise ValueError("Invalid reaction SMILES. Did you add fewer than or more than two '>'?")
        
        if parts[0] != "":
            self.reactants_smiles = parts[0].split(".")
        
        if parts[1] != "":
            self.reagents_smiles = parts[1].split(".")
        
        if parts[2] != "":
            self.products_smiles = parts[2].split(".")
        
        for smiles in self.reactants_smiles:
            self.reactants.append(Parser.parse(smiles))
        
        for smiles in self.reagents_smiles:
            self.reagents.append(Parser.parse(smiles))
        
        for smiles in self.products_smiles:
            self.products.append(Parser.parse(smiles))
