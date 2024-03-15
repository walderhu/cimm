class Options:
    @staticmethod
    def extend(*args):
        deep = False
        extended = {}
        args_list = list(args)
        if isinstance(args_list[0], bool):
            deep = args_list.pop(0)

        def merge(obj):
            for prop, value in obj.items():
                if deep and isinstance(value, dict):
                    extended[prop] = Options.extend(
                        True, extended.get(prop, {}), value)
                else:
                    extended[prop] = value

        for obj in args_list:
            merge(obj)
        return extended
