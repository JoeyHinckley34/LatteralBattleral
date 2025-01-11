
/* js/shapes.js */
class Shape {
    constructor(type, x, y) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.health = type === "triangle" ? 5 : 10;
        this.attack = type === "triangle" ? 3 : 2;
    }

    draw(ctx) {
        ctx.fillStyle = this.type === "triangle" ? "red" : "blue";
        ctx.beginPath();
        if (this.type === "triangle") {
            ctx.moveTo(this.x, this.y - 10);
            ctx.lineTo(this.x - 10, this.y + 10);
            ctx.lineTo(this.x + 10, this.y + 10);
            ctx.closePath();
        } else {
            ctx.fillRect(this.x - 10, this.y - 10, 20, 20);
        }
        ctx.fill();
    }
}
