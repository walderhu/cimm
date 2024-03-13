class ArrayHelper:

    @staticmethod
    def __arg(value):
        return ArrayHelper.clone(value)\
            if isinstance(value, (dict, list)) else value

    @staticmethod
    def __have_clone(value):
        return hasattr(value, 'clone')\
            and callable(getattr(value, 'clone'))

    @staticmethod
    def clone(arr: list):
        if not hasattr(arr, '__iter__'):
            return {}
        elif isinstance(arr, dict):
            return {key: value.clone() if ArrayHelper.__have_clone(value)
                    else ArrayHelper.__arg(value) for key, value in arr.items()}
        elif isinstance(arr, (list, tuple)):
            return [value.clone() if ArrayHelper.__have_clone(value)
                    else ArrayHelper.__arg(value) for value in arr]
        elif isinstance(arr, str):
            return {str(i): symbol for i, symbol in enumerate(arr)}
