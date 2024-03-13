import unittest
from unittest.mock import patch, MagicMock
import execjs

class TestAddFunction(unittest.TestCase):

    def test_Array_helper_1(self):
        with open('main.js', 'r') as file:
            js_code = file.read()

        ctx = execjs.compile(js_code)
        result = ctx.call("my_function", 3, 5)
        condition = result == 15
        self.assertTrue(condition)

if __name__ == '__main__':
    unittest.main()