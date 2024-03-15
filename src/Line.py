from math import sqrt, sin, cos
from Vector2 import Vector2


class Line:
    def __init__(self, from_=Vector2(0, 0), to=Vector2(0, 0), elementFrom=None, elementTo=None, chiralFrom=False, chiralTo=False):
        """ A class representing a line.
{from_: Vector2} [from=new Vector2(0, 0)] A vector marking the beginning of the line.
{to: Vector2} [to=new Vector2(0, 0)] A vector marking the end of the line.
{elementFrom: str} [elementFrom=null] A one-letter representation of the element associated with the vector marking the beginning of the line.
{elementTo: str} [elementTo=null] A one-letter representation of the element associated with the vector marking the end of the line.
{chiralFrom: bool} [chiralFrom=false] Whether or not the from atom is a chiral center.
{chiralTo: bool} [chiralTo=false] Whether or not the to atom is a chiral center. """

        self.from_ = from_
        self.to = to
        self.elementFrom = elementFrom
        self.elementTo = elementTo
        self.chiralFrom = chiralFrom
        self.chiralTo = chiralTo

    def clone(self) -> 'Line':
        'Clones this line and returns the clone.'
        return Line(self.from_.clone(), self.to.clone(), self.elementFrom, self.elementTo)

    def get_length(self) -> float:
        'Returns the length of this line.'
        return sqrt((self.to.x - self.from_.x) ** 2 + (self.to.y - self.from_.y) ** 2)

    def get_angle(self) -> float:
        'Returns the angle of the line in relation to the coordinate system (the x-axis).'
        diff = Vector2.subtract(self.get_right_vector(),
                                self.get_left_vector())
        return diff.angle()

    def get_right_vector(self) -> 'Vector2':
        'Returns the right vector (the vector with the larger x value).'
        return self.to if self.from_.x < self.to.x else self.from_

    def get_left_vector(self) -> 'Vector2':
        'Returns the left vector (the vector with the smaller x value).'
        return self.from_ if self.from_.x < self.to.x else self.to

    def get_right_element(self) -> str:
        'Returns the element associated with the right vector (the vector with the larger x value).'
        return self.elementTo if self.from_.x < self.to.x else self.elementFrom

    def get_left_element(self) -> str:
        'Returns the element associated with the left vector (the vector with the smaller x value).'
        return self.elementFrom if self.from_.x < self.to.x else self.elementTo

    def get_right_chiral(self) -> bool:
        'Returns whether or not the atom associated with the right vector (the vector with the larger x value) is a chiral center.'
        return self.chiralTo if self.from_.x < self.to.x else self.chiralFrom

    def get_left_chiral(self) -> bool:
        'Returns whether or not the atom associated with the left vector (the vector with the smaller x value) is a chiral center.'
        return self.chiralFrom if self.from_.x < self.to.x else self.chiralTo

    def set_right_vector(self, x: float, y: float) -> 'Line':
        'Set the value of the right vector.'
        if self.from_.x < self.to.x:
            self.to.x = x
            self.to.y = y
        else:
            self.from_.x = x
            self.from_.y = y
        return self

    def set_left_vector(self, x: float, y: float) -> 'Line':
        'Set the value of the left vector.'
        if self.from_.x < self.to.x:
            self.from_.x = x
            self.from_.y = y
        else:
            self.to.x = x
            self.to.y = y
        return self

    def rotate_to_x_axis(self) -> 'Line':
        'Rotates this line to be aligned with the x-axis. The center of rotation is the left vector.'
        left = self.get_left_vector()
        self.set_right_vector(left.x + self.get_length(), left.y)
        return self

    def rotate(self, theta: float) -> 'Line':
        'Rotate the line by a given value (in radians). The center of rotation is the left vector.'
        l = self.get_left_vector()
        r = self.get_right_vector()
        sin_theta = sin(theta)
        cos_theta = cos(theta)
        x = cos_theta * (r.x - l.x) - sin_theta * (r.y - l.y) + l.x
        y = sin_theta * (r.x - l.x) + cos_theta * (r.y - l.y) + l.y
        self.set_right_vector(x, y)
        return self

    def shorten_from(self, by: float) -> 'Line':
        'Shortens this line from the "from" direction by a given value (in pixels).'
        f = Vector2.subtract(self.to, self.from_)
        f.normalize()
        f.multiply_scalar(by)
        self.from_.add(f)
        return self

    def shorten_to(self, by: float) -> 'Line':
        'Shortens this line from the "to" direction by a given value (in pixels).'
        f = Vector2.subtract(self.from_, self.to)
        f.normalize()
        f.multiply_scalar(by)
        self.to.add(f)
        return self

    def shorten_right(self, by: float) -> 'Line':
        'Shorten the right side.'
        if self.from_.x < self.to.x:
            self.shorten_to(by)
        else:
            self.shorten_from(by)
        return self

    def shorten_left(self, by: float) -> 'Line':
        'Shorten the left side.'
        if self.from_.x < self.to.x:
            self.shorten_from(by)
        else:
            self.shorten_to(by)
        return self

    def shorten(self, by: float) -> 'Line':
        'Shortens this line from both directions by a given value (in pixels).'
        f = Vector2.subtract(self.from_, self.to)
        f.normalize()
        f.multiplyScalar(by / 2.0)
        self.to.add(f)
        self.from_.subtract(f)
        return self
