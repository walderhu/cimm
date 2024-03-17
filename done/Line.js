const Vector2 = require('./Vector2')

class Line {
    constructor(from = new Vector2(0, 0), to = new Vector2(0, 0), elementFrom = null, elementTo = null, chiralFrom = false, chiralTo = false) {
        this.from = from;
        this.to = to;
        this.elementFrom = elementFrom;
        this.elementTo = elementTo;
        this.chiralFrom = chiralFrom;
        this.chiralTo = chiralTo;
    }
    clone() {
        return new Line(this.from.clone(), this.to.clone(), this.elementFrom, this.elementTo);
    }
    getLength() {
        return Math.sqrt(Math.pow(this.to.x - this.from.x, 2) +
            Math.pow(this.to.y - this.from.y, 2));
    }
    getAngle() {
        let diff = Vector2.subtract(this.getRightVector(), this.getLeftVector());
        return diff.angle();
    }
    getRightVector() {
        if (this.from.x < this.to.x) {
            return this.to;
        } else {
            return this.from;
        }
    }
    getLeftVector() {
        if (this.from.x < this.to.x) {
            return this.from;
        } else {
            return this.to;
        }
    }
    getRightElement() {
        if (this.from.x < this.to.x) {
            return this.elementTo;
        } else {
            return this.elementFrom;
        }
    }
    getLeftElement() {
        if (this.from.x < this.to.x) {
            return this.elementFrom;
        } else {
            return this.elementTo;
        }
    }
    getRightChiral() {
        if (this.from.x < this.to.x) {
            return this.chiralTo;
        } else {
            return this.chiralFrom;
        }
    }
    getLeftChiral() {
        if (this.from.x < this.to.x) {
            return this.chiralFrom;
        } else {
            return this.chiralTo;
        }
    }
    setRightVector(x, y) {
        if (this.from.x < this.to.x) {
            this.to.x = x;
            this.to.y = y;
        } else {
            this.from.x = x;
            this.from.y = y;
        }
        return this;
    }
    setLeftVector(x, y) {
        if (this.from.x < this.to.x) {
            this.from.x = x;
            this.from.y = y;
        } else {
            this.to.x = x;
            this.to.y = y;
        }
        return this;
    }
    rotateToXAxis() {
        let left = this.getLeftVector();
        this.setRightVector(left.x + this.getLength(), left.y);
        return this;
    }
    rotate(theta) {
        let l = this.getLeftVector();
        let r = this.getRightVector();
        let sinTheta = Math.sin(theta);
        let cosTheta = Math.cos(theta);
        let x = cosTheta * (r.x - l.x) - sinTheta * (r.y - l.y) + l.x;
        let y = sinTheta * (r.x - l.x) - cosTheta * (r.y - l.y) + l.y;
        this.setRightVector(x, y);
        return this;
    }
    shortenFrom(by) {
        let f = Vector2.subtract(this.to, this.from);
        f.normalize();
        f.multiplyScalar(by);
        this.from.add(f);
        return this;
    }
    shortenTo(by) {
        let f = Vector2.subtract(this.from, this.to);
        f.normalize();
        f.multiplyScalar(by);
        this.to.add(f);
        return this;
    }
    shortenRight(by) {
        if (this.from.x < this.to.x) {
            this.shortenTo(by);
        } else {
            this.shortenFrom(by);
        }
        return this;
    }
    shortenLeft(by) {
        if (this.from.x < this.to.x) {
            this.shortenFrom(by);
        } else {
            this.shortenTo(by);
        }
        return this;
    }
    shorten(by) {
        let f = Vector2.subtract(this.from, this.to);
        f.normalize();
        f.multiplyScalar(by / 2.0);
        this.to.add(f);
        this.from.subtract(f);
        return this;
    }
}

module.exports = Line;