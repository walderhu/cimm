class ArrayHelper:
    'A static class containing helper functions for array-related tasks.'

    @staticmethod
    def __get_clone_value(value):
        'Returns a value, depending on the presence of a clone'
        if hasattr(value, 'clone') and callable(getattr(value, 'clone')):
            return value.clone()
        return value

    @staticmethod
    def clone(arr: list):
        'Returns a clone of the object'
        if not hasattr(arr, '__iter__'):
            return {}
        elif isinstance(arr, dict):
            return {key: ArrayHelper.__get_clone_value(value) for key, value in arr.items()}
        elif isinstance(arr, (list, tuple)):
            return [ArrayHelper.__get_clone_value(value) for value in arr]
        elif isinstance(arr, str):
            return {str(i): symbol for i, symbol in enumerate(arr)}
