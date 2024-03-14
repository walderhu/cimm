from typing import Any, Union


class ArrayHelper:
    'A static class containing helper functions for array-related tasks.'

    @staticmethod
    def __get_clone_value(value: Any) -> Any:
        'Returns a value, depending on the presence of a clone'
        if hasattr(value, 'clone') and callable(getattr(value, 'clone')):
            return value.clone()
        return value

    @staticmethod
    def clone(arr: Union[list, dict, str]) -> Union[list, dict, str]:
        'Returns a clone of the object'
        if not hasattr(arr, '__iter__'):
            return {}
        elif isinstance(arr, dict):
            return {key: ArrayHelper.__get_clone_value(value) for key, value in arr.items()}
        elif isinstance(arr, (list, tuple)):
            return [ArrayHelper.__get_clone_value(value) for value in arr]
        elif isinstance(arr, str):
            return {str(i): symbol for i, symbol in enumerate(arr)}

    @staticmethod
    def equals(arrA: Union[list, tuple], arrB: Union[list, tuple]) -> bool:
        """
        Returns a boolean value indicating whether two arrays contain the same elements.
        Supports only one-dimensional, non-nested arrays.
        """
        if any([not hasattr(x, '__iter__') or isinstance(x, str) for x in (arrA, arrB)]):
            raise TypeError
        if len(arrA) != len(arrB):
            return False
        arr1, arr2 = sorted(arrA), sorted(arrB)
        return all([arr1[i] == arr2[i] for i in range(len(arr1))])

    @staticmethod
    def print(arr, sep: str = ', ', beg: str = '(', end: str = ')') -> str:
        """
        Returns a string representation of an array.
        If the array contains objects with an id property,
        the id property is printed for each of the elements.
        """
        string, elements = '', []
        for i in range(len(arr)):
            if hasattr(arr[i], '__iter__'):
                elements.append(ArrayHelper.print(
                    arr[i], sep=',', beg='', end=''))
            else:
                elements.append(str(arr[i].id) if hasattr(
                    arr[i], "id") else str(arr[i]))
        else:
            string = beg + sep.join(elements) + end
        return string

    @staticmethod
    def each(arr, callback):
        """
        Вызывает соответсвтвующищую функцию callback
        для каждого элемента итерируемого объекта arr
        """
        for item in arr:
            callback(item)

    @staticmethod
    def get(arr, property, value):
        for obj in arr:
            if obj.get(property) == value:
                return obj

    @staticmethod
    def contains(arr, options):
        if 'property' not in options and 'func' not in options:
            for item in arr:
                if item == options['value']:
                    return True
        elif 'func' in options:
            for item in arr:
                if options['func'](item):
                    return True
        else:
            for item in arr:
                if item.get(options['property']) == options['value']:
                    return True
        return False

    @staticmethod
    def intersection(arrA, arrB):
        intersection = []
        for itemA in arrA:
            for itemB in arrB:
                if itemA == itemB:
                    intersection.append(itemA)
        return intersection

    @staticmethod
    def unique(arr):
        contains = {}
        return list(filter(lambda i: contains[i] if i in contains else contains.setdefault(i, True), arr))

    @staticmethod
    def count(arr, value):
        count = 0
        for i in arr:
            if i == value:
                count += 1
        return count

    @staticmethod
    def toggle(arr, value):
        new_arr = []
        removed = False
        for i in arr:
            if i != value:
                new_arr.append(i)
            else:
                removed = True
        if not removed:
            new_arr.append(value)
        return new_arr

    @staticmethod
    def remove(arr, value):
        tmp = []
        for i in arr:
            if i != value:
                tmp.append(i)
        return tmp

    @staticmethod
    def remove_unique(arr, value):
        index = arr.index(value)
        if index > -1:
            arr.pop(index)
        return arr

    @staticmethod
    def remove_all(arrA, arrB):
        return list(filter(lambda item: item not in arrB, arrA))

    @staticmethod
    def merge(arrA, arrB):
        arr = [None] * (len(arrA) + len(arrB))
        for i in range(len(arrA)):
            arr[i] = arrA[i]
        for i in range(len(arrB)):
            arr[len(arrA) + i] = arrB[i]
        return arr

    @staticmethod
    def contains_all(arrA, arrB):
        containing = 0
        for i in arrA:
            for j in arrB:
                if i == j:
                    containing += 1
        return containing == len(arrB)

    @staticmethod
    def sort_by_atomic_number_desc(arr):
        map = list(map(lambda e, i: {"index": i, "value": list(
            map(int, e["atomicNumber"].split(".")))}, arr, range(len(arr))))
        map.sort(key=lambda x: (len(x["value"]), x["value"]), reverse=True)
        return list(map(lambda e: arr[e["index"]], map))

    @staticmethod
    def deep_copy(arr):
        new_arr = []
        for i in arr:
            if isinstance(i, list):
                new_arr.append(ArrayHelper.deep_copy(i))
            else:
                new_arr.append(i)
        return new_arr
