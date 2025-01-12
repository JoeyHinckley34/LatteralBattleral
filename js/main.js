const GAME_STATE = { SHOP: "shop", BATTLE: "battle", WIN: "win", LOSE: "lose" };
let currentState = "landing";
let turn = 1;
let lives = 5;
let coins = 10;

document.getElementById("startGameButton").addEventListener("click", () => {
    document.getElementById("landingPage").style.display = "none";
    document.getElementById("shopPage").style.display = "block";
    document.getElementById("teamContainer").style.display = "block";
    loadShop();
});

document.getElementById("nextButton").addEventListener("click", () => {
    document.getElementById("shopPage").style.display = "none";
    document.getElementById("gameContainer").style.display = "block";
    
    // Create opposing team and start the battle
    const opposingTeam = createOpposingTeam(3); // Create opposing team with 3 random shapes
    displayTeams(userTeam, opposingTeam); // Display teams
    startBattle(); // Start the battle
});