// File: js/shop.js
class ShopManager {
    constructor(battleManager) {
        this.battleManager = battleManager;
        this.coins = 12;
        this.shapeCost = 3;
        this.shopContainer = document.getElementById('shopPage');
        this.shopItemsContainer = document.getElementById('shopItems');
        this.userTeamContainer = document.createElement('div');
        this.shopContainer.appendChild(this.userTeamContainer);
        this.initialize();
    }

    initialize() {
        // Add coin display
        this.coinDisplay = document.createElement('div');
        this.coinDisplay.id = 'coin-display';
        this.shopContainer.insertBefore(this.coinDisplay, this.shopItemsContainer);
        
        // Add next button functionality
        document.getElementById('nextButton').addEventListener('click', () => {
            this.shopContainer.style.display = 'none';
            document.getElementById('battleContainer').style.display = 'block';
            
            this.battleManager.generateNewOpposingTeam();
            document.getElementById('opposingCanvas').style.display = 'block';
            this.battleManager.redrawTeams();
        });

      
        // Load initial shop items
        this.loadShop();
    }

  

    loadShop() {
        this.shopItemsContainer.innerHTML = "";
        this.userTeamContainer.innerHTML = "";
        this.updateCoinDisplay();

        // Display user's team
        this.battleManager.userTeam.forEach(shape => {
            const shapeInfo = document.createElement('div');
            shapeInfo.textContent = `${shape.type} - Health: ${shape.health}`;
            this.userTeamContainer.appendChild(shapeInfo);
        });

        // Shop inventory - variety of triangles
        const triangles = [
            { sides: [5, 5, 5], description: "Perfect balance" },
            { sides: [3, 4, 5], description: "Classic right triangle" },
            { sides: [4, 4, 4], description: "Compact equilateral" },
            { sides: [6, 6, 4], description: "Strong isosceles" },
            { sides: [7, 5, 4], description: "Aggressive scalene" },
            { sides: [8, 8, 8], description: "Large powerhouse" }
        ];

        triangles.forEach(triangleData => {
            const container = document.createElement('div');
            container.className = 'shape-container';

            // Create canvas for the triangle
            const canvas = document.createElement('canvas');
            canvas.width = 100;
            canvas.height = 100;
            canvas.className = 'shape-canvas';
            const ctx = canvas.getContext('2d');

            // Create the triangle
            const triangle = new Triangle(...triangleData.sides);
            
            // Center the triangle on the canvas
            ctx.translate(
                canvas.width / 2 - triangle.getWidth() * 5,
                canvas.height / 2 + triangle.getHeight() * 5
            );
            triangle.draw(ctx, 0, 0, 10);

            // Add cost label
            const costLabel = document.createElement('div');
            costLabel.className = 'cost-label';
            costLabel.textContent = `${this.shapeCost} coins`;

            // Add triangle info
            const info = document.createElement('div');
            info.className = 'shape-info';
            info.textContent = `${triangle.type}\n${triangleData.description}`;


            // Add click handler
            container.onclick = () => {
                console.log("Shape clicked:", triangle); // Log the clicked triangle
                this.buyShape(triangle);
            };

            // Assemble container
            container.appendChild(canvas);
            container.appendChild(costLabel);
            container.appendChild(info);
            this.shopItemsContainer.appendChild(container);
        });
    }

    updateCoinDisplay() {
        this.coinDisplay.textContent = `Coins: ${this.coins}`;
    }

    buyShape(triangle) {
        if (this.coins >= this.shapeCost) {
            // Create a new instance of the triangle to avoid reference issues
            console.log("Attempting to buy shape...");
            const purchasedTriangle = new Triangle(...triangle.sides);
            console.log("Triangle purchased:", purchasedTriangle);
            purchasedTriangle.setLocation("User");
            console.log("HELLO??");
            console.log(purchasedTriangle.location);
            this.coins -= this.shapeCost;
            this.updateCoinDisplay();
            
            // Add to battle manager's user team
            this.battleManager.addToUserTeam(purchasedTriangle);
            
        } else {
            // Visual feedback for not enough coins
            this.coinDisplay.style.color = 'red';
            setTimeout(() => {
                this.coinDisplay.style.color = '#FFD700';
            }, 500);
        }
    }
}
