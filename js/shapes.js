class Triangle {
    constructor(a, b, c) {
        this.sidesSorted = [a, b, c].sort((x, y) => x - y); // Ensure sides are ordered
        this.sides = [a, b, c]
        if (!this.isValidTriangle()) {
            throw new Error("Invalid triangle: Side lengths do not satisfy triangle inequality.");
        }

        this.type = this.getTriangleType();
        this.angles = this.calculateAngles();
    }

    isValidTriangle() {
        const [x, y, z] = this.sidesSorted;
        return x + y > z;
    }

    getTriangleType() {
        const [a, b, c] = this.sidesSorted;
        if (a === b && b === c) return "Equilateral";
        if (a === b || b === c || a === c) return "Isosceles";
        return "Scalene";
    }

    calculateAngles() {
        const [a, b, c] = this.sidesSorted;
        const radToDeg = (rad) => (rad * 180) / Math.PI;

        const angleA = radToDeg(Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)));
        const angleB = radToDeg(Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c)));
        const angleC = 180 - (angleA + angleB);

        return [angleA, angleB, angleC];
    }

    getHeight() {
        const [a, b, c] = this.sides;
        const height = (a * Math.sin(Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)))); // Calculate height using sine
        return height
     
    }

    getWidth() {
        return this.sides[2]
    }

    getPerimeter() {
        return this.sides.reduce((sum, side) => sum + side, 0);
    }

    getArea() {
        const s = this.getPerimeter() / 2;
        const [a, b, c] = this.sides;
        return Math.sqrt(s * (s - a) * (s - b) * (s - c));
    }

    isRightTriangle() {
        return this.angles.some((angle) => Math.abs(angle - 90) < 1e-10);
    }

    /**
     * Draws the triangle using the Canvas API with tick marks on each side.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} x - x-coordinate for drawing
     * @param {number} y - y-coordinate for drawing
     * @param {number} scale - Scaling factor
     */
    draw(ctx, x = 50, y = 200, scale = 30) {
        const [a, b, c] = this.sides.map(side => side * scale);

        // Place one side (c) on the x-axis
        const x1 = x, y1 = y;
        const x2 = x + c, y2 = y;

        // Calculate third vertex using law of cosines
        const angleA = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c));
        const x3 = x + b * Math.cos(angleA);
        const y3 = y - b * Math.sin(angleA);

        // Draw triangle
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        // Style and stroke
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw tick marks
        this.drawTicks(ctx, x1, y1, x2, y2, c / scale); // Side c
        this.drawTicks(ctx, x2, y2, x3, y3, a / scale); // Side a
        this.drawTicks(ctx, x3, y3, x1, y1, b / scale); // Side b
    }

    /**
     * Draws tick marks along a given line segment.
     * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
     * @param {number} x1 - Starting x-coordinate
     * @param {number} y1 - Starting y-coordinate
     * @param {number} x2 - Ending x-coordinate
     * @param {number} y2 - Ending y-coordinate
     * @param {number} ticks - Number of tick marks
     */
    drawTicks(ctx, x1, y1, x2, y2, ticks) {
        const dx = (x2 - x1) / ticks;
        const dy = (y2 - y1) / ticks;

        for (let i = 1; i < ticks; i++) {
            const tx = x1 + i * dx;
            const ty = y1 + i * dy;

            // Perpendicular offset
            const offsetX = -dy * 0.2; // Short tick perpendicular
            const offsetY = dx * 0.2;

            ctx.beginPath();
            ctx.moveTo(tx - offsetX, ty - offsetY);
            ctx.lineTo(tx + offsetX, ty + offsetY);
            ctx.stroke();
        }
    }
}
