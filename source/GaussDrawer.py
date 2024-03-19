from PixelsToSvg import *
from Vector2 import Vector2
import matplotlib.colors

import svgwrite 


class GaussDrawer:
    def __init__(self, points, weights, width, height, sigma = 0.3, interval = 0, colormap=None, opacity = 1.0, normalized=False) -> None:
        self.points = points
        self.weights = weights
        self.width = width
        self.height = height
        self.sigma = sigma
        self.interval = interval
        self.opacity = opacity
        self.normalized = normalized
        if colormap == None:
            piyg11 = [
                "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef",
                "#ffffff",
                "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"]
            colormap = piyg11
        
        self.colormap = colormap
        self.canvas = svgwrite.Drawing('canvas', profile='tiny')
        self.context = self.canvas.getContext('2d')
        self.canvas.width = self.width
        self.canvas.height = self.height





