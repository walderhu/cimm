from typing import Any, Union, Callable


class ArrayHelper:
    'A static class containing helper functions for array-related tasks.'

    @staticmethod
    def clone(arr: list) -> list:
        'Returns a copy of the object'
        if not hasattr(arr, '__iter__'):
            return {}
        elif isinstance(arr, dict):
            return {key: value for key, value in arr.items()}
        elif isinstance(arr, (list, tuple)):
            return [value for value in arr]
        elif isinstance(arr, str):
            return {str(i): symbol for i, symbol in enumerate(arr)}

    @staticmethod
    def equals(arrA: list, arrB: list) -> bool:
        'Checks 2 objects for equality'
        return len(arrA) == len(arrB) and all(a == b for a, b in zip(sorted(arrA), sorted(arrB)))

    @staticmethod
    def print(arr: list, sep: str = ', ', beg: str = '(', end: str = ')') -> str:
        'Returns the formatted string of the object'
        if len(arr) == 0:
            return ''
        elements = []
        for item in arr:
            if isinstance(item, str):
                elements.append(item)
            elif hasattr(item, '__iter__'):
                elements.append(ArrayHelper.print(
                    item, sep=',', beg='', end=''))
            else:
                elements.append(str(item.id) if hasattr(
                    item, "id") else str(item))
        return f'{beg}{sep.join(elements)}{end}'

    @staticmethod
    def each(arr: list, callback: Callable) -> None:
        [callback(item) for item in arr]

    @staticmethod
    def get(arr: list, property: Union[str, int], value: Union[str, int]) -> Union[str, int]:
        'Return the array element from an array containing objects, where a property of the object is set to a given value.'
        for item in arr:
            if item[property] == value:
                return item

    @staticmethod
    def contains(arr: dict, options: Any) -> bool:
        'Checks whether or not an array contains a given value. the options object passed as a second argument can contain three properties. value: The value to be searched for. property: The property that is to be searched for a given value. func: A function that is used as a callback to return either true or false in order to do a custom comparison'
        if not options.get('property') and not options.get('func'):
            for item in arr:
                if item == options.get('value'):
                    return True
        elif options.get('func'):
            for item in arr:
                if options['func'](item):
                    return True
        else:
            for item in arr:
                if item.get(options['property']) == options['value']:
                    return True
        return False

    @staticmethod
    def intersection(arrA: list, arrB: list) -> list:
        'Returns an array containing the intersection between two arrays. That is, values that are common to both arrays.'
        return [elem for elem in arrA if elem in arrB]

    @staticmethod
    def unique(arr: list) -> list:
        'Returns an array of unique elements contained in an array.'
        return list(set(arr))

    @staticmethod
    def count(arr: list, value: Any) -> int:
        'Count the number of occurences of a value in an array.'
        return arr.count(value)

    @staticmethod
    def toggle(arr: list, value: Any) -> list:
        'Toggles the value of an array. If a value is not contained in an array, the array returned will contain all the values of the original array including the value. If a value is contained in an array, the array returned will contain all the values of the original array excluding the value.'
        if value in arr:
            new_arr = ArrayHelper.remove_unique(arr, value)
        else:
            arr.append(value)
            new_arr = ArrayHelper.clone(arr)
        return new_arr

    @staticmethod
    def remove(arr: list, value: Any) -> list:
        'Remove a value from an array.'
        return [elem for elem in arr if elem != value]

    @staticmethod
    def removeUnique(arr: list, value: Any) -> list:
        'Remove a value from an array with unique values.'
        clone = ArrayHelper.clone(arr)
        if value in clone:
            del clone[clone.index(value)]
        return clone

    @staticmethod
    def removeAll(arrA: list, arrB: list) -> list:
        'Remove all elements contained in one array from another array.'
        return list(filter(lambda item: item not in arrB, arrA))

    @staticmethod
    def merge(arrA: list, arrB: list) -> list:
        'Merges two arrays and returns the result. The first array will be appended to the second array.'
        arr = [None] * (len(arrA) + len(arrB))
        for i, value in enumerate(arrA):
            arr[i] = value
        for i, value in enumerate(arrB):
            arr[len(arrA) + i] = value
        return arr

    @staticmethod
    def contains_all(arrA: list, arrB: list) -> bool:
        'Checks whether or not an array contains all the elements of another array, without regard to the order.'
        return all([i == j for i in arrA for j in arrB]) and len(arrB) == len(arrA)

    @staticmethod
    def sort_by_atomic_number_desc(arr: list) -> list:
        'Sort an array of atomic number information. Where the number is indicated as x, x.y, x.y.z, ...'
        map_list = list()
        for i, e in enumerate(arr):
            atomic_numbers = list(map(int, e['atomicNumber'].split('.')))
            map_list.append({'index': i, 'value': atomic_numbers})
        map_list.sort(key=lambda x: x['value'], reverse=True)
        return [arr[e['index']] for e in map_list]

    @staticmethod
    def deep_copy(arr: list) -> list:
        'Copies a an n-dimensional array.'
        return [ArrayHelper.deep_copy(elem) if hasattr(arr, '__iter__') else elem for elem in arr]
