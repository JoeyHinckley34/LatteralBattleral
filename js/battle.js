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

// Modify the battle loop to include turn-based actions
function battleLoop() {
    console.log("Battle in progress...");
    useShapeAbility(userTeam, opposingTeam); // Call the ability function
    requestAnimationFrame(battleLoop);
}

// Create opposing team
function createOpposingTeam(size) {
    const opposingTeam = [];
    for (let i = 0; i < size; i++) {
        // Assuming the new Triangle class takes three sides as parameters
        const a = 30; 
        const b = 40; 
        const c = 50; 
        const triangle = new Triangle(a, b, c); // Create a new Triangle instance
        opposingTeam.push(triangle);
    }
    return opposingTeam;
}


