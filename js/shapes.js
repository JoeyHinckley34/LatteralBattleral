class Triangle {
    constructor(a, b, c) {
        this.sides = [a, b, c].sort((x, y) => x - y); // Ensure sides are ordered
        if (!this.isValidTriangle()) {
            throw new Error("Invalid triangle: Side lengths do not satisfy triangle inequality.");
        }

        this.type = this.getTriangleType();
        this.angles = this.calculateAngles();
    }

    isValidTriangle() {
        const [x, y, z] = this.sides;
        return x + y > z;
    }

    getTriangleType() {
        const [a, b, c] = this.sides;
        if (a === b && b === c) return "Equilateral";
        if (a === b || b === c || a === c) return "Isosceles";
        return "Scalene";
    }

    calculateAngles() {
        const [a, b, c] = this.sides;
        const radToDeg = (rad) => (rad * 180) / Math.PI;

        const angleA = radToDeg(Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)));
        const angleB = radToDeg(Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c)));
        const angleC = 180 - (angleA + angleB);

        return [angleA, angleB, angleC];
    }

    getPerimeter() {
        let sum = 0;
        this.sides.forEach(side => {
            sum += side;
        });
        return sum; // Return the total perimeter
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
     * Draws the triangle using the Canvas API
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
        const angleA = (Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)));
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
    }
}
