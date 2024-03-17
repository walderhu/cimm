class ThemeManager:
    def __init__(self, colors, theme) -> None:
        self.colors = colors
        self.theme = self.colors[theme]

    def getColor(self, key: str) -> str:
        'Returns the hex code of a color associated with a key from the current theme.'
        return self.theme.get(key.upper(), self.theme.get('C'))

    def setTheme(self, theme: str) -> None:
        'This feature allows you to dynamically change the theme of an object'
        if theme in self.colors:
            self.theme = self.colors[theme]
