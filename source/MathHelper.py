from math import pi, sin, cos, atan2


class MathHelper:
    'A static class containing helper functions for math-related tasks.'

    @staticmethod
    def round(value: float, decimals: int = 1) -> float:
        'Rounds a value to a given number of decimals.'
        return round(value, decimals)

    @staticmethod
    def meanAngle(arr: list) -> float:
        'Returns the means of the angles contained in an array. In radians.'
        sin_sum, cos_sum = 0.0, 0.0
        for angle in arr:
            sin_sum += sin(angle)
            cos_sum += cos(angle)
        return atan2(sin_sum / len(arr), cos_sum / len(arr))

    @staticmethod
    def innerAngle(n: int) -> float:
        'Returns the inner angle of a n-sided regular polygon.'
        return MathHelper.toRad((n - 2) * 180 / n)

    @staticmethod
    def polyCircumradius(s: float, n: float) -> float:
        'Returns the circumradius of a n-sided regular polygon with a given side-length.'
        return s / (2 * sin(pi / n))

    @staticmethod
    def apothem(r: float, n: float) -> float:
        'Returns the apothem of a regular n-sided polygon based on its radius.'
        return r * cos(pi / n)

    @staticmethod
    def apothemFromSideLength(s: float, n: float) -> float:
        r = MathHelper.polyCircumradius(s, n)
        return MathHelper.apothem(r, n)

    @staticmethod
    def centralAngle(n: float) -> float:
        'The central angle of a n-sided regular polygon. In radians.'
        return MathHelper.toRad(360 / n)

    @staticmethod
    def toDeg(rad: float) -> float:
        'Convertes radians to degrees.'
        return rad * MathHelper.degFactor()

    @staticmethod
    def toRad(deg: float) -> float:
        'Converts degrees to radians.'
        return deg * MathHelper.radFactor()

    @staticmethod
    def parityOfPermutation(arr: list) -> float:
        'Returns the parity of the permutation (1 or -1)'
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
    def radFactor() -> float:
        'The factor to convert degrees to radians.'
        return pi / 180.0

    @staticmethod
    def degFactor() -> float:
        'The factor to convert radians to degrees.'
        return 180.0 / pi

    @staticmethod
    def twoPI() -> float:
        'Two times PI.'
        return 2.0 * pi
