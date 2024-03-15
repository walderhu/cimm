from math import atan2, sqrt, sin, cos, isnan, acos


class Vector2:
    def __init__(self, x, y):
        if all([arg is None for arg in (x, y)]):
            self.x, self.y = 0, 0
        elif (x is not None) and (y is None):
            self.x, self.y = x.x, x.y
        else:
            self.x, self.y = x, x

    def clone(self):
        return Vector2(self.x, self.y)

    def __str__(self):
        return f'({str(self.x)},{str(self.y)})'

    def add(self, vec):
        self.x += vec.x
        self.y += vec.y
        return self

    def subtract(self, vec):
        self.x -= vec.x
        self.y -= vec.y
        return self

    def divide(self, scalar):
        self.x /= scalar
        self.y /= scalar
        return self

    def multiply(self, v):
        self.x *= v.x
        self.y *= v.y
        return self

    def multiplyScalar(self, scalar):
        self.x *= scalar
        self.y *= scalar
        return self

    def invert(self):
        self.x = -self.x
        self.y = -self.y
        return self

    def angle(self):
        return atan2(self.y, self.x)

    def distance(self, vec):
        return sqrt((vec.x - self.x) * (vec.x - self.x) + (vec.y - self.y) * (vec.y - self.y))

    def distanceSq(self, vec):
        return (vec.x - self.x) * (vec.x - self.x) + (vec.y - self.y) * (vec.y - self.y)

    def clockwise(self, vec):
        a = self.y * vec.x
        b = self.x * vec.y
        if a > b:
            return -1
        elif a == b:
            return 0
        else:
            return 1

    def relativeClockwise(self, center, vec):
        a = (self.y - center.y) * (vec.x - center.x)
        b = (self.x - center.x) * (vec.y - center.y)
        if a > b:
            return -1
        elif a == b:
            return 0
        else:
            return 1

    def rotate(self, angle):
        tmp = Vector2(0, 0)
        cosAngle = cos(angle)
        sinAngle = sin(angle)
        tmp.x = self.x * cosAngle - self.y * sinAngle
        tmp.y = self.x * sinAngle + self.y * cosAngle
        self.x = tmp.x
        self.y = tmp.y
        return self

    def rotateAround(self, angle, vec):
        s = sin(angle)
        c = cos(angle)
        self.x -= vec.x
        self.y -= vec.y
        x = self.x * c - self.y * s
        y = self.x * s + self.y * c
        self.x = x + vec.x
        self.y = y + vec.y
        return self

    def rotateTo(self, vec, center, offsetAngle=0.0):
        self.x += 0.001
        self.y -= 0.001
        a = Vector2.subtract(self, center)
        b = Vector2.subtract(vec, center)
        angle = Vector2.angle(b, a)
        self.rotateAround(angle + offsetAngle, center)
        return self

    def rotateAwayFrom(self, vec, center, angle):
        self.rotateAround(angle, center)
        distSqA = self.distanceSq(vec)
        self.rotateAround(-2.0 * angle, center)
        distSqB = self.distanceSq(vec)
        if distSqB < distSqA:
            self.rotateAround(2.0 * angle, center)

    def getRotateAwayFromAngle(self, vec, center, angle):
        tmp = self.clone()
        tmp.rotateAround(angle, center)
        distSqA = tmp.distanceSq(vec)
        tmp.rotateAround(-2.0 * angle, center)
        distSqB = tmp.distanceSq(vec)
        if distSqB < distSqA:
            return angle
        else:
            return -angle

    def getRotateTowardsAngle(self, vec, center, angle):
        tmp = self.clone()
        tmp.rotateAround(angle, center)
        distSqA = tmp.distanceSq(vec)
        tmp.rotateAround(-2.0 * angle, center)
        distSqB = tmp.distanceSq(vec)
        if distSqB > distSqA:
            return angle
        else:
            return -angle

    def getRotateToAngle(self, vec, center):
        a = Vector2.subtract(self, center)
        b = Vector2.subtract(vec, center)
        angle = Vector2.angle(b, a)
        return 0.0 if isnan(angle) else angle

    def isInPolygon(self, polygon):
        inside = False
        for i in range(len(polygon)):
            j = len(polygon) - 1
            if ((polygon[i].y > self.y) != (polygon[j].y > self.y)) and (self.x < (polygon[j].x - polygon[i].x) * (self.y - polygon[i].y) / (polygon[j].y - polygon[i].y) + polygon[i].x):
                inside = not inside
        return inside

    def length(self):
        return sqrt((self.x * self.x) + (self.y * self.y))

    def lengthSq(self):
        return (self.x * self.x) + (self.y * self.y)

    def normalize(self):
        self.divide(self.length())
        return self

    def normalized(self):
        return Vector2.divideScalar(self, self.length())

    def whichSide(self, vecA, vecB):
        return (self.x - vecA.x) * (vecB.y - vecA.y) - (self.y - vecA.y) * (vecB.x - vecA.x)

    def sameSideAs(self, vecA, vecB, vecC):
        d = self.whichSide(vecA, vecB)
        dRef = vecC.whichSide(vecA, vecB)
        return (d < 0 and dRef < 0) or (d == 0 and dRef == 0) or (d > 0 and dRef > 0)

    @staticmethod
    def add(vecA, vecB):
        return Vector2(vecA.x + vecB.x, vecA.y + vecB.y)

    @staticmethod
    def subtract(vecA, vecB):
        return Vector2(vecA.x - vecB.x, vecA.y - vecB.y)

    @staticmethod
    def multiply(vecA, vecB):
        return Vector2(vecA.x * vecB.x, vecA.y * vecB.y)

    @staticmethod
    def multiplyScalar(vec, scalar):
        return Vector2(vec.x, vec.y).multiplyScalar(scalar)

    @staticmethod
    def midpoint(vecA, vecB):
        return Vector2((vecA.x + vecB.x) / 2, (vecA.y + vecB.y) / 2)

    @staticmethod
    def normals(vecA, vecB):
        delta = Vector2.subtract(vecB, vecA)
        return [
            Vector2(-delta.y, delta.x),
            Vector2(delta.y, -delta.x)
        ]

    @staticmethod
    def units(vecA, vecB):
        delta = Vector2.subtract(vecB, vecA)
        return [
            (Vector2(-delta.y, delta.x)).normalize(),
            (Vector2(delta.y, -delta.x)).normalize()
        ]

    @staticmethod
    def divide(vecA, vecB):
        return Vector2(vecA.x / vecB.x, vecA.y / vecB.y)

    @staticmethod
    def divideScalar(vecA, s):
        return Vector2(vecA.x / s, vecA.y / s)

    @staticmethod
    def dot(vecA, vecB):
        return vecA.x * vecB.x + vecA.y * vecB.y

    @staticmethod
    def angle(vecA, vecB):
        dot = Vector2.dot(vecA, vecB)
        return acos(dot / (vecA.length() * vecB.length()))

    @staticmethod
    def threePointangle(vecA, vecB, vecC):
        ab = Vector2.subtract(vecB, vecA)
        bc = Vector2.subtract(vecC, vecB)
        abLength = vecA.distance(vecB)
        bcLength = vecB.distance(vecC)
        return acos(Vector2.dot(ab, bc) / (abLength * bcLength))

    @staticmethod
    def scalarProjection(vecA, vecB):
        unit = vecB.normalized()
        return Vector2.dot(vecA, unit)

    @staticmethod
    def averageDirection(vecs):
        avg = Vector2(0.0, 0.0)
        for i in range(len(vecs)):
            vec = vecs[i]
            avg.add(vec)
        return avg.normalize()
