class ArrayHelper:

    @staticmethod
    def clone(arr):
        if not hasattr(arr, '__iter__'):
            return {}

        def arg(value): return ArrayHelper.clone(
            value) if isinstance(value, (dict, list)) else value

        def have_clone(value): return hasattr(
            value, 'clone') and callable(getattr(value, 'clone'))
        if isinstance(arr, dict):
            return {key: value.clone() if have_clone(value) else arg(value) for key, value in arr.items()}
        elif isinstance(arr, (list, tuple)):
            return [value.clone() if have_clone(value) else arg(value) for value in arr]
