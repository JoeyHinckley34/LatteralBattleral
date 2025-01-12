let teamShapes = []; // Array to hold the shapes drawn to the team

function loadShop() {
    turn = document.getElementById("turnNumber").textContent;
    lives = document.getElementById("lives").textContent;
    coins = document.getElementById("coins").textContent;
    let shopItemsContainer = document.getElementById("shopItems");
    shopItemsContainer.innerHTML = "";

    let shapes = [
        "EquilateralTriangle", "IsoscelesTriangle", "ScaleneTriangle",
        "RightTriangle", "ObtuseTriangle", "AcuteTriangle"
    ];
    shapes.forEach(shape => {
        // Create a div to represent the shape
        let shapeDiv = document.createElement("div");
        shapeDiv.style.display = "inline-block"; // Display shapes inline
        shapeDiv.style.margin = "5px"; // Add some margin between shapes

        // Create a canvas for each shape
        let shapeCanvas = document.createElement("canvas");
        shapeCanvas.width = 200; // Set width for the shape canvas
        shapeCanvas.height = 200; // Set height for the shape canvas
        let ctx = shapeCanvas.getContext("2d");

        // Draw the shape on the canvas
        let newShape;
        switch (shape) {
            case "IsoscelesTriangle":
                sideA = 30; // Fixed base
                sideB = 40; // Fixed height
                newShape = new IsoscelesTriangle(0, 0, sideA, sideB);
                break;
            case "EquilateralTriangle":
                sideA = 30; // Fixed side length
                newShape = new EquilateralTriangle(0, 0, sideA);
                break;
            case "ScaleneTriangle":
                sideA = 30; // Fixed side length
                sideB = 40; // Fixed side length
                sideC = 50; // Fixed side length
                newShape = new ScaleneTriangle(0, 0, sideA, sideB, sideC);
                break;
            case "RightTriangle":
                sideA = 30; // Fixed base
                sideB = 40; // Fixed height
                newShape = new RightTriangle(0, 0, sideA, sideB);
                break;
            case "ObtuseTriangle":
                sideA = 30; // Fixed side length
                sideB = 40; // Fixed side length
                sideC = 50; // Fixed side length
                newShape = new ObtuseTriangle(0, 0, sideA, sideB, sideC);
                break;
            case "AcuteTriangle":
                sideA = 30; // Fixed side length
                sideB = 40; // Fixed side length
                sideC = 50; // Fixed side length
                newShape = new AcuteTriangle(0, 0, sideA, sideB, sideC);
                break;
        }
        
        // Center the shape on the canvas
        ctx.translate(shapeCanvas.width / 2, shapeCanvas.height / 2);
        newShape.draw(ctx); // Draw the shape on the canvas

        // Add click event to the canvas to buy the shape
        shapeCanvas.addEventListener("click", (event) => {
            buyShape(shape); // Call buyShape with the shape identifier
        });

        // Append the canvas to the shape div
        shapeDiv.appendChild(shapeCanvas);
        shopItemsContainer.appendChild(shapeDiv); // Append the shape div to the shop container
    });
}

// ... existing code ...



function buyShape(shape) {
    coins = document.getElementById("coins").textContent;
    if (coins >= 3) {
        coins -= 3;
        document.getElementById("coins").textContent = coins;
        console.log(`Bought ${shape}!`);
        // Create shape instances based on the selected shape
        let newShape;
        switch (shape) {
            case "EquilateralTriangle":
                newShape = new EquilateralTriangle(0, 0, Math.random() * Math.PI); // Random angle
                break;
            case "IsoscelesTriangle":
                newShape = new IsoscelesTriangle(0, 0, Math.random() * Math.PI); // Random angle
                break;
            case "ScaleneTriangle":
                newShape = new ScaleneTriangle(0, 0, Math.random() * Math.PI); // Random angle
                break;
            case "RightTriangle":
                newShape = new RightTriangle(0, 0, Math.random() * Math.PI); // Random angle
                break;
            case "ObtuseTriangle":
                newShape = new ObtuseTriangle(0, 0, Math.random() * Math.PI); // Random angle
                break;
            case "AcuteTriangle":
                newShape = new AcuteTriangle(0, 0, Math.random() * Math.PI); // Random angle
                break;
            case "Circle":
                newShape = new Circle(0, 0, 20); // Fixed radius
                break;
            case "Square":
                newShape = new Square(0, 0, 40); // Fixed size
                break;
            default:
                console.log("Unknown shape!");
                return;
        }
        updateTeamList(shape, newShape); // Pass the newShape to the update function
        drawShapesToTeam(); // Call the function to draw all shapes
    } else {
        console.log("Not enough coins!");
    }
}

// Update the function to accept the newShape parameter
function updateTeamList(shape, newShape) {
    const teamList = document.getElementById("teamList");
    const shapeItem = document.createElement("div");
    shapeItem.textContent = shape; // Display the shape name
    teamList.appendChild(shapeItem); // Add the new shape to the team list

    // Draw the new shape directly in the team container
    const canvas = document.getElementById("teamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    newShape.x = teamList.children.length * 150; // Set x position based on the number of shapes
    newShape.y = 75; // Fixed y position for all shapes
    newShape.draw(ctx); // Draw the shape on the canvas
}

// New function to draw all shapes on the user's team
function drawShapesToTeam() {
    const canvas = document.getElementById("teamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings

    // Draw each shape next to each other
    const shapeWidth = 150; // Increased width for each shape
    const shapeHeight = 150; // Increased height for each shape
    
    teamShapes.forEach((shape, index) => {
        const x = index * (shapeWidth + 20) + shapeWidth / 2; // Adjusted x position
        const y = 75; // Fixed y position for all shapes
        shape.x = x; // Set the x position for the shape
        shape.y = y; // Set the y position for the shape
        shape.draw(ctx); // Draw the shape on the canvas
    });
}