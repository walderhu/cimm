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
        def testing(arr): return self.ctx.call("ArrayHelper.clone", arr)\
            == ArrayHelper.ArrayHelper.clone(arr)
        objects = [
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
            'Cimm is cool laboratory'
        ]
        self.assertTrue(all(map(testing, objects)))

    def test_clone_method_errors(self):
        def testing(arr): return self.ctx.call("ArrayHelper.clone", arr)
        errors = [
            range(10),
            {1, 2, 3},
            frozenset([1, 2, 3]),
            complex(1, 2),
            object()
        ]
        for error in errors:
            with self.assertRaises(TypeError):
                testing(error)


if __name__ == '__main__':
    unittest.main()
