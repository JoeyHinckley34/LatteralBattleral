let teamShapes = []; // Array to hold the shapes drawn to the team

function loadShop() {
    turn = document.getElementById("turnNumber").textContent;
    lives = document.getElementById("lives").textContent;
    coins = document.getElementById("coins").textContent;
    let shopItemsContainer = document.getElementById("shopItems");
    shopItemsContainer.innerHTML = "";

    // Hard-coded triangles for the shop
    const triangles = [
        new Triangle(3, 4, 5),
        new Triangle(4, 5, 6), 
        new Triangle(3, 2, 2), 
        new Triangle(3, 4, 6), 
        new Triangle(5, 5, 3), 
        new Triangle(6, 6, 6)  
    ];

    triangles.forEach((triangle, index) => {
        // Create a div to represent the triangle
        let shapeDiv = document.createElement("div");
        shapeDiv.style.display = "inline-block"; // Display shapes inline
        shapeDiv.style.margin = "5px"; // Add some margin between shapes

        // Create a canvas for each triangle
        let shapeCanvas = document.createElement("canvas");
        shapeCanvas.width = 100; // Set width for the shape canvas
        shapeCanvas.height = 100; // Set height for the shape canvas
        let ctx = shapeCanvas.getContext("2d");

        // TODO Center the triangle on the canvas
        ctx.translate( (shapeCanvas.width / 2) - triangle.getPerimeter() , (shapeCanvas.height / 2) + triangle.getPerimeter());
        console.log((triangle.getPerimeter() / 2));
        triangle.draw(ctx,0,0,10); // Draw the triangle on the canvas

        // Add click event to the canvas to buy the triangle
        shapeCanvas.addEventListener("click", (event) => {
            buyShape(triangle); // Pass the triangle object directly
        });

        // Append the canvas to the shape div
        shapeDiv.appendChild(shapeCanvas);
        shopItemsContainer.appendChild(shapeDiv); // Append the shape div to the shop container
    });
}

function buyShape(triangle) {
    coins = document.getElementById("coins").textContent;
    if (coins >= 3) {
        coins -= 3;
        console.log(`Bought Triangle!`);

        // Copy the triangle object to the team
        teamShapes.push(triangle); // Add the triangle to the teamShapes array
        updateTeamList(triangle); // Update the team list with the triangle
        drawShapesToTeam(); // Call the function to draw all shapes
    } else {
        console.log("Not enough coins!");
    }
}

function updateTeamList(shape) {

    const teamList = document.getElementById("teamList");
    const shapeItem = document.createElement("div");
    shapeItem.textContent = shape; // Display the shape name
    teamList.appendChild(shapeItem); // Add the new shape to the team list

    // Draw the new shape directly in the team container
    const canvas = document.getElementById("teamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    shape.x = 500; // Set x position based on the number of shapes
    shape.y = 300; // Fixed y position for all shapes
    shape.draw(ctx); // Draw the shape on the canvas
}

// New function to draw all shapes on the user's team
function drawShapesToTeam() {
    console.log("drawShapesToTeam")
    console.log( teamList.children.length )
    const canvas = document.getElementById("teamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    let counter = 0
    teamShapes.forEach((shape, index) => {       
        counter += 100
        shape.draw(ctx,counter,150,10); 
    });
}