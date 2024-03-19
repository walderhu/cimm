class PegSyntaxError(Exception):
    def __init__(self, message, expected, found, location):
        self.message = message
        self.expected = expected
        self.found = found
        self.location = location
        self.name = "SyntaxError"
        super().__init__(self.message)

def describe_expected(expected):
    DESCRIBE_EXPECTATION_FNS = {
        "literal": lambda expectation: f'"{literal_escape(expectation["text"])}"',
        "class": lambda expectation: f'[{("^" if expectation["inverted"] else "")}' + \
            ''.join([class_escape(part) if isinstance(part, list) else class_escape(part) for part in expectation["parts"]]) + ']',
        "any": lambda expectation: "any character",
        "end": lambda expectation: "end of input",
        "other": lambda expectation: expectation["description"]
    }

    def hex(ch):
        return hex(ord(ch))[2:].upper()

    def literal_escape(s):
        return s.replace('\\', '\\\\').replace('"', '\\"').replace('\0', '\\0') \
            .replace('\t', '\\t').replace('\n', '\\n').replace('\r', '\\r') \
            .replace('\x00', lambda ch: f'\\x0{hex(ch)}').replace('\x10-\x1F\x7F-\x9F', lambda ch: f'\\x{hex(ch)}')

    def class_escape(s):
        return s.replace('\\', '\\\\').replace(']', '\\]').replace('^', '\\^').replace('-', '\\-') \
            .replace('\0', '\\0').replace('\t', '\\t').replace('\n', '\\n').replace('\r', '\\r') \
            .replace('\x00', lambda ch: f'\\x0{hex(ch)}').replace('\x10-\x1F\x7F-\x9F', lambda ch: f'\\x{hex(ch)}')

    def describe_expectation(expectation):
        return DESCRIBE_EXPECTATION_FNS[expectation["type"]](expectation)

    descriptions = [describe_expectation(exp) for exp in expected]
    descriptions.sort()
    descriptions = list(dict.fromkeys(descriptions))
    if len(descriptions) == 1:
        return descriptions[0]
    elif len(descriptions) == 2:
        return descriptions[0] + " or " + descriptions[1]
    else:
        return ', '.join(descriptions[:-1]) + ", or " + descriptions[-1]

    def describe_found(found):
        return f'"{literal_escape(found)}"' if found else "end of input"

    return f'Expected {describe_expected(expected)} but {describe_found(found)} found.'
