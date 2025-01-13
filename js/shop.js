
function loadShop() {
    // turn = document.getElementById("turnNumber").textContent;
    // lives = document.getElementById("lives").textContent;
    // coins = document.getElementById("coins").textContent;

    turn = 1
    lives = 5
    coins = 100
    let shopItemsContainer = document.getElementById("shopItems");
    shopItemsContainer.innerHTML = "";

    // Hard-coded triangles for the shop
    const triangles = [
        new Triangle(5, 5, 5),
        new Triangle(3, 4, 4), 
        new Triangle(Math.sqrt(32),4, 4), 
        new Triangle(7, 4, 4), 
        new Triangle(2, 4, 3), 
        new Triangle(5, 4, 3),
        new Triangle(6, 4, 3),
          
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
        ctx.translate( (shapeCanvas.width / 2) - triangle.getWidth()*5, (shapeCanvas.height / 2) + triangle.getHeight()*5 );
        console.log((triangle.getHeight()));
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
    //coins = document.getElementById("coins").textContent;
    coins =100
    if (coins >= 3) {
        coins -= 3;
        console.log(`Bought Triangle!`);

        // Copy the triangle object to the user team
        userTeam.push(triangle); // Add the triangle to the userTeam array
        //updateTeamList(triangle); // Update the team list with the triangle
        drawShapesToTeam(); // Call the function to draw all shapes
    } else {
        console.log("Not enough coins!");
    }
}

function updateTeamList(shape) {
    // Draw the new shape directly in the team container
    const canvas = document.getElementById("userCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    shape.x = 500; // Set x position based on the number of shapes
    shape.y = 300; // Fixed y position for all shapes
    shape.draw(ctx); // Draw the shape on the canvas
}

// New function to draw all shapes on the user's team
function drawShapesToTeam() {
    console.log("drawShapesToTeam")
    const canvas = document.getElementById("userCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    let counter = 0
    userTeam.forEach((shape, index) => {       
        counter += 100
        shape.draw(ctx,counter,150,10); 
    });
}