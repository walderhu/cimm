class Options:
    'A helper method to extend the default options with user supplied ones.'

    @staticmethod
    def extend(*args) -> dict:
        deep = False
        extended = {}
        args_list = list(args)
        if isinstance(args_list[0], bool):
            deep = args_list.pop(0)
        for obj in args_list:
            for prop, value in obj.items():
                if deep and isinstance(value, dict):
                    extended[prop] = Options.extend(
                        True, extended.get(prop, {}), value)
                else:
                    extended[prop] = value
        return extended
