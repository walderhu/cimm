from math import pi, sin, cos, atan2

class MathHelper:
    @staticmethod
    def round(value, decimals=1):
        return round(value, decimals)

    @staticmethod
    def meanAngle(arr):
        sin_sum = 0.0
        cos_sum = 0.0
        for angle in arr:
            sin_sum += sin(angle)
            cos_sum += cos(angle)
        return atan2(sin_sum / len(arr), cos_sum / len(arr))

    @staticmethod
    def innerAngle(n):
        return MathHelper.toRad((n - 2) * 180 / n)

    @staticmethod
    def polyCircumradius(s, n):
        return s / (2 * sin(pi / n))

    @staticmethod
    def apothem(r, n):
        return r * cos(pi / n)

    @staticmethod
    def apothemFromSideLength(s, n):
        r = MathHelper.polyCircumradius(s, n)
        return MathHelper.apothem(r, n)

    @staticmethod
    def centralAngle(n):
        return MathHelper.toRad(360 / n)

    @staticmethod
    def toDeg(rad):
        return rad * MathHelper.degFactor()

    @staticmethod
    def toRad(deg):
        return deg * MathHelper.radFactor()

    @staticmethod
    def parityOfPermutation(arr):
        visited = [0] * len(arr)
        evenLengthCycleCount = 0

        def traverseCycle(i, cycleLength=0):
            if visited[i] == 1:
                return cycleLength
            cycleLength += 1
            visited[i] = 1
            return traverseCycle(arr[i], cycleLength)

        for i in range(len(arr)):
            if visited[i] == 1:
                continue
            cycleLength = traverseCycle(i)
            evenLengthCycleCount += (1 - cycleLength % 2)

        return -1 if evenLengthCycleCount % 2 else 1

    @staticmethod
    def radFactor():
        return pi / 180.0

    @staticmethod
    def degFactor():
        return 180.0 / pi

    @staticmethod
    def twoPI():
        return 2.0 * pi


