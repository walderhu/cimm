from Reaction import Reaction

class ReactionParser:
    @staticmethod
    def parse(reaction_smiles: str) -> 'Reaction':
        'Returns the hex code of a color associated with a key from the current theme.'
        reaction = Reaction(reaction_smiles)
        return reaction
