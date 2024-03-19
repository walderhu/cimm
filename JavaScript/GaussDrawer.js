// const Vector2 = require('./Vector2')
// const convertImage = require('./PixelsToSvg')
// const chroma = require("chroma-js")
class GaussDrawer {
    constructor(points, weights, width, height, sigma = 0.3, interval = 0, colormap = null, opacity = 1.0, normalized = false) {
        this.points = points;
        this.weights = weights;
        this.width = width;
        this.height = height;
        this.sigma = sigma;
        this.interval = interval;
        this.opacity = opacity;
        this.normalized = normalized;
        if (colormap === null) {
            let piyg11 = [
                "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef",
                "#ffffff",
                "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221"];
            colormap = piyg11;
        }
        this.colormap = colormap;
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }
    setFromArray(arr_points, arr_weights) {
        this.points = [];
        arr_points.forEach(a => {
            this.points.push(new Vector2(a[0], a[1]));
        });
        this.weights = [];
        arr_weights.forEach(w => {
            this.weights.push(w);
        });
    }
    draw() {
        let m = [];
        for (let x = 0; x < this.width; x++) {
            let row = [];
            for (let y = 0; y < this.height; y++) {
                row.push(0.0);
            }
            m.push(row);
        }
        let divisor = 1.0 / (2 * this.sigma ** 2);
        for (let i = 0; i < this.points.length; i++) {
            let v = this.points[i];
            let a = this.weights[i];
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    let v_xy = ((x - v.x) ** 2 + (y - v.y) ** 2) * divisor;
                    let val = a * Math.exp(-v_xy);
                    m[x][y] += val;
                }
            }
        }
        let abs_max = 1.0;
        if (!this.normalized) {
            let max = -Number.MAX_SAFE_INTEGER;
            let min = Number.MAX_SAFE_INTEGER;
            for (let x = 0; x < this.width; x++) {
                for (let y = 0; y < this.height; y++) {
                    if (m[x][y] < min) {
                        min = m[x][y];
                    }
                    if (m[x][y] > max) {
                        max = m[x][y];
                    }
                }
            }
            abs_max = Math.max(Math.abs(min), Math.abs(max));
        }
        const scale = chroma.scale(this.colormap).domain([-1.0, 1.0]);
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (!this.normalized) {
                    m[x][y] = m[x][y] / abs_max;
                }
                if (this.interval !== 0) {
                    m[x][y] = Math.round(m[x][y] / this.interval) * this.interval;
                }
                let [r, g, b] = scale(m[x][y]).rgb();
                this.setPixel(new Vector2(x, y), r, g, b);
            }
        }
    }
    getImage(callback) {
        let image = new Image();
        image.onload = () => {
            this.context.imageSmoothingEnabled = false;
            this.context.drawImage(image, 0, 0, this.width, this.height);
            if (callback) {
                callback(image);
            }
        };
        image.onerror = function (err) {
            console.log(err);
        }
        image.src = this.canvas.toDataURL();
    }
    getSVG() {
        return convertImage(this.context.getImageData(0, 0, this.width, this.height));
    }
    setPixel(vec, r, g, b) {
        this.context.fillStyle = "rgba(" + r + "," + g + "," + b + "," + this.opacity + ")";
        this.context.fillRect(vec.x, vec.y, 1, 1);
    }
}
module.exports = GaussDrawer;