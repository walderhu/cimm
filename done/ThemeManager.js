class ThemeManager {
    constructor(colors, theme) {
        this.colors = colors;
        this.theme = this.colors[theme];
    }

    getColor(key) {
        if (key) {
            key = key.toUpperCase();
            if (key in this.theme) {
                return this.theme[key];
            }
        }
        return this.theme['C'];
    }

    setTheme(theme) {
        if (this.colors.hasOwnProperty(theme)) {
            this.theme = this.colors[theme];
        }
    }
}

module.exports = ThemeManager;