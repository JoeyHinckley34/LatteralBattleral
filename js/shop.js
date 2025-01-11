function loadShop() {
    document.getElementById("turnNumber").textContent = turn;
    document.getElementById("lives").textContent = lives;
    document.getElementById("coins").textContent = coins;
    let shopItemsContainer = document.getElementById("shopItems");
    shopItemsContainer.innerHTML = "";

    let shapes = ["Triangle", "Square", "Circle"];
    shapes.forEach(shape => {
        let button = document.createElement("button");
        button.textContent = `${shape} - 3 Coins`;
        button.onclick = () => buyShape(shape);
        shopItemsContainer.appendChild(button);
    });
}

function buyShape(shape) {
    if (coins >= 3) {
        coins -= 3;
        document.getElementById("coins").textContent = coins;
        console.log(`Bought ${shape}!`);
    } else {
        console.log("Not enough coins!");
    }
}