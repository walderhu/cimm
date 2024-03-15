from math import atan2, sqrt, sin, cos, isnan, acos
from typing import Union, List


class Vector2:
    'A class representing a 2D vector.'

    def __init__(self, x: Union[float, 'Vector2'], y: float) -> None:
        """ The constructor of the class Vector2.
{x: Union[float, 'Vector2']} x The initial x coordinate value or, if the single argument, a Vector2 object.
{y: float} y The initial y coordinate value.
        """
        if all(arg is None for arg in (x, y)):
            self.x, self.y = 0, 0
        elif (x is not None) and (y is None):
            self.x, self.y = x.x, x.y
        else:
            self.x, self.y = x, x

    def clone(self) -> 'Vector2':
        'Clones this vector and returns the clone.'
        return Vector2(self.x, self.y)

    def toString(self) -> str:
        'Returns a string representation of this vector.'
        return f'({str(self.x)},{str(self.y)})'

    def __add__(self, vect: 'Vector2') -> 'Vector2':
        new_x = self.x + vect.x
        new_y = self.y + vect.y
        return Vector2(new_x, new_y)

    @staticmethod
    def add(vec1: 'Vector2', vec2: 'Vector2') -> 'Vector2':
        'Add the x and y coordinate values of a vector to the x and y coordinate values of this vector.'
        return vec1 + vec2

    def __sub__(self, vec: 'Vector2') -> 'Vector2':
        new_x = self.x - vec.x
        new_y = self.y - vec.y
        return Vector2(new_x, new_y)
    
    @staticmethod
    def subtract(vec1: 'Vector2', vec2: 'Vector2') -> 'Vector2':
        'Subtract the x and y coordinate values of a vector from the x and y coordinate values of this vector.'
        return vec1 - vec2

    def __truediv__(self, vec: 'Vector2') -> 'Vector2':
        return Vector2(self, 1 / vec)
    
    @staticmethod
    def divide(vec1: 'Vector2', vec2: 'Vector2') -> 'Vector2':
        'Divide the x and y coordinate values of this vector by a scalar.'
        return vec1 / vec2
    
    def __mul__(self, val: 'Vector2') -> 'Vector2':
        if isinstance(val, Vector2):
            new_x = self.x * val.x
            new_y = self.y * val.y
        else:
            new_x = self.x * val
            new_y = self.y * val
        return Vector2(new_x, new_y)
    
    def __rmul__(self, scalar: 'Vector2') -> 'Vector2':
        return Vector2(self, scalar)
    
    @staticmethod
    def multiply(vec1: 'Vector2', vec2: 'Vector2') -> 'Vector2':
        'Multiply the x and y coordinate values of this vector by the values of another vector.'
        return vec1 * vec2
    
    @staticmethod
    def multiplyScalar(vec1: 'Vector2', scalar: 'Vector2') -> 'Vector2':
        'Multiply the x and y coordinate values of this vector by a scalar.'
        return vec1 * scalar
    
    def __neg__(self) -> 'Vector2':
        new_x = -self.x
        new_y = -self.y
        return Vector2(new_x, new_y)
    
    @staticmethod
    def invert(self) -> 'Vector2':
        'Inverts this vector. Same as multiply(-1.0).'
        return Vector2.__neg__(self)
    



    def angle(self) -> float:
        'Returns the angle of this vector in relation to the coordinate system.'
        return atan2(self.y, self.x)

    def distance(self, vec: 'Vector2') -> float:
        'Returns the euclidean distance between this vector and another vector.'
        return sqrt((vec.x - self.x) * (vec.x - self.x) + (vec.y - self.y) * (vec.y - self.y))

    def distanceSq(self, vec: 'Vector2') -> float:
        'Returns the squared euclidean distance between this vector and another vector. When only the relative distances of a set of vectors are needed, this is is less expensive than using distance(vec).'
        return (vec.x - self.x) * (vec.x - self.x) + (vec.y - self.y) * (vec.y - self.y)

    def clockwise(self, vec: 'Vector2') -> int:
        'Checks whether or not this vector is in a clockwise or counter-clockwise rotational direction compared to another vector in relation to the coordinate system.'
        determinant = self.x * vec.y - self.y * vec.x
        return 1 if determinant > 0 else (-1 if determinant < 0 else 0)

    def relativeClockwise(self, center: 'Vector2', vec: 'Vector2') -> int:
        'Checks whether or not this vector is in a clockwise or counter-clockwise rotational direction compared to another vector in relation to an arbitrary third vector.'
        determinant = (self.y - center.y) * (vec.x - center.x) - (self.x - center.x) * (vec.y - center.y)
        return 1 if determinant > 0 else (-1 if determinant < 0 else 0)

    def rotate(self, angle: float) -> 'Vector2':
        'Rotates this vector by a given number of radians around the origin of the coordinate system.'
        x, y, cosAngle, sinAngle = self.x, self.y, cos(angle), sin(angle)
        self.x = x * cosAngle - y * sinAngle
        self.y = x * sinAngle + y * cosAngle
        return self

    def rotateAround(self, angle: float, vec: 'Vector2') -> 'Vector2':
        'Rotates this vector by a given number of radians around a specified point.'
        sinAngle = sin(angle)
        cosAngle = cos(angle)
        self -= vec
        self.x = self.x * cosAngle - self.y * sinAngle
        self.y = self.x * sinAngle + self.y * cosAngle
        self += vec
        return self


    def rotateTo(self, vec: 'Vector2', center: 'Vector2', offsetAngle=0.0) -> 'Vector2':
        'Rotate a vector around a given center to the same angle as another vector (so that the two vectors and the center are in a line, with both vectors on one side of the center), keeps the distance from this vector to the center.'
        self.x += 0.001
        self.y -= 0.001
        angle = Vector2.angle(vec - center, self - center)
        self.rotateAround(angle + offsetAngle, center)
        return self

    def rotateAwayFrom(self, vec: 'Vector2', center: 'Vector2', angle: float) -> None:
        'Rotates the vector away from a specified vector around a center.'
        self.rotateAround(angle, center)
        distSqA = self.distanceSq(vec)
        self.rotateAround(-2.0 * angle, center)
        distSqB = self.distanceSq(vec)
        if distSqB < distSqA:
            self.rotateAround(2.0 * angle, center)




    def getRotateAwayFromAngle(self, vec: 'Vector2', center: 'Vector2', angle: float) -> float:
        'Returns the angle in radians used to rotate this vector towards a given vector.'
        tmp = self.clone()
        tmp.rotateAround(angle, center)
        distSqA = tmp.distanceSq(vec)
        tmp.rotateAround(-2.0 * angle, center)
        distSqB = tmp.distanceSq(vec)
        return angle if distSqB < distSqA else -angle

    def getRotateTowardsAngle(self, vec: 'Vector2', center: 'Vector2', angle: float) -> float:
        'Gets the angles between this vector and another vector around a common center of rotation.'
        tmp = self.clone()
        tmp.rotateAround(angle, center)
        distSqA = tmp.distanceSq(vec)
        tmp.rotateAround(-2.0 * angle, center)
        distSqB = tmp.distanceSq(vec)
        return angle if distSqB > distSqA else -angle

    def getRotateToAngle(self, vec: 'Vector2', center: 'Vector2') -> float:
        a = Vector2.subtract(self, center)
        b = Vector2.subtract(vec, center)
        angle = Vector2.angle(b, a)
        return 0.0 if isnan(angle) else angle

    def isInPolygon(self, polygon: List['Vector2']) -> bool:
        'Its not always a given, that the polygon is convex (-> sugars)'
        odd_nodes = False
        j = len(polygon) - 1
        for i in range(len(polygon)):
            if (polygon[i].y < self.y and polygon[j].y >= self.y) or (polygon[j].y < self.y and polygon[i].y >= self.y):
                if polygon[i].x + (self.y - polygon[i].y) / (polygon[j].y - polygon[i].y) * (polygon[j].x - polygon[i].x) < self.x:
                    odd_nodes = not odd_nodes
            j = i
        return odd_nodes

    def __len__(self):
        return sqrt((self.x ** 2) + (self.y ** 2))

    def length(self) -> float:
        'Returns the length of this vector.'
        return len(self)

    def lengthSq(self) -> float:
        'Returns the square of the length of this vector.'
        return (self.x **2) + (self.y ** 2)

    def normalize(self) -> 'Vector2':
        'Normalizes this vector.'
        self /= len(self)
        return self

    def normalized(self) -> 'Vector2':
        'Returns a normalized copy of this vector.'
        return self / len(self)
    








    def whichSide(self, vecA: 'Vector2', vecB: 'Vector2') -> float:
        'Calculates which side of a line spanned by two vectors this vector is.'
        return (self.x - vecA.x) * (vecB.y - vecA.y) - (self.y - vecA.y) * (vecB.x - vecA.x)

    def sameSideAs(self, vecA: 'Vector2', vecB: 'Vector2', vecC: 'Vector2') -> bool:
        'Checks whether or not this vector is on the same side of a line spanned by two vectors as another vector.'
        d = self.whichSide(vecA, vecB)
        dRef = vecC.whichSide(vecA, vecB)
        return (d < 0 and dRef < 0) or (d == 0 and dRef == 0) or (d > 0 and dRef > 0)

    @staticmethod
    def midpoint(vecA: 'Vector2', vecB: 'Vector2') -> 'Vector2':
        'Returns the midpoint of a line spanned by two vectors.'
        return Vector2((vecA.x + vecB.x) / 2, (vecA.y + vecB.y) / 2)

    @staticmethod
    def normals(vecA: 'Vector2', vecB: 'Vector2') -> list['Vector2']:
        'Returns the normals of a line spanned by two vectors.'
        delta = Vector2.subtract(vecB, vecA)
        return [
            Vector2(-delta.y, delta.x),
            Vector2(delta.y, -delta.x)
        ]

    @staticmethod
    def units(vecA: 'Vector2', vecB: 'Vector2') -> list['Vector2']:
        'Returns the unit (normalized normal) vectors of a line spanned by two vectors.'
        delta = Vector2.subtract(vecB, vecA)
        return [
            (Vector2(-delta.y, delta.x)).normalize(),
            (Vector2(delta.y, -delta.x)).normalize()
        ]

    @staticmethod
    def divideScalar(vec: 'Vector2', scalar) -> 'Vector2':
        'Divides a vector by a scalar and returns the result as new vector.'
        return vec / scalar

    @staticmethod
    def dot(vecA: 'Vector2', vecB: 'Vector2') -> 'Vector2':
        'Returns the dot product of two vectors.'
        return vecA.x * vecB.x + vecA.y * vecB.y

    @staticmethod
    def angle(vecA: 'Vector2', vecB: 'Vector2') -> float:
        'Returns the angle between two vectors.'
        dot = Vector2.dot(vecA, vecB)
        return acos(dot / (vecA.length() * vecB.length()))

    @staticmethod
    def threePointangle(vecA: 'Vector2', vecB: 'Vector2', vecC: 'Vector2') -> float:
        'Returns the angle between two vectors based on a third vector in between.'
        ab = Vector2.subtract(vecB, vecA)
        bc = Vector2.subtract(vecC, vecB)
        abLength = vecA.distance(vecB)
        bcLength = vecB.distance(vecC)
        return acos(Vector2.dot(ab, bc) / (abLength * bcLength))

    @staticmethod
    def scalarProjection(vecA: 'Vector2', vecB: 'Vector2') -> 'Vector2':
        'Returns the scalar projection of a vector on another vector.'
        unit = vecB.normalized()
        return Vector2.dot(vecA, unit)

    @staticmethod
    def averageDirection(vecs) -> 'Vector2':
        'Returns the average vector (normalized) of the input vectors.'
        avg = Vector2(0, 0)
        for vec in vecs:
            avg += vec
        return avg.normalize()

