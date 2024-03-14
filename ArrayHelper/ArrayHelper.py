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
    def print(arr, sep=', ', beg='(', end=')'):
        """
        Returns a string representation of an array.
        If the array contains objects with an id property,
        the id property is printed for each of the elements.

        Parameters:
        arr (list): The input array to be printed.
        sep (str): The delimiter to separate elements in the output string. Default is ', '.
        beg (str): The beginning of the returned string. Default is '('.
        end (str): the Ending of the returned string. Default is ')'.

        Returns:
        str: A string representation of the input array.
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


if __name__ == '__main__':
    arr1 = [1, 2, 3]
    print(ArrayHelper.print(arr1))
