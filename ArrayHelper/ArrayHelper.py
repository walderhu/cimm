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


if __name__ == '__main__':
    arr1 = [1, 2, 3]
    arr2 = [1, 2, 3]
    print(ArrayHelper.equals(arr1, arr2))
