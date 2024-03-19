'Testing the Edge module'
import unittest
import execjs
import sys
sys.path.append(r'/home/jesse/cimm/source')
from Edge import Edge

class TestAddFunction(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        with open('JavaScript/Edge.js', 'r') as file:
            self.ctx = execjs.compile(file.read())

    def test_check_bonds(self):
        res_js = self.ctx.eval("Edge.bonds")
        res_py = Edge.bonds
        print(res_js == res_py)


if __name__ == '__main__':
    unittest.main()
