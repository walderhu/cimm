'Testing the ArrayHelper module'
import unittest
import execjs
from ArrayHelper import ArrayHelper


class TestAddFunction(unittest.TestCase):
    def __init__(self, methodName: str = "runTest") -> None:
        super().__init__(methodName)
        with open('js/ArrayHelper.js', 'r') as file:
            self.ctx = execjs.compile(file.read())

    def test_clone_method(self):
        def testing(arr): return self.ctx.call("ArrayHelper.clone", arr)\
            == ArrayHelper.clone(arr)
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
            == ArrayHelper.equals(arrA, arrB)
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

    def test_print_method(self):
        def testing(arr): return self.ctx.call("ArrayHelper.print", arr)\
            == ArrayHelper.print(arr)
        obj = [
            [1, 2, [3, 4], [5, [6, 7], 8]],
            [[1, 2], [3, 4]],
            'hello',
            (1, 2, 3, 4),
            list('cimm'),
            []
        ]
        self.assertTrue(all(map(testing, obj)))

    def test_each_method(self):
        arr = [895, 5, 34, 534]
        result = []
        ArrayHelper.each(arr, callback=lambda item: result.append(item * 2))
        self.assertEqual(result, [1790, 10, 68, 1068])

    def test_get_method(self):
        arr = [
            {'id': 1, 'name': 'Alice'},
            {'id': 2, 'name': 'Bob'},
            {'id': 3, 'name': 'Charlie'}
        ]
        check = {'id': 2, 'name': 'Bob'}
        result = ArrayHelper.get(arr, 'name', 'Bob')
        self.assertEqual(result, check)

    def test_get_existing_item(self):
        arr = [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]
        self.assertEqual(ArrayHelper.get(arr, 'name', 'Bob'),
                         {'id': 2, 'name': 'Bob'})

        arr = [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]
        self.assertIsNone(ArrayHelper.get(arr, 'name', 'Charlie'))

        arr = []
        self.assertIsNone(ArrayHelper.get(arr, 'name', 'Bob'))

    def test_contains_value(self):
        arr = [1, 2, 3, 4, 5]
        options = {'value': 3}
        self.assertTrue(ArrayHelper.contains(arr, options))

        arr = [{'id': 1, 'name': 'Alice'}, {'id': 2, 'name': 'Bob'}]
        options = {'property': 'name', 'value': 'Bob'}
        self.assertTrue(ArrayHelper.contains(arr, options))

        arr = [1, 2, 3, 4, 5]
        options = {'func': lambda x: x % 2 == 0}
        self.assertTrue(ArrayHelper.contains(arr, options))

        arr = [1, 2, 3, 4, 5]
        options = {'value': 6}
        self.assertFalse(ArrayHelper.contains(arr, options))

    def test_intersection_common_values(self):
        arrA = [1, 2, 3, 4, 5]
        arrB = [3, 4, 5, 6, 7]
        self.assertListEqual(ArrayHelper.intersection(arrA, arrB), [3, 4, 5])

        arrA = [1, 2, 3]
        arrB = [4, 5, 6]
        self.assertListEqual(ArrayHelper.intersection(arrA, arrB), [])

        arrA = []
        arrB = [1, 2, 3]
        self.assertListEqual(ArrayHelper.intersection(arrA, arrB), [])

    def test_unique_elements(self):
        arr = [1, 2, 2, 3, 4, 4, 5]
        self.assertListEqual(ArrayHelper.unique(arr), [1, 2, 3, 4, 5])

        arr = []
        self.assertListEqual(ArrayHelper.unique(arr), [])

        arr = [1, 'apple', 'apple', 3, 'banana', 3]
        self.assertListEqual(ArrayHelper.unique(arr), list(set(arr)))

        arr = ['apple', 'orange', 'apple', 'banana']
        self.assertListEqual(ArrayHelper.unique(arr), list(set(arr)))

    def test_count_occurrences(self):
        arr = [1, 2, 2, 3, 4, 4, 4, 5]
        self.assertEqual(ArrayHelper.count(arr, 4), 3)

        arr = [1, 2, 3, 4, 5]
        self.assertEqual(ArrayHelper.count(arr, 6), 0)

        arr = []
        self.assertEqual(ArrayHelper.count(arr, 1), 0)

        arr = ['apple', 'orange', 'apple', 'banana']
        self.assertEqual(ArrayHelper.count(arr, 'apple'), 2)

    def test_toggle_existing_value(self):
        arr = [1, 2, 3, 4]
        value = 3
        self.assertListEqual(ArrayHelper.toggle(arr, value), [1, 2, 4])

        arr = [1, 2, 3]
        value = 4
        self.assertListEqual(ArrayHelper.toggle(arr, value), [1, 2, 3, 4])

        arr = []
        value = 1
        self.assertListEqual(ArrayHelper.toggle(arr, value), [1])

        arr = [1, 2, 2, 3]
        value = 2
        self.assertListEqual(ArrayHelper.toggle(
            arr, value), self.ctx.call("ArrayHelper.toggle", arr, value))

    def test_remove_unique_value(self):
        arr = [1, 2, 3, 4]
        value = 3
        self.assertListEqual(ArrayHelper.removeUnique(arr, value), [1, 2, 4])

        arr = [1, 2, 3]
        value = 4
        self.assertListEqual(ArrayHelper.removeUnique(arr, value), [1, 2, 3])

        arr = []
        value = 1
        self.assertListEqual(ArrayHelper.removeUnique(arr, value), [])

        arr = [1, 2, 2, 3]
        value = 2
        self.assertListEqual(ArrayHelper.removeUnique(arr, value), [1, 2, 3])

    def test_merge_arrays(self):
        arrA = [1, 2, 3]
        arrB = [4, 5, 6]
        self.assertListEqual(ArrayHelper.merge(arrA, arrB), [1, 2, 3, 4, 5, 6])

        arrA = []
        arrB = []
        self.assertListEqual(ArrayHelper.merge(arrA, arrB), [])

        arrA = [1, 2, 3]
        arrB = []
        self.assertListEqual(ArrayHelper.merge(arrA, arrB), [1, 2, 3])

        arrA = [1, 2]
        arrB = [2, 3]
        self.assertListEqual(ArrayHelper.merge(arrA, arrB), [1, 2, 2, 3])

    def test_remove_all_elements(self):
        arrA = [1, 2, 3, 4, 5]
        arrB = [3, 4]
        self.assertListEqual(ArrayHelper.removeAll(arrA, arrB), [1, 2, 5])

        arrA = [1, 2, 3]
        arrB = [4, 5]
        self.assertListEqual(ArrayHelper.removeAll(arrA, arrB), [1, 2, 3])

        arrA = []
        arrB = []
        self.assertListEqual(ArrayHelper.removeAll(arrA, arrB), [])

        arrA = [1, 2, 2, 3, 4]
        arrB = [2, 3]
        self.assertListEqual(ArrayHelper.removeAll(arrA, arrB), [1, 4])

    def test_contains_all_elements(self):
        arrA = [1, 2, 3, 4]
        arrB = [4, 3, 2, 1]
        res_py = ArrayHelper.contains_all(arrA, arrB)
        self.assertEqual(res_py, True)

        arrA = [1, 2, 2, 3]
        arrB = [2, 3, 1]
        res_py = ArrayHelper.contains_all(arrA, arrB)
        self.assertEqual(res_py, True)

        arrA = [1, 2, 3]
        arrB = [1, 2]
        res_py = ArrayHelper.contains_all(arrA, arrB)
        self.assertEqual(res_py, True)

        arrA = []
        arrB = []
        res_py = ArrayHelper.contains_all(arrA, arrB)
        self.assertEqual(res_py, True)

    def test_deep_copy_1d_array(self):
        arr = [1, 2, 3]
        self.assertListEqual(ArrayHelper.deep_copy(arr), [1, 2, 3])

        arr = [[1, 2], [3, 4]]
        self.assertListEqual(ArrayHelper.deep_copy(arr), [[1, 2], [3, 4]])

        arr = []
        self.assertListEqual(ArrayHelper.deep_copy(arr), [])

        arr = [1, [2, 3], [4, [5, 6]]]
        self.assertListEqual(ArrayHelper.deep_copy(arr),
                             [1, [2, 3], [4, [5, 6]]])

    def test_sort_by_atomic_number_desc(self):
        arr = []
        self.assertListEqual(ArrayHelper.sort_by_atomic_number_desc(arr), [])

        arr = [{'atomicNumber': '5'}]
        self.assertListEqual(ArrayHelper.sort_by_atomic_number_desc(arr), [
                             {'atomicNumber': '5'}])


if __name__ == '__main__':
    unittest.main()
