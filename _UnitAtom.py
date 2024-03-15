'Testing the Atom module'
import unittest
import execjs
from Atom import Atom


class TestAddFunction(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        with open('js/Atom.js', 'r') as file:
            self.ctx = execjs.compile(file.read())

    def test_clone_method(self):
        print('Hello')


if __name__ == '__main__':
    unittest.main()
