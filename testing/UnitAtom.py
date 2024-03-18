'Testing the Atom module'
import unittest, execjs, sys
sys.path.append(r'/home/jesse/cimm/source')
from Atom import Atom

class TestAddFunction(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        with open('JavaScript/Atom.js', 'r') as file:
            self.ctx = execjs.compile(file.read())

    def test_check_atomicNumbers(self):
        max_bonds_js = self.ctx.eval("Atom.maxBonds")   
        max_bonds_py = Atom.maxBonds
        print(f'{max_bonds_py=}')


if __name__ == '__main__':
    unittest.main()
