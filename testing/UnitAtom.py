'Testing the Atom module'
import unittest
import execjs
import sys
sys.path.append(r'/home/jesse/cimm/source')
from Atom import Atom

class TestAddFunction(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        with open('JavaScript/Atom.js', 'r') as file:
            self.ctx = execjs.compile(file.read())

    def test_check_atomicNumbers(self):
        res_js = self.ctx.eval("ArrayHelper.maxBonds")
        res_py = Atom.maxBonds
        print(res_js)
        print(res_py)


if __name__ == '__main__':
    unittest.main()
