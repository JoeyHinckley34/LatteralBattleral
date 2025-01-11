/* js/shapes.js */
class Shape {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    draw(ctx) {
        // Common draw method, can be overridden
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + 10, this.y + 10);
        ctx.lineTo(this.x + 10, this.y - 10);
        ctx.closePath();
        ctx.fill();
    }
}

class Triangle extends Shape {
    constructor(x, y, sideA, sideB, sideC, angleA, angleB, angleC) {
        super(x, y);
        this.sides = [sideA, sideB, sideC];
        this.angles = [angleA, angleB, angleC];
        
        if (!this.isValidTriangle()) {
            throw new Error("Invalid triangle dimensions");
        }
    }

    isValidTriangle() {
        const [a, b, c] = this.sides;
        const [angleA, angleB, angleC] = this.angles;

        // Check if the sum of the angles is 180 degrees
        const anglesValid = (angleA + angleB + angleC === 180);
        
        // Check the triangle inequality theorem
        const sidesValid = (a + b > c) && (a + c > b) && (b + c > a);
        
        return anglesValid && sidesValid;
    }

    draw(ctx) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - this.sides[0]);
        ctx.lineTo(this.x - this.sides[1] * Math.cos(this.angles[1]), this.y + this.sides[1]);
        ctx.lineTo(this.x + this.sides[2] * Math.cos(this.angles[2]), this.y + this.sides[2]);
        ctx.closePath();
        ctx.fill();
    }
}

class EquilateralTriangle extends Triangle {
    constructor(x, y, sideLength) {
        const angleA = 60, angleB = 60, angleC = 60; // All angles are 60 degrees
        super(x, y, sideLength, sideLength, sideLength, angleA, angleB, angleC);
        this.type = "Equilateral";
    }
}

class IsoscelesTriangle extends Triangle {
    constructor(x, y, base, height) {
        const sideA = base, sideB = height, sideC = height; // Two sides are equal
        const angleA = Math.acos((sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
        const angleB = angleA;
        const angleC = 180 - (angleA + angleB);
        super(x, y, sideA, sideB, sideC, angleA, angleB, angleC);
        this.type = "Isosceles";
    }
}

class ScaleneTriangle extends Triangle {
    constructor(x, y, sideA, sideB, sideC) {
        const angleA = Math.acos((sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
        const angleB = Math.acos((sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)) * (180 / Math.PI);
        const angleC = 180 - (angleA + angleB);
        super(x, y, sideA, sideB, sideC, angleA, angleB, angleC);
        this.type = "Scalene";
    }
}

class RightTriangle extends Triangle {
    constructor(x, y, base, height) {
        const sideA = base, sideB = height, sideC = Math.sqrt(base * base + height * height); // Pythagorean theorem
        const angleA = Math.atan(height / base) * (180 / Math.PI);
        const angleB = 90; // Right angle
        const angleC = 90 - angleA;
        super(x, y, sideA, sideB, sideC, angleA, angleB, angleC);
        this.type = "Right";
    }
}

class ObtuseTriangle extends Triangle {
    constructor(x, y, sideA, sideB, sideC) {
        const angleA = Math.acos((sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
        const angleB = Math.acos((sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)) * (180 / Math.PI);
        const angleC = 180 - (angleA + angleB);
        if (angleA > 90 || angleB > 90 || angleC > 90) {
            super(x, y, sideA, sideB, sideC, angleA, angleB, angleC);
            this.type = "Obtuse";
        } else {
            throw new Error("Invalid obtuse triangle dimensions");
        }
    }
}

class AcuteTriangle extends Triangle {
    constructor(x, y, sideA, sideB, sideC) {
        const angleA = Math.acos((sideB * sideB + sideC * sideC - sideA * sideA) / (2 * sideB * sideC)) * (180 / Math.PI);
        const angleB = Math.acos((sideA * sideA + sideC * sideC - sideB * sideB) / (2 * sideA * sideC)) * (180 / Math.PI);
        const angleC = 180 - (angleA + angleB);
        if (angleA < 90 && angleB < 90 && angleC < 90) {
            super(x, y, sideA, sideB, sideC, angleA, angleB, angleC);
            this.type = "Acute";
        } else {
            throw new Error("Invalid acute triangle dimensions");
        }
    }
}

class Circle extends Shape {
    constructor(x, y, radius) {
        super(x, y);
        this.radius = radius;
    }

    draw(ctx) {
        ctx.fillStyle = "blue";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Square extends Shape {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
    }

    draw(ctx) {
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
    }
}