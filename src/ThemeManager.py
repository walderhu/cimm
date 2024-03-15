class ThemeManager:
    def __init__(self, colors, theme):
        self.colors = colors
        self.theme = self.colors[theme]

    def get_color(self, key):
        if key:
            key = key.upper()
            if key in self.theme:
                return self.theme[key]
        return self.theme['C']

    def set_theme(self, theme):
        if theme in self.colors:
            self.theme = self.colors[theme]
