class ThemeManager:
    def __init__(self, colors, theme):
        self.colors = colors
        self.theme = self.colors[theme]

    def get_color(self, key):
        'Returns the hex code of a color associated with a key from the current theme.'
        return self.theme.get(key.upper(), self.theme.get('C'))

    def set_theme(self, theme):
        'This feature allows you to dynamically change the theme of an object'
        if theme in self.colors:
            self.theme = self.colors[theme]
