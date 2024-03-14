class MathHelper {
    static round(value, decimals) {
        decimals = decimals ? decimals : 1;
        return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
    }

    static meanAngle(arr) {
        let sin = 0.0;
        let cos = 0.0;
        for (var i = 0; i < arr.length; i++) {
            sin += Math.sin(arr[i]);
            cos += Math.cos(arr[i]);
        }
        return Math.atan2(sin / arr.length, cos / arr.length);
    }


    static innerAngle(n) {
        return MathHelper.toRad((n - 2) * 180 / n);
    }

    static polyCircumradius(s, n) {
        return s / (2 * Math.sin(Math.PI / n));
    }

    static apothem(r, n) {
        return r * Math.cos(Math.PI / n);
    }

    static apothemFromSideLength(s, n) {
        let r = MathHelper.polyCircumradius(s, n);
        return MathHelper.apothem(r, n);
    }

    static centralAngle(n) {
        return MathHelper.toRad(360 / n);
    }

    static toDeg(rad) {
        return rad * MathHelper.degFactor;
    }

    static toRad(deg) {
        return deg * MathHelper.radFactor;
    }

    static parityOfPermutation(arr) {
        let visited = new Uint8Array(arr.length);
        let evenLengthCycleCount = 0;
        let traverseCycle = function (i, cycleLength = 0) {
            if (visited[i] === 1) {
                return cycleLength;
            }
            cycleLength++;
            visited[i] = 1;
            return traverseCycle(arr[i], cycleLength);
        }

        for (var i = 0; i < arr.length; i++) {
            if (visited[i] === 1) {
                continue;
            }
            let cycleLength = traverseCycle(i);
            evenLengthCycleCount += (1 - cycleLength % 2);
        }
        return evenLengthCycleCount % 2 ? -1 : 1;
    }

    static get radFactor() {
        return Math.PI / 180.0;
    }

    static get degFactor() {
        return 180.0 / Math.PI;
    }

    static get twoPI() {
        return 2.0 * Math.PI;
    }
}

module.exports = MathHelper;