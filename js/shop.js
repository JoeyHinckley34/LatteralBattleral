let teamShapes = []; // Array to hold the shapes drawn to the team

function loadShop() {
    document.getElementById("turnNumber").textContent = turn;
    document.getElementById("lives").textContent = lives;
    document.getElementById("coins").textContent = coins;
    let shopItemsContainer = document.getElementById("shopItems");
    shopItemsContainer.innerHTML = "";

    let shapes = ["Triangle", "Square", "Circle"];
    shapes.forEach(shape => {
        let button = document.createElement("button");
        button.textContent = `${shape} - 3 Coins`;
        button.onclick = () => buyShape(shape);
        shopItemsContainer.appendChild(button);
    });
}

function buyShape(shape) {
    if (coins >= 3) {
        if (teamShapes.length < 5) { // Check if the team has less than 5 shapes
            coins -= 3;
            document.getElementById("coins").textContent = coins;
            console.log(`Bought ${shape}!`);
            teamShapes.push(shape); // Add the shape to the teamShapes array
            drawShapesToTeam(); // Call the function to draw all shapes
        } else {
            console.log("You can only have 5 shapes at a time!");
        }
    } else {
        console.log("Not enough coins!");
    }
}

// New function to draw all shapes on the user's team
function drawShapesToTeam() {
    const canvas = document.getElementById("teamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    // Draw each shape next to each other
    const shapeWidth = 40; // Width for each shape (adjust as needed)
    const shapeHeight = 40; // Height for each shape (adjust as needed)
    
    teamShapes.forEach((shape, index) => {
        const x = index * (shapeWidth + 10); // Calculate x position based on index
        const y = 50; // Fixed y position for all shapes
        const newShape = new Shape(shape, x, y); // Create a new shape instance
        newShape.draw(ctx); // Draw the shape on the canvas
    });
}