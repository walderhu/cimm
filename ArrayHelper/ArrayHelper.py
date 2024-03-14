from typing import Any, Union, Callable


class ArrayHelper:
    'A static class containing helper functions for array-related tasks.'

    @staticmethod
    def __get_clone_value(value: Any) -> Any:
        'Returns a value, depending on the presence of a clone'
        if hasattr(value, 'clone') and callable(getattr(value, 'clone')):
            return value.clone()
        return value

    @staticmethod
    def clone(arr: list) -> list:
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
    def equals(arrA: list, arrB: list) -> bool:
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
    def print(arr: list, sep: str = ', ', beg: str = '(', end: str = ')') -> str:
        """
        Returns a string representation of an array.
        If the array contains objects with an id property,
        the id property is printed for each of the elements.
        """
        string, elements = '', []
        for i in range(len(arr)):
            if isinstance(arr, str):
                elements.append(arr[i])
            elif hasattr(arr[i], '__iter__'):
                elements.append(ArrayHelper.print(
                    arr[i], sep=',', beg='', end=''))
            else:
                elements.append(str(arr[i].id) if hasattr(
                    arr[i], "id") else str(arr[i]))
        else:
            string = beg + sep.join(elements) + end
        return string

    @staticmethod
    def each(arr: list, callback: Callable):
        """
        Вызывает соответсвтвующищую функцию callback
        для каждого элемента итерируемого объекта arr
        """
        for item in arr:
            callback(item)

    # @staticmethod
    # def get(arr, property, value):
    #     for obj in arr:
    #         if obj.get(property) == value:
    #             return obj

    # @staticmethod
    # def contains(arr, options):
    #     if 'property' not in options and 'func' not in options:
    #         for item in arr:
    #             if item == options['value']:
    #                 return True
    #     elif 'func' in options:
    #         for item in arr:
    #             if options['func'](item):
    #                 return True
    #     else:
    #         for item in arr:
    #             if item.get(options['property']) == options['value']:
    #                 return True
    #     return False

    @staticmethod
    def intersection(arrA, arrB):
        return [elem for elem in arrA if elem in arrB]

    @staticmethod
    def unique(arr):
        return list(set(arr))

    @staticmethod
    def count(arr, value):
        return arr.count(value)

    @staticmethod
    def toggle(arr, value):
        if value in arr:
            new_arr = ArrayHelper.remove_unique(arr, value)
        else:
            arr.append(value)
            new_arr = ArrayHelper.clone(arr)
        return new_arr

    @staticmethod
    def remove(arr, value):
        return [elem for elem in arr if elem != value]

    @staticmethod
    def remove_unique(arr, value):
        clone = ArrayHelper.clone(arr)
        if value in clone:
            del clone[clone.index(value)]
        return clone

    @staticmethod
    def remove_all(arrA, arrB):
        return list(filter(lambda item: item not in arrB, arrA))

    @staticmethod
    def merge(arrA, arrB):
        arr = [None] * (len(arrA) + len(arrB))
        for i, value in enumerate(arrA):
            arr[i] = value
        for i, value in enumerate(arrB):
            arr[len(arrA) + i] = value
        return arr

    @staticmethod
    def contains_all(arrA, arrB):
        return all([i == j for i in arrA for j in arrB]) and len(arrB) == len(arrA)

    # @staticmethod
    # def sort_by_atomic_number_desc(arr):
    #     map = list(map(lambda e, i: {"index": i, "value": list(map(int, e["atomicNumber"].split(".")))}, arr, range(len(arr))))
    #     map.sort(key=lambda x: (len(x["value"]), x["value"]), reverse=True)
    #     return list(map(lambda e: arr[e["index"]], map))

    @staticmethod
    def deep_copy(arr):
        return [ArrayHelper.deep_copy(elem) if hasattr(arr, '__iter__') else elem for elem in arr]
