class Triangle {
    constructor(a, b, c) {
        // Geometric properties
        this.sidesSorted = [a, b, c].sort((x, y) => x - y);
        this.sides = [a, b, c];
        if (!this.isValidTriangle()) {
            throw new Error("Invalid triangle: Side lengths do not satisfy triangle inequality.");
        }     

        this.type = this.getTriangleType();
        this.angles = this.calculateAngles();
        this.angleType = this.getAngleType();
        this.sideType = this.getTriangleType();

        // Battle properties
        this.attack = 1
        this.health = this.getHealth();
        this.maxHealth = this.getMaxHealth();
        this.position = { x: 0, y: 0 };
        // this.battleStats = this.calculateBattleStats();
        this.isSelected = false;

        this.location = "Shop"; // New member variable to track the triangle's location

    }

    setLocation(location) {
        if (location == "Shop" || location == "User" || location == "Opponent"){
            this.location = location;
        }
        else{
            console.log("Invalid location")
        }
    }
    
    getHealth() {
        //To do: if taken damage then subtract
        return this.sides[0] + this.sides[1] + this.sides[2];
    }

    getMaxHealth() {
        return this.sides[0] + this.sides[1] + this.sides[2];
    }

    isValidTriangle() {
        const [x, y, z] = this.sidesSorted;
        return x + y > z;
    }

    getTriangleType() {
        const [a, b, c] = this.sidesSorted;

        // Classify based on sides
        if (a === b && b === c) return "Equilateral";
        if (a === b || b === c || a === c) return "Isosceles";
        return "Scalene"; // Default to scalene
    }

    calculateAngles() {
        const [a, b, c] = this.sidesSorted;
        const radToDeg = (rad) => (rad * 180) / Math.PI;

        const angleA = radToDeg(Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)));
        const angleB = radToDeg(Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c)));
        const angleC = 180 - (angleA + angleB);

        return [angleA, angleB, angleC];
    }

    getAngleType() {
        const angles = this.angles; // Get the angles calculated earlier

        // Classify based on angles
        const isRight = angles.some(angle => Math.abs(angle - 90) < 1e-10);
        const isAcute = angles.every(angle => angle < 90);
        const isObtuse = angles.some(angle => angle > 90);

        if (isRight) return "Right";
        if (isAcute) return "Acute";
        if (isObtuse) return "Obtuse";

        return "Unknown"; // Fallback if no classification applies
    }

    takeDamage(amount) {
        this.health = Math.max(0, this.health - Math.floor(amount));
        return amount;
    }

    // Enhanced draw method with battle features
    draw(ctx, x = 50, y = 200, scale = 10) {
        this.position = { x, y }; // Store position for battle mechanics

        // Draw selection indicator if selected
        if (this.isSelected) {
            ctx.save();
            ctx.strokeStyle = "gold";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(x + this.getWidth() * scale / 2, y - this.getHeight() * scale / 2, 
                   Math.max(this.getWidth(), this.getHeight()) * scale * 0.6, 0, Math.PI * 2);
            ctx.stroke();
            ctx.restore();
        }

        // Original triangle drawing
        const [a, b, c] = this.sides.map(side => side * scale);
        const x1 = x, y1 = y;
        const x2 = x + c, y2 = y;
        const angleA = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c));
        const x3 = x + b * Math.cos(angleA);
        const y3 = y - b * Math.sin(angleA);

        // Calculate the proportion of the perimeter to draw based on health
        const healthPercent = this.health / this.maxHealth;
        const perimeter = this.getPerimeter() * scale;
        const drawLength = perimeter * healthPercent;

        // Set the fill color based on the triangle's location
        if (this.location === "User") {
            ctx.fillStyle = "green"; // Color for user's team
        } else if (this.location === "Opponent") {
            ctx.fillStyle = "red"; // Color for opponent's team
        } else {
            ctx.fillStyle = "blue"; // Color for shop
        }
        
        // Fill the triangle background
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.fill();

        // Draw triangle with color based on health
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        
        // Draw the first side
        ctx.lineTo(x2, y2);
        if (drawLength > c * scale) {
            // Draw the second side
            ctx.lineTo(x3, y3);
            if (drawLength > (c + b) * scale) {
                // Draw the third side
                ctx.lineTo(x1, y1);
            } else {
                // Draw only part of the third side
                const remainingLength = drawLength - (c * scale + b * scale);
                const angleB = Math.acos((a ** 2 + c ** 2 - b ** 2) / (2 * a * c));
                const partialX3 = x2 + remainingLength * Math.cos(angleB);
                const partialY3 = y2 - remainingLength * Math.sin(angleB);
                ctx.lineTo(partialX3, partialY3);
            }
        }

        ctx.closePath();

        // Fill color based on health percentage
        ctx.fillStyle = `rgb(${255 * (1 - healthPercent)}, ${255 * healthPercent}, 0)`;
        ctx.fill();
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw tick marks
        this.drawTicks(ctx, x1, y1, x2, y2, c / scale);
        this.drawTicks(ctx, x2, y2, x3, y3, a / scale);
        this.drawTicks(ctx, x3, y3, x1, y1, b / scale);

        // Draw health bar
        this.drawHealthBar(ctx, x + this.getWidth() * scale / 2, y + 20);
    }

    drawHealthBar(ctx, x, y) {
        const width = 50;
        const height = 6;
        
        // Health bar background
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(x - width/2, y, width, height);
        
        // Current health
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(x - width/2, y, width * (this.health / this.maxHealth), height);
        
        // Border
        ctx.strokeStyle = '#000';
        ctx.strokeRect(x - width/2, y, width, height);
    }

    // Existing helper methods
    getHeight() {
        const [a, b, c] = this.sides;
        return a * Math.sin(Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c)));
    }

    getWidth() {
        return this.sides[2];
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

    drawTicks(ctx, x1, y1, x2, y2, ticks) {
        const dx = (x2 - x1) / ticks;
        const dy = (y2 - y1) / ticks;

        for (let i = 1; i < ticks; i++) {
            const tx = x1 + i * dx;
            const ty = y1 + i * dy;
            const offsetX = -dy * 0.2;
            const offsetY = dx * 0.2;

            ctx.beginPath();
            ctx.moveTo(tx - offsetX, ty - offsetY);
            ctx.lineTo(tx + offsetX, ty + offsetY);
            ctx.stroke();
        }
    }

}
