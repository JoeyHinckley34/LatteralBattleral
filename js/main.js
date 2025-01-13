const GAME_STATE = { SHOP: "shop", BATTLE: "battle", WIN: "win", LOSE: "lose" };
let currentState = "landing";
let turn = 1;
let lives = 5;
let coins = 10;
let userTeam = []

document.getElementById("startGameButton").addEventListener("click", () => {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("shopPage").style.display = "block";
    document.getElementById("userCanvas").style.display = "block";
    loadShop();
});




document.getElementById("nextButton").addEventListener("click", () => {
    document.getElementById("shopPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "none";
    document.getElementById("battleContainer").style.display = "block";
    
    // Create opposing team and start the battle
    const opposingTeam = createOpposingTeam(3); // Create opposing team with 3 random triangles
    startGame()
    //displayTeams(userTeam); // Display user's team
    displayOpposingTeam(opposingTeam); // Display opposing team
    startBattle(); // Start the battle
});

// Function to start the game and show the canvases
function startGame() {
    document.getElementById('userCanvas').style.display = 'block'; // Show user canvas
    document.getElementById('opposingCanvas').style.display = 'block'; // Show opposing canvas
    // Additional game initialization code...
}