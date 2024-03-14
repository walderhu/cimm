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
        obj = [
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
        self.assertTrue(all(map(testing, obj)))

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

    def test_equals_method(self):
        def testing(arrA, arrB): return self.ctx.call("ArrayHelper.equals", arrA, arrB)\
            == ArrayHelper.ArrayHelper.equals(arrA, arrB)
        obj = [
            [1, 2, 3, 4, 5],
            [1, 2, 3],
            (1, 2, 3),
            (1,),
            list('CIMM')
        ]
        for i in range(len(obj)):
            for j in range(len(obj)):
                self.assertTrue(testing(obj[i], obj[j]))
                

    def test_equals_method_errors(self):
        def testing(arrA, arrB): return self.ctx.call(
            "ArrayHelper.equals", arrA, arrB)
        errors = [
            [1, 2, [1, 2, 3], 4, 5],
            'Cimm is cool laboratory',
            range(10),
            {1, 2, 3},
            {'1': 'one', 'cimm': 'cool'},
            frozenset([1, 2, 3]),
            complex(1, 2),
            1,
            1.0,
            True,
            False, 
            None,
            object()
        ]
        for error in errors:
            with self.assertRaises(TypeError):
                testing(error)


if __name__ == '__main__':
    unittest.main()
