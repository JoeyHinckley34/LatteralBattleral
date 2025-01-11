/* js/battle.js */
function startBattle() {
    currentState = GAME_STATE.BATTLE;
    console.log("Battle started!");
    battleLoop();
}

function battleLoop() {
    console.log("Battle in progress...");
    requestAnimationFrame(battleLoop);
}
