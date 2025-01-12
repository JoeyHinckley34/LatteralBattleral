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
            opposingTeam.pop(); // Remove the last shape from the opposing team
            console.log("User used ability! Opposing team shape removed.");
        }
        currentTurn = 'opposing'; // Switch turn
    } else {
        // Opposing team logic can be added here later
        console.log("It's the opposing team's turn.");
        currentTurn = 'user'; // Switch turn back
    }
}

// Modify the battle loop to include turn-based actions
function battleLoop() {
    console.log("Battle in progress...");
    useShapeAbility(userTeam, opposingTeam); // Call the ability function
    requestAnimationFrame(battleLoop);
}

// Function to create a random shape for the opposing team
function createRandomShape() {
    const shapes = ['circle', 'square', 'triangle']; // Add more shapes as needed
    return shapes[Math.floor(Math.random() * shapes.length)];
}

// Create opposing team
function createOpposingTeam(size) {
    const opposingTeam = [];
    for (let i = 0; i < size; i++) {
        opposingTeam.push(createRandomShape());
    }
    return opposingTeam;
}

// Display teams
function displayTeams(userTeam, opposingTeam) {
    // Display user team at the bottom
    console.log("User Team: ", userTeam);
    // Display opposing team at the top
    console.log("Opposing Team: ", opposingTeam);
}

// Example usage
const userTeam = ['circle', 'square']; // Example user team
const opposingTeam = createOpposingTeam(3); // Create opposing team with 3 random shapes
displayTeams(userTeam, opposingTeam);
