/* js/battle.js */
function startBattle() {
    currentState = GAME_STATE.BATTLE;
    console.log("Battle started!");
    battleLoop();
}

let currentTurn = 'user'; // Track whose turn it is

function useShapeAbility(userTeam, opposingTeam) {
    if (currentTurn === 'user') {
        // Example ability: remove a shape from the opposing team
        if (opposingTeam.length > 0) {
            const removedShape = opposingTeam.pop(); // Remove the last shape from the opposing team
            console.log("User used ability! Opposing team shape removed: ", removedShape);
        }
        currentTurn = 'opposing'; // Switch turn
    } else {
        // Opposing team logic can be added here later
        console.log("It's the opposing team's turn.");
        currentTurn = 'user'; // Switch turn back
    }
}

// Function to display the opposing team on the screen
function displayOpposingTeam(opposingTeam) {
    const opposingTeamContainer = document.getElementById('opposing-team'); // Assuming there's a container in your HTML
    opposingTeamContainer.innerHTML = ''; // Clear previous content
    const canvas = document.getElementById("opposingCanvas"); // Assuming there's a canvas for the opposing team
    const ctx = canvas.getContext("2d");
    opposingTeam.forEach((shape, index) => {
        shape.draw(ctx, 50 + index * 100,100, 10); // Draw each shape with an offset
    });
}

// Function to display the user's team on the screen
function displayTeams(userTeam) {
    const userTeamContainer = document.getElementById('user-team'); // Assuming there's a container in your HTML
    userTeamContainer.innerHTML = ''; // Clear previous content
    const canvas = document.getElementById("userCanvas"); // Assuming there's a canvas for the user team
    const ctx = canvas.getContext("2d");
    userTeam.forEach((shape, index) => {
        shape.draw(ctx, 50 + index * 100, 100, 10); // Draw each shape with an offset
    });
}

// Modify the battle loop to include turn-based actions and display the opposing team
function battleLoop() {
    console.log("Battle in progress...");
    // useShapeAbility(userTeam, opposingTeam); // Call the ability function
    // displayOpposingTeam(opposingTeam); // Display the opposing team
    // requestAnimationFrame(battleLoop);
}

// Create opposing team
function createOpposingTeam(size) {
    const opposingTeam = [];
    for (let i = 0; i < size; i++) {
        // Assuming the new Triangle class takes three sides as parameters
        const a = 3; 
        const b = 4; 
        const c = 5; 
        const triangle = new Triangle(a, b, c); // Create a new Triangle instance
        opposingTeam.push(triangle);
    }
    return opposingTeam;
}

function updateTeamList(shape) {
    // Draw the new shape directly in the team container
    const canvas = document.getElementById("teamCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear previous drawings
    shape.x = 500; // Set x position based on the number of shapes
    shape.y = 300; // Fixed y position for all shapes
    shape.draw(ctx); // Draw the shape on the canvas
}

// Add event listeners for user team and opposing team canvas
const userCanvas = document.getElementById("userCanvas");
const opposingCanvas = document.getElementById("opposingCanvas");

userCanvas.addEventListener('click', (event) => {
    const shape = getShapeAt(event, userTeam);
    if (shape) {
        selectUserShape(shape);
    }
});

opposingCanvas.addEventListener('click', (event) => {
    const targetShape = getShapeAt(event, opposingTeam);
    if (targetShape && selectedUserShape) {
        attack(selectedUserShape, targetShape);
    }
});

// Function to check if a point is inside a triangle
function isPointInsideTriangle(x, y, triangle, position) {
    const [a, b, c] = triangle.sides; // Get the sides of the triangle
    const scale = 1; // Adjust scale if necessary

    // Calculate vertices based on the position and side lengths
    const x1 = position.x;
    const y1 = position.y;
    const x2 = x1 + a * scale; // Vertex B
    const angleA = Math.acos((b ** 2 + c ** 2 - a ** 2) / (2 * b * c));
    const x3 = x1 + b * scale * Math.cos(angleA); // Vertex C x-coordinate
    const y3 = y1 - b * scale * Math.sin(angleA); // Vertex C y-coordinate

    // Barycentric coordinates method to check if point is inside the triangle
    const area = 0.5 * (-y2 * x1 + x2 * (y1 - y3) + x1 * (y2 - y3));
    const s = 1 / (2 * area) * (y1 * x2 - x1 * y2 + (y2 - y1) * x);
    const t = 1 / (2 * area) * (x1 * y3 - y1 * x3 + (x1 - x2) * y);

    return s >= 0 && t >= 0 && (s + t) <= 1;
}

// Update the getShapeAt function to use the new isPointInsideTriangle function
function getShapeAt(event, team) {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    for (const shape of team) {
        try {
            const position = { x: shape.position.x, y: shape.position.y }; // Ensure this is defined
            console.log("Checking shape:", shape, "at position:", position); // Debug log
            if (isPointInsideTriangle(x, y, shape, position)) {
                return shape; // Return the shape if the point is inside
            }
        } catch (error) {
            console.error("Error checking shape:", error);
        }
    }
    return null; // No shape found
}

// Function to create buttons for the user's team
function createUserButtons(userTeam) {
    const userButtonContainer = document.getElementById('user-buttons');
    userButtonContainer.innerHTML = ''; // Clear previous buttons

    userTeam.forEach((shape, index) => {
        const button = document.createElement('button');
        button.innerText = `Select Shape ${index + 1}`;
        button.onclick = () => selectUserShape(shape);
        userButtonContainer.appendChild(button);
    });
}

// Function to create buttons for the opposing team
function createOpposingButtons(opposingTeam) {
    const opposingButtonContainer = document.getElementById('opposing-buttons');
    opposingButtonContainer.innerHTML = ''; // Clear previous buttons

    opposingTeam.forEach((shape, index) => {
        const button = document.createElement('button');
        button.innerText = `Attack Shape ${index + 1}`;
        button.onclick = () => {
            if (selectedUserShape) {
                attack(selectedUserShape, shape);
            } else {
                console.log("No shape selected for attack.");
            }
        };
        opposingButtonContainer.appendChild(button);
    });
}

// Function to handle user shape selection
let selectedUserShape = null;
function selectUserShape(shape) {
    selectedUserShape = shape;
    console.log("Selected shape for attack: ", shape);
}

// Function to handle the attack logic
function attack(userShape, targetShape) {
    console.log("Attacking with: ", userShape, " on target: ", targetShape);
    // Implement attack logic here (e.g., remove target shape from opposing team)
    const index = opposingTeam.indexOf(targetShape);
    if (index > -1) {
        opposingTeam.splice(index, 1); // Remove the target shape
        console.log("Target shape removed: ", targetShape);
    }
    // Update the display after the attack
    displayOpposingTeam(opposingTeam);
}


