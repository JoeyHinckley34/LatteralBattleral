let battleManager;
let shopManager;

document.getElementById('startGameButton').addEventListener('click', () => {
    document.getElementById('landingPage').style.display = 'none';
    document.getElementById('shopPage').style.display = 'block';
    document.getElementById('userCanvas').style.display = 'block';
    
    // Initialize managers
    battleManager = new BattleManager();
    shopManager = new ShopManager(battleManager);
});