from math import atan2, sqrt, sin, cos


class Vector2:
    def __init__(self, x=0, y=0):
        self.x = x
        self.y = y

    def clone(self):
        return Vector2(self.x, self.y)

    @staticmethod
    def subtract(v1, v2):
        return Vector2(v1.x - v2.x, v1.y - v2.y)

    def angle(self):
        return atan2(self.y, self.x)

    def normalize(self):
        length = self.length()
        if length != 0:
            self.x /= length
            self.y /= length

    def length(self):
        return sqrt(self.x ** 2 + self.y ** 2)

    def multiply_scalar(self, scalar):
        self.x *= scalar
        self.y *= scalar

    def add(self, other):
        self.x += other.x
        self.y += other.y

    def subtract(self, other):
        self.x -= other.x
        self.y -= other.y


class Line:
    def __init__(self, from_=Vector2(0, 0), to=Vector2(0, 0), elementFrom=None, elementTo=None, chiralFrom=False, chiralTo=False):
        self.from_ = from_
        self.to = to
        self.elementFrom = elementFrom
        self.elementTo = elementTo
        self.chiralFrom = chiralFrom
        self.chiralTo = chiralTo

    def clone(self):
        return Line(self.from_.clone(), self.to.clone(), self.elementFrom, self.elementTo)

    def get_length(self):
        return sqrt((self.to.x - self.from_.x) ** 2 + (self.to.y - self.from_.y) ** 2)

    def get_angle(self):
        diff = Vector2.subtract(self.get_right_vector(),
                                self.get_left_vector())
        return diff.angle()

    def get_right_vector(self):
        return self.to if self.from_.x < self.to.x else self.from_

    def get_left_vector(self):
        return self.from_ if self.from_.x < self.to.x else self.to

    def get_right_element(self):
        return self.elementTo if self.from_.x < self.to.x else self.elementFrom

    def get_left_element(self):
        return self.elementFrom if self.from_.x < self.to.x else self.elementTo

    def get_right_chiral(self):
        return self.chiralTo if self.from_.x < self.to.x else self.chiralFrom

    def get_left_chiral(self):
        return self.chiralFrom if self.from_.x < self.to.x else self.chiralTo

    def set_right_vector(self, x, y):
        if self.from_.x < self.to.x:
            self.to.x = x
            self.to.y = y
        else:
            self.from_.x = x
            self.from_.y = y
        return self

    def set_left_vector(self, x, y):
        if self.from_.x < self.to.x:
            self.from_.x = x
            self.from_.y = y
        else:
            self.to.x = x
            self.to.y = y
        return self

    def rotate_to_x_axis(self):
        left = self.get_left_vector()
        self.set_right_vector(left.x + self.get_length(), left.y)
        return self

    def rotate(self, theta):
        l = self.get_left_vector()
        r = self.get_right_vector()
        sin_theta = sin(theta)
        cos_theta = cos(theta)
        x = cos_theta * (r.x - l.x) - sin_theta * (r.y - l.y) + l.x
        y = sin_theta * (r.x - l.x) + cos_theta * (r.y - l.y) + l.y
        self.set_right_vector(x, y)
        return self

    def shorten_from(self, by):
        f = Vector2.subtract(self.to, self.from_)
        f.normalize()
        f.multiply_scalar(by)
        self.from_.add(f)
        return self

    def shorten_to(self, by):
        f = Vector2.subtract(self.from_, self.to)
        f.normalize()
        f.multiply_scalar(by)
        self.to.add(f)
        return self

    def shorten_right(self, by):
        if self.from_.x < self.to.x:
            self.shorten_to(by)
        else:
            self.shorten_from(by)
        return self

    def shorten_left(self, by):
        if self.from_.x < self.to.x:
            self.shorten_from(by)
        else:
            self.shorten_to(by)
        return self

    def shorten(self, by):
        f = Vector2.subtract(self.from_, self.to)
        f.normalize()
        f.multiply_scalar(by / 2.0)
        self.to.add(f)
        self.from_.subtract(f)
        return self
