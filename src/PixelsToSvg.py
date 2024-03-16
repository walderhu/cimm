from typing import Any
__all__ = ['convert_image']


def component_to_hex(value: int) -> str:
    'Converts a number to its 16-bit representation'
    hex_val = format(int(value), 'x')
    return '0' + hex_val if len(hex_val) == 1 else hex_val


def get_color(r: int, g: int, b: int, alpha: int) -> str:
    'Defines the color format depending on the alpha value'
    alpha = int(alpha)
    return f"#{component_to_hex(r)}{component_to_hex(g)}{component_to_hex(b)}"\
        if alpha in (0, 255) else f'rgba({r},{g},{b},{alpha / 255})'


def make_path_data(x: Any, y: Any, w: Any) -> str:
    'Generates instructions for creating a horizontal line in SVG'
    return f'M{x} {y}h{w}'


def make_path(color: str, data: str) -> str:
    'Generates a string representing a path element in SVG with the specified stroke color and path data'
    return f'<path stroke="{color}" d="{data}" />\n'


def process_color(color: str, values: list) -> str:
    'Process the color and values to generate a path.'
    color = get_color(*color.split(','))
    if color is False:
        return
    paths, cur_path, w = [], None, 1
    for value in values:
        if cur_path and value[1] == cur_path[1] and value[0] == (cur_path[0] + w):
            w += 1
        else:
            if cur_path:
                paths.append(make_path_data(cur_path[0], cur_path[1], w))
                w = 1
            cur_path = value
    paths.append(make_path_data(cur_path[0], cur_path[1], w))
    return make_path(color, ''.join(paths))


def colors_to_paths(colors: dict) -> str:
    'Generate paths for colors based on values.'
    output = ""
    for color, values in colors.items():
        path = process_color(color, values)
        if path:
            output += path
    return output


def get_colors(img: dict) -> dict:
    """The function analyzes the pixel data of the image,
generates unique colors and their coordinates in the dictionary,
and returns this dictionary for further processing"""
    colors, data, width = dict(), img['data'], img['width']
    for i in range(0, len(data), 4):
        if data[i + 3] > 0:
            color = ','.join(map(str, data[i:i+4]))
            colors.setdefault(color, []).append(
                ((i // 4) % width, (i // 4) // width))
    return colors


def convert_image(img: dict) -> str:
    """Converts an image in dictionary format to an SVG string representing the colors of the image as paths in SVG format."""
    colors = get_colors(img)
    paths = colors_to_paths(colors)
    output = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -0.5 {img["width"]} {img["height"]}" shape-rendering="crispEdges"><g shape-rendering="crispEdges">{paths}</g></svg>'
    return output
