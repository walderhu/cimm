'Testing the ArrayHelper module'
import unittest
import execjs
import ArrayHelper


class TestAddFunction(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        with open('ArrayHelper.js', 'r') as file:
            self.ctx = execjs.compile(file.read())

    def test_clone_method(self):
        def testing(arr): return self.ctx.call("ArrayHelper.clone",arr)\
              == ArrayHelper.ArrayHelper.clone(arr)
        checking = [
            [1, 2, [1, 2, 3], 4, 5],
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            {'1': 'one', 'cimm': 'cool'},
            (1, 2, 3),
            (1,),
            True,
            False,
            1,
            1.0,
            None,
        ]
        self.assertTrue(all(map(testing, checking)))


if __name__ == '__main__':
    unittest.main()
