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
    def sort_by_atomic_number_desc(arr):
        map = list(map(lambda e, i: {"index": i, "value": list(
            map(int, e["atomicNumber"].split(".")))}, arr, range(len(arr))))
        map.sort(key=lambda x: (len(x["value"]), x["value"]), reverse=True)
        return list(map(lambda e: arr[e["index"]], map))
