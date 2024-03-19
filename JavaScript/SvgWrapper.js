// const {
//     getChargeText
// } = require('./UtilityFunctions');
// const Line = require('./Line');
// const Vector2 = require('./Vector2');
// const MathHelper = require('./MathHelper');

function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
class SvgWrapper {
    constructor(themeManager, target, options, clear = true) {
        if (typeof target === 'string' || target instanceof String) {
            this.svg = document.getElementById(target);
        } else {
            this.svg = target;
        }
        this.container = null;
        this.opts = options;
        this.uid = makeid(5);
        this.gradientId = 0;
        this.backgroundItems = []
        this.paths = [];
        this.vertices = [];
        this.gradients = [];
        this.highlights = [];
        this.drawingWidth = 0;
        this.drawingHeight = 0;
        this.halfBondThickness = this.opts.bondThickness / 2.0;
        this.themeManager = themeManager;
        this.maskElements = [];
        this.maxX = -Number.MAX_VALUE;
        this.maxY = -Number.MAX_VALUE;
        this.minX = Number.MAX_VALUE;
        this.minY = Number.MAX_VALUE;
        if (clear) {
            while (this.svg.firstChild) {
                this.svg.removeChild(this.svg.firstChild);
            }
        }
        this.style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        this.style.appendChild(document.createTextNode(`
                .element {
                    font: ${this.opts.fontSizeLarge}pt ${this.opts.fontFamily};
                }
                .sub {
                    font: ${this.opts.fontSizeSmall}pt ${this.opts.fontFamily};
                }
            `));
        if (this.svg) {
            this.svg.appendChild(this.style);
        } else {
            this.container = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            container.appendChild(this.style);
        }
    }
    constructSvg() {
        let defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs'),
            masks = document.createElementNS('http://www.w3.org/2000/svg', 'mask'),
            background = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
            highlights = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
            paths = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
            vertices = document.createElementNS('http://www.w3.org/2000/svg', 'g'),
            pathChildNodes = this.paths;
        let mask = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        mask.setAttributeNS(null, 'x', this.minX);
        mask.setAttributeNS(null, 'y', this.minY);
        mask.setAttributeNS(null, 'width', this.maxX - this.minX);
        mask.setAttributeNS(null, 'height', this.maxY - this.minY);
        mask.setAttributeNS(null, 'fill', 'white');
        masks.appendChild(mask);
        masks.setAttributeNS(null, 'id', this.uid + '-text-mask');
        for (let path of pathChildNodes) {
            paths.appendChild(path);
        }
        for (let backgroundItem of this.backgroundItems) {
            background.appendChild(backgroundItem)
        }
        for (let highlight of this.highlights) {
            highlights.appendChild(highlight)
        }
        for (let vertex of this.vertices) {
            vertices.appendChild(vertex);
        }
        for (let mask of this.maskElements) {
            masks.appendChild(mask);
        }
        for (let gradient of this.gradients) {
            defs.appendChild(gradient);
        }
        paths.setAttributeNS(null, 'mask', 'url(#' + this.uid + '-text-mask)');
        this.updateViewbox(this.opts.scale);
        background.setAttributeNS(null, 'style', `transform: translateX(${this.minX}px) translateY(${this.minY}px)`);
        if (this.svg) {
            this.svg.appendChild(defs);
            this.svg.appendChild(masks);
            this.svg.appendChild(background);
            this.svg.appendChild(highlights);
            this.svg.appendChild(paths);
            this.svg.appendChild(vertices);
        } else {
            this.container.appendChild(defs);
            this.container.appendChild(masks);
            this.container.appendChild(background);
            this.container.appendChild(paths);
            this.container.appendChild(vertices);
            return this.container;
        }
    }
    addLayer(svg) {
        this.backgroundItems.push(svg.firstChild);
    }
    createGradient(line) {
        let gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient'),
            gradientUrl = this.uid + `-line-${this.gradientId++}`,
            l = line.getLeftVector(),
            r = line.getRightVector(),
            fromX = l.x,
            fromY = l.y,
            toX = r.x,
            toY = r.y;
        gradient.setAttributeNS(null, 'id', gradientUrl);
        gradient.setAttributeNS(null, 'gradientUnits', 'userSpaceOnUse');
        gradient.setAttributeNS(null, 'x1', fromX);
        gradient.setAttributeNS(null, 'y1', fromY);
        gradient.setAttributeNS(null, 'x2', toX);
        gradient.setAttributeNS(null, 'y2', toY);
        let firstStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        firstStop.setAttributeNS(null, 'stop-color', this.themeManager.getColor(line.getLeftElement()) || this.themeManager.getColor('C'));
        firstStop.setAttributeNS(null, 'offset', '20%');
        let secondStop = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
        secondStop.setAttributeNS(null, 'stop-color', this.themeManager.getColor(line.getRightElement() || this.themeManager.getColor('C')));
        secondStop.setAttributeNS(null, 'offset', '100%');
        gradient.appendChild(firstStop);
        gradient.appendChild(secondStop);
        this.gradients.push(gradient);
        return gradientUrl;
    }
    createSubSuperScripts(text, shift) {
        let elem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        elem.setAttributeNS(null, 'baseline-shift', shift);
        elem.appendChild(document.createTextNode(text));
        elem.setAttributeNS(null, 'class', 'sub');
        return elem;
    }
    static createUnicodeCharge(n) {
        if (n === 1) {
            return '⁺';
        }
        if (n === -1) {
            return '⁻';
        }
        if (n > 1) {
            return SvgWrapper.createUnicodeSuperscript(n) + '⁺';
        }
        if (n < -1) {
            return SvgWrapper.createUnicodeSuperscript(n) + '⁻';
        }
        return ''
    }
    determineDimensions(vertices) {
        for (var i = 0; i < vertices.length; i++) {
            if (!vertices[i].value.isDrawn) {
                continue;
            }
            let p = vertices[i].position;
            if (this.maxX < p.x) this.maxX = p.x;
            if (this.maxY < p.y) this.maxY = p.y;
            if (this.minX > p.x) this.minX = p.x;
            if (this.minY > p.y) this.minY = p.y;
        }
        let padding = this.opts.padding;
        this.maxX += padding;
        this.maxY += padding;
        this.minX -= padding;
        this.minY -= padding;
        this.drawingWidth = this.maxX - this.minX;
        this.drawingHeight = this.maxY - this.minY;
    }
    updateViewbox(scale) {
        let x = this.minX;
        let y = this.minY;
        let width = this.maxX - this.minX;
        let height = this.maxY - this.minY;
        if (scale <= 0.0) {
            if (width > height) {
                let diff = width - height;
                height = width;
                y -= diff / 2.0;
            } else {
                let diff = height - width;
                width = height;
                x -= diff / 2.0;
            }
        } else {
            if (this.svg) {
                this.svg.style.width = scale * width + 'px';
                this.svg.style.height = scale * height + 'px';
            }
        }
        this.svg.setAttributeNS(null, 'viewBox', `${x} ${y} ${width} ${height}`);
    }
    drawBall(x, y, elementName) {
        let r = this.opts.bondLength / 4.5;
        if (x - r < this.minX) {
            this.minX = x - r;
        }
        if (x + r > this.maxX) {
            this.maxX = x + r;
        }
        if (y - r < this.minY) {
            this.minY = y - r;
        }
        if (y + r > this.maxY) {
            this.maxY = y + r;
        }
        let ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ball.setAttributeNS(null, 'cx', x);
        ball.setAttributeNS(null, 'cy', y);
        ball.setAttributeNS(null, 'r', r);
        ball.setAttributeNS(null, 'fill', this.themeManager.getColor(elementName));
        this.vertices.push(ball);
    }
    drawWedge(line) {
        let l = line.getLeftVector().clone(),
            r = line.getRightVector().clone();
        let normals = Vector2.normals(l, r);
        normals[0].normalize();
        normals[1].normalize();
        let isRightChiralCenter = line.getRightChiral();
        let start = l,
            end = r;
        if (isRightChiralCenter) {
            start = r;
            end = l;
        }
        let t = Vector2.add(start, Vector2.multiplyScalar(normals[0], this.halfBondThickness)),
            u = Vector2.add(end, Vector2.multiplyScalar(normals[0], 3.0 + this.opts.fontSizeLarge / 4.0)),
            v = Vector2.add(end, Vector2.multiplyScalar(normals[1], 3.0 + this.opts.fontSizeLarge / 4.0)),
            w = Vector2.add(start, Vector2.multiplyScalar(normals[1], this.halfBondThickness));
        let polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon'),
            gradient = this.createGradient(line, l.x, l.y, r.x, r.y);
        polygon.setAttributeNS(null, 'points', `${t.x},${t.y} ${u.x},${u.y} ${v.x},${v.y} ${w.x},${w.y}`);
        polygon.setAttributeNS(null, 'fill', `url('#${gradient}')`);
        this.paths.push(polygon);
    }
    drawAtomHighlight(x, y, color = "#03fc9d") {
        let ball = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        ball.setAttributeNS(null, 'cx', x);
        ball.setAttributeNS(null, 'cy', y);
        ball.setAttributeNS(null, 'r', this.opts.bondLength / 3);
        ball.setAttributeNS(null, 'fill', color);
        this.highlights.push(ball);
    }
    drawDashedWedge(line) {
        if (isNaN(line.from.x) || isNaN(line.from.y) ||
            isNaN(line.to.x) || isNaN(line.to.y)) {
            return;
        }
        let l = line.getLeftVector().clone(),
            r = line.getRightVector().clone(),
            normals = Vector2.normals(l, r);
        normals[0].normalize();
        normals[1].normalize();
        let isRightChiralCenter = line.getRightChiral(),
            start,
            end;
        if (isRightChiralCenter) {
            start = r;
            end = l;
        } else {
            start = l;
            end = r;
        }
        let dir = Vector2.subtract(end, start).normalize(),
            length = line.getLength(),
            step = 1.25 / (length / (this.opts.bondLength / 10.0)),
            changed = false;
        let gradient = this.createGradient(line);
        for (let t = 0.0; t < 1.0; t += step) {
            let to = Vector2.multiplyScalar(dir, t * length),
                startDash = Vector2.add(start, to),
                width = this.opts.fontSizeLarge / 2.0 * t,
                dashOffset = Vector2.multiplyScalar(normals[0], width);
            startDash.subtract(dashOffset);
            let endDash = startDash.clone();
            endDash.add(Vector2.multiplyScalar(dashOffset, 2.0));
            this.drawLine(new Line(startDash, endDash), null, gradient);
        }
    }
    drawDebugPoint(x, y, debugText = '', color = '#f00') {
        let point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttributeNS(null, 'cx', x);
        point.setAttributeNS(null, 'cy', y);
        point.setAttributeNS(null, 'r', '2');
        point.setAttributeNS(null, 'fill', '#f00');
        this.vertices.push(point);
        this.drawDebugText(x, y, debugText);
    }
    drawDebugText(x, y, text) {
        let textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttributeNS(null, 'x', x);
        textElem.setAttributeNS(null, 'y', y);
        textElem.setAttributeNS(null, 'class', 'debug');
        textElem.setAttributeNS(null, 'fill', '#ff0000');
        textElem.setAttributeNS(null, 'style', `
                font: 5px Droid Sans, sans-serif;
            `);
        textElem.appendChild(document.createTextNode(text));
        this.vertices.push(textElem);
    }
    drawRing(x, y, s) {
        let circleElem = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        let radius = MathHelper.apothemFromSideLength(this.opts.bondLength, s);
        circleElem.setAttributeNS(null, 'cx', x);
        circleElem.setAttributeNS(null, 'cy', y);
        circleElem.setAttributeNS(null, 'r', radius - this.opts.bondSpacing);
        circleElem.setAttributeNS(null, 'stroke', this.themeManager.getColor('C'));
        circleElem.setAttributeNS(null, 'stroke-width', this.opts.bondThickness);
        circleElem.setAttributeNS(null, 'fill', 'none');
        this.paths.push(circleElem);
    }
    drawLine(line, dashed = false, gradient = null, linecap = 'round') {
        let opts = this.opts,
            stylesArr = [
                ['stroke-width', this.opts.bondThickness],
                ['stroke-linecap', linecap],
                ['stroke-dasharray', dashed ? '5, 5' : 'none'],
            ],
            l = line.getLeftVector(),
            r = line.getRightVector(),
            fromX = l.x,
            fromY = l.y,
            toX = r.x,
            toY = r.y;
        let styles = stylesArr.map(sub => sub.join(':')).join(';'),
            lineElem = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        lineElem.setAttributeNS(null, 'x1', fromX);
        lineElem.setAttributeNS(null, 'y1', fromY);
        lineElem.setAttributeNS(null, 'x2', toX);
        lineElem.setAttributeNS(null, 'y2', toY);
        lineElem.setAttributeNS(null, 'style', styles);
        this.paths.push(lineElem);
        if (gradient == null) {
            gradient = this.createGradient(line, fromX, fromY, toX, toY);
        }
        lineElem.setAttributeNS(null, 'stroke', `url('#${gradient}')`);
    }
    drawPoint(x, y, elementName) {
        let r = 0.75;
        if (x - r < this.minX) {
            this.minX = x - r;
        }
        if (x + r > this.maxX) {
            this.maxX = x + r;
        }
        if (y - r < this.minY) {
            this.minY = y - r;
        }
        if (y + r > this.maxY) {
            this.maxY = y + r;
        }
        let mask = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        mask.setAttributeNS(null, 'cx', x);
        mask.setAttributeNS(null, 'cy', y);
        mask.setAttributeNS(null, 'r', '1.5');
        mask.setAttributeNS(null, 'fill', 'black');
        this.maskElements.push(mask);
        let point = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        point.setAttributeNS(null, 'cx', x);
        point.setAttributeNS(null, 'cy', y);
        point.setAttributeNS(null, 'r', r);
        point.setAttributeNS(null, 'fill', this.themeManager.getColor(elementName));
        this.vertices.push(point);
    }
    drawText(x, y, elementName, hydrogens, direction, isTerminal, charge, isotope, totalVertices, attachedPseudoElement = {}) {
        let text = [];
        let display = elementName;
        if (charge !== 0 && charge !== null) {
            display += SvgWrapper.createUnicodeCharge(charge);
        }
        if (isotope !== 0 && isotope !== null) {
            display = SvgWrapper.createUnicodeSuperscript(isotope) + display;
        }
        text.push([display, elementName]);
        if (hydrogens === 1) {
            text.push(['H', 'H'])
        } else if (hydrogens > 1) {
            text.push(['H' + SvgWrapper.createUnicodeSubscript(hydrogens), 'H'])
        }
        if (charge === 1 && elementName === 'N' && attachedPseudoElement.hasOwnProperty('0O') &&
            attachedPseudoElement.hasOwnProperty('0O-1')) {
            attachedPseudoElement = { '0O': { element: 'O', count: 2, hydrogenCount: 0, previousElement: 'C', charge: '' } }
            charge = 0;
        }
        for (let key in attachedPseudoElement) {
            if (!attachedPseudoElement.hasOwnProperty(key)) {
                continue;
            }
            let pe = attachedPseudoElement[key];
            let display = pe.element;
            if (pe.count > 1) {
                display += SvgWrapper.createUnicodeSubscript(pe.count);
            }
            if (pe.charge !== '') {
                display += SvgWrapper.createUnicodeCharge(charge);
            }
            text.push([display, pe.element]);
            if (pe.hydrogenCount === 1) {
                text.push(['H', 'H'])
            } else if (pe.hydrogenCount > 1) {
                text.push(['H' + SvgWrapper.createUnicodeSubscript(pe.hydrogenCount), 'H'])
            }
        }
        this.write(text, direction, x, y, totalVertices === 1);
    }
    write(text, direction, x, y, singleVertex) {
        let bbox = SvgWrapper.measureText(text[0][1], this.opts.fontSizeLarge, this.opts.fontFamily);
        if (direction === 'left' && text[0][0] !== text[0][1]) {
            bbox.width *= 2.0;
        }
        if (singleVertex) {
            if (x + bbox.width * text.length > this.maxX) {
                this.maxX = x + bbox.width * text.length;
            }
            if (x - bbox.width / 2.0 < this.minX) {
                this.minX = x - bbox.width / 2.0;
            }
            if (y - bbox.height < this.minY) {
                this.minY = y - bbox.height;
            }
            if (y + bbox.height > this.maxY) {
                this.maxY = y + bbox.height;
            }
        } else {
            if (direction !== 'right') {
                if (x + bbox.width * text.length > this.maxX) {
                    this.maxX = x + bbox.width * text.length;
                }
                if (x - bbox.width * text.length < this.minX) {
                    this.minX = x - bbox.width * text.length;
                }
            } else if (direction !== 'left') {
                if (x + bbox.width * text.length > this.maxX) {
                    this.maxX = x + bbox.width * text.length;
                }
                if (x - bbox.width / 2.0 < this.minX) {
                    this.minX = x - bbox.width / 2.0;
                }
            }
            if (y - bbox.height < this.minY) {
                this.minY = y - bbox.height;
            }
            if (y + bbox.height > this.maxY) {
                this.maxY = y + bbox.height;
            }
            if (direction === 'down') {
                if (y + 0.8 * bbox.height * text.length > this.maxY) {
                    this.maxY = y + 0.8 * bbox.height * text.length;
                }
            }
            if (direction === 'up') {
                if (y - 0.8 * bbox.height * text.length < this.minY) {
                    this.minY = y - 0.8 * bbox.height * text.length;
                }
            }
        }
        let cx = x;
        let cy = y;
        let textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttributeNS(null, 'class', 'element');
        let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        textElem.setAttributeNS(null, 'fill', '#ffffff');
        if (direction === 'left') {
            text = text.reverse();
        }
        if (direction === 'right' || direction === 'down' || direction === 'up') {
            x -= bbox.width / 2.0;
        }
        if (direction === 'left') {
            x += bbox.width / 2.0;
        }
        text.forEach((part, i) => {
            const display = part[0];
            const elementName = part[1];
            let tspanElem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspanElem.setAttributeNS(null, 'fill', this.themeManager.getColor(elementName));
            tspanElem.textContent = display;
            if (direction === 'up' || direction === 'down') {
                tspanElem.setAttributeNS(null, 'x', '0px')
                if (direction === 'up') {
                    tspanElem.setAttributeNS(null, 'y', `-${0.9 * i}em`);
                } else {
                    tspanElem.setAttributeNS(null, 'y', `${0.9 * i}em`);
                }
            }
            textElem.appendChild(tspanElem);
        })
        textElem.setAttributeNS(null, 'data-direction', direction);
        if (direction === 'left' || direction === 'right') {
            textElem.setAttributeNS(null, 'dominant-baseline', 'alphabetic');
            textElem.setAttributeNS(null, 'y', '0.36em');
        } else {
            textElem.setAttributeNS(null, 'dominant-baseline', 'central');
        }
        if (direction === 'left') {
            textElem.setAttributeNS(null, 'text-anchor', 'end');
        }
        g.appendChild(textElem)
        g.setAttributeNS(null, 'style', `transform: translateX(${x}px) translateY(${y}px)`);
        let maskRadius = this.opts.fontSizeLarge * 0.75;
        if (text[0][1].length > 1) {
            maskRadius = this.opts.fontSizeLarge * 1.1;
        }
        let mask = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        mask.setAttributeNS(null, 'cx', cx);
        mask.setAttributeNS(null, 'cy', cy);
        mask.setAttributeNS(null, 'r', maskRadius);
        mask.setAttributeNS(null, 'fill', 'black');
        this.maskElements.push(mask);
        this.vertices.push(g);
    }
    toCanvas(canvas, width, height) {
        if (typeof canvas === 'string' || canvas instanceof String) {
            canvas = document.getElementById(canvas);
        }
        let image = new Image();
        image.onload = function () {
            canvas.width = width;
            canvas.height = height;
            canvas.getContext('2d').drawImage(image, 0, 0, width, height);
        };
        image.src = 'data:image/svg+xml;charset-utf-8,' + encodeURIComponent(this.svg.outerHTML);
    }
    static createUnicodeSubscript(n) {
        let result = '';
        n.toString().split('').forEach(d => {
            result += ['₀', '₁', '₂', '₃', '₄', '₅', '₆', '₇', '₈', '₉'][parseInt(d)];
        });
        return result
    }
    static createUnicodeSuperscript(n) {
        let result = '';
        n.toString().split('').forEach(d => {
            let parsed = parseInt(d);
            if (parsed) {
                result += ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'][parseInt(d)];
            }
        });
        return result
    }
    static replaceNumbersWithSubscript(text) {
        let subscriptNumbers = {
            '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
            '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'
        };
        for (const [key, value] of Object.entries(subscriptNumbers)) {
            text = text.replaceAll(key, value);
        }
        return text;
    }
    static measureText(text, fontSize, fontFamily, lineHeight = 0.9) {
        const element = document.createElement('canvas');
        const ctx = element.getContext("2d");
        ctx.font = `${fontSize}pt ${fontFamily}`
        let textMetrics = ctx.measureText(text)
        let compWidth = Math.abs(textMetrics.actualBoundingBoxLeft) + Math.abs(textMetrics.actualBoundingBoxRight);
        return {
            'width': textMetrics.width > compWidth ? textMetrics.width : compWidth,
            'height': (Math.abs(textMetrics.actualBoundingBoxAscent) + Math.abs(textMetrics.actualBoundingBoxAscent)) * lineHeight
        };
    }
    static svgToCanvas(svg, canvas, width, height, callback = null) {
        svg.setAttributeNS(null, 'width', width);
        svg.setAttributeNS(null, 'height', height);
        let image = new Image();
        image.onload = function () {
            canvas.width = width;
            canvas.height = height;
            let context = canvas.getContext('2d');
            context.imageSmoothingEnabled = false;
            context.drawImage(image, 0, 0, width, height);
            if (callback) {
                callback(canvas);
            }
        };
        image.onerror = function (err) {
            console.log(err);
        }
        image.src = 'data:image/svg+xml;charset-utf-8,' + encodeURIComponent(svg.outerHTML);
        return canvas;
    }
    static svgToImg(svg, img, width, height) {
        let canvas = document.createElement('canvas');
        this.svgToCanvas(svg, canvas, width, height, result => {
            img.src = canvas.toDataURL("image/png");
        });
    }
    static writeText(text, themeManager, fontSize, fontFamily, maxWidth = Number.MAX_SAFE_INTEGER) {
        let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        let style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.appendChild(document.createTextNode(`
        .text {
            font: ${fontSize}pt ${fontFamily};
            dominant-baseline: ideographic;
        }
    `));
        svg.appendChild(style);
        let textElem = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textElem.setAttributeNS(null, 'class', 'text');
        let maxLineWidth = 0.0;
        let totalHeight = 0.0;
        let lines = [];
        text.split("\n").forEach(line => {
            let dims = SvgWrapper.measureText(line, fontSize, fontFamily, 1.0);
            if (dims.width >= maxWidth) {
                let totalWordsWidth = 0.0;
                let maxWordsHeight = 0.0;
                let words = line.split(" ");
                let offset = 0;
                for (let i = 0; i < words.length; i++) {
                    let wordDims = SvgWrapper.measureText(words[i], fontSize, fontFamily, 1.0);
                    if (totalWordsWidth + wordDims.width > maxWidth) {
                        lines.push({
                            text: words.slice(offset, i).join(' '),
                            width: totalWordsWidth,
                            height: maxWordsHeight
                        });
                        totalWordsWidth = 0.0;
                        maxWordsHeight = 0.0;
                        offset = i
                    }
                    if (wordDims.height > maxWordsHeight) {
                        maxWordsHeight = wordDims.height;
                    }
                    totalWordsWidth += wordDims.width;
                }
                if (offset < words.length) {
                    lines.push({
                        text: words.slice(offset, words.length).join(' '),
                        width: totalWordsWidth,
                        height: maxWordsHeight
                    });
                }
            } else {
                lines.push({
                    text: line,
                    width: dims.width,
                    height: dims.height
                });
            }
        });
        lines.forEach((line, i) => {
            totalHeight += line.height;
            let tspanElem = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
            tspanElem.setAttributeNS(null, 'fill', themeManager.getColor("C"));
            tspanElem.textContent = line.text;
            tspanElem.setAttributeNS(null, 'x', '0px')
            tspanElem.setAttributeNS(null, 'y', `${totalHeight}px`);
            textElem.appendChild(tspanElem);
            if (line.width > maxLineWidth) {
                maxLineWidth = line.width;
            }
        });
        svg.appendChild(textElem);
        return { svg: svg, width: maxLineWidth, height: totalHeight };
    }
}
module.exports = SvgWrapper;