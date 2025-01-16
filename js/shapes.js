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

        // Battle properties
        this.health = 100;
        this.maxHealth = 100;
        this.position = { x: 0, y: 0 };
        this.battleStats = this.calculateBattleStats();
        this.isSelected = false;
    }

    // Existing geometric methods
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

    // Battle-specific methods
    calculateBattleStats() {
        return {
            // Attack power based on perimeter (longer sides = more power)
            attack: Math.floor(this.getPerimeter() * 2),
            
            // Defense based on area (larger area = better defense)
            defense: Math.floor(this.getArea() * 3),
            
            // Speed based on height (taller triangles = faster)
            speed: Math.floor(this.getHeight() * 4),
            
            // Critical hit chance based on whether it's a right triangle
            criticalChance: this.isRightTriangle() ? 25 : 15,
            
            // Special ability based on triangle type
            specialAbility: this.determineSpecialAbility()
        };
    }

    determineSpecialAbility() {
        switch (this.type) {
            case "Equilateral":
                return {
                    name: "Perfect Balance",
                    effect: "Reduces damage taken by 25%"
                };
            case "Isosceles":
                return {
                    name: "Twin Strike",
                    effect: "20% chance to attack twice"
                };
            case "Scalene":
                return {
                    name: "Unpredictable Edge",
                    effect: "15% chance to dodge attacks"
                };
            default:
                return {
                    name: "Basic Strike",
                    effect: "No special effect"
                };
        }
    }

    // Battle actions
    attack(target) {
        let damage = this.battleStats.attack;
        
        // Apply critical hit
        if (Math.random() * 100 < this.battleStats.criticalChance) {
            damage *= 1.5;
            console.log("Critical hit!");
        }

        // Apply special ability effects
        if (this.type === "Isosceles" && Math.random() < 0.2) {
            damage *= 2;
            console.log("Twin Strike activated!");
        }

        // Calculate final damage considering target's defense
        const finalDamage = Math.max(1, Math.floor(damage - (target.battleStats.defense / 4)));
        return finalDamage;
    }

    takeDamage(amount) {
        // Apply damage reduction for Equilateral triangles
        if (this.type === "Equilateral") {
            amount *= 0.75;
        }
        
        // Apply dodge chance for Scalene triangles
        if (this.type === "Scalene" && Math.random() < 0.15) {
            console.log("Attack dodged!");
            return 0;
        }

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

        // Draw triangle with color based on health
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();

        // Fill color based on health percentage
        const healthPercent = this.health / this.maxHealth;
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
