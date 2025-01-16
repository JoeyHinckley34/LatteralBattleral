// File: js/battle.js
class BattleManager {
    constructor() {
        this.userTeam = [];
        this.opposingTeam = [];
        this.selectedShape = null;
        this.selectedAbility = null;
        this.battleContainer = document.getElementById('battleContainer');
        this.battleLog = document.getElementById('battleLog');
        this.initialize();
    }

    initialize() {
        document.addEventListener('DOMContentLoaded', () => {
            // Your initialization code here
            this.userCanvas = document.getElementById('userCanvas');
            this.userCtx = this.userCanvas.getContext('2d');

            this.opposingCanvas = document.getElementById('opposingCanvas');
            this.opposingCtx = this.opposingCanvas.getContext('2d');

            // Test drawing
            this.testCanvas();
        });

        // Set up canvas contexts
        this.userCanvas = document.getElementById("userCanvas");
        this.opposingCanvas = document.getElementById("opposingCanvas");
        this.userCtx = this.userCanvas.getContext("2d");
        this.opposingCtx = this.opposingCanvas.getContext("2d");

        // Setup click handlers
        this.userCanvas.addEventListener('click', (e) => this.handleUserTeamClick(e));
        this.opposingCanvas.addEventListener('click', (e) => this.handleOpposingTeamClick(e));
        
        // Create ability menu
        this.abilityMenu = document.createElement('div');
        this.abilityMenu.id = 'ability-menu';
        this.battleContainer.appendChild(this.abilityMenu);
        
        // Add initial styles
        this.addStyles();
    }

    addStyles() {
        const styleSheet = document.createElement("style");
        styleSheet.textContent = `
            #battleContainer {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
                padding: 20px;
            }

            #ability-menu {
                position: absolute;
                background: white;
                border: 2px solid #333;
                border-radius: 5px;
                padding: 10px;
                display: none;
                z-index: 1000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }

            #ability-menu button {
                display: block;
                width: 100%;
                padding: 8px 15px;
                margin: 5px 0;
                border: none;
                border-radius: 3px;
                background: #4CAF50;
                color: white;
                cursor: pointer;
                transition: background 0.3s;
            }

            #ability-menu button:hover {
                background: #45a049;
            }

            #battleLog {
                width: 80%;
                max-height: 150px;
                overflow-y: auto;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
                margin: 10px 0;
                font-family: monospace;
            }

            canvas {
                border: 2px solid #333;
                border-radius: 5px;
                margin: 10px;
            }
        `;
        document.head.appendChild(styleSheet);
    }

    log(message) {
        const logEntry = document.createElement('div');
        logEntry.textContent = `➤ ${message}`;
        this.battleLog.appendChild(logEntry);
        this.battleLog.scrollTop = this.battleLog.scrollHeight;
    }

    handleUserTeamClick(event) {
        const rect = this.userCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const clickedShape = this.findShapeAtPosition(x, y, this.userTeam);
        
        if (clickedShape) {
            this.selectShape(clickedShape);
            this.log(`Selected ${clickedShape.type} triangle`);
        }
    }

    handleOpposingTeamClick(event) {
        if (!this.selectedShape || !this.selectedAbility) {
            this.log("Select a shape and ability first!");
            return;
        }

        const rect = this.opposingCanvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const targetShape = this.findShapeAtPosition(x, y, this.opposingTeam);
        
        if (targetShape) {
            this.executeAbility(this.selectedShape, targetShape, this.selectedAbility);
        }
    }

    findShapeAtPosition(x, y, team) {
        return team.find(shape => {
            const dx = x - shape.position.x;
            const dy = y - shape.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            return distance < 30;
        });
    }

    selectShape(shape) {
        if (this.selectedShape) {
            this.selectedShape.isSelected = false;
        }

        this.selectedShape = shape;
        shape.isSelected = true;
        this.showAbilityMenu(shape);
        this.redrawTeams();
    }

    showAbilityMenu(shape) {
        this.abilityMenu.innerHTML = '';
        this.selectedAbility = null;

        const abilities = this.getShapeAbilities(shape);
        abilities.forEach(ability => {
            const button = document.createElement('button');
            button.textContent = ability.name;
            button.onclick = () => {
                this.selectAbility(ability);
                this.log(`Selected ability: ${ability.name}`);
            };
            this.abilityMenu.appendChild(button);
        });

        const rect = this.userCanvas.getBoundingClientRect();
        this.abilityMenu.style.position = 'absolute';
        this.abilityMenu.style.left = `${shape.position.x + rect.left}px`;
        this.abilityMenu.style.top = `${shape.position.y + rect.top + 50}px`;
        this.abilityMenu.style.display = 'block';
    }

    getShapeAbilities(shape) {
        return [
            {
                name: 'Basic Attack',
                execute: (attacker, target) => {
                    const damage = 1; // Remove one tick mark
                    this.applyDamage(target, damage);
                }
            }
        ];
    }

    selectAbility(ability) {
        this.selectedAbility = ability;
    }

    executeAbility(attacker, target, ability) {
        if (!ability) return;
        
        ability.execute(attacker, target);
        this.checkForDefeatedShapes();
        this.redrawTeams();
        
        this.selectedShape.isSelected = false;
        this.selectedShape = null;
        this.selectedAbility = null;
        this.abilityMenu.style.display = 'none';
    }

    applyDamage(shape, damage) {
        const currentPerimeter = shape.getPerimeter();
        // Reduce one of the sides by the damage amount
        shape.sides[0] = Math.max(1, shape.sides[0] - damage);
        const newPerimeter = shape.getPerimeter();
        this.log(`${shape.type} triangle took damage! Perimeter: ${currentPerimeter} → ${newPerimeter}`);
    }

    checkForDefeatedShapes() {
        this.userTeam = this.userTeam.filter(shape => shape.getPerimeter() > 3);
        this.opposingTeam = this.opposingTeam.filter(shape => shape.getPerimeter() > 3);
        
        if (this.userTeam.length === 0) {
            this.log("Game Over - Opposing Team Wins!");
        } else if (this.opposingTeam.length === 0) {
            this.log("Victory - User Team Wins!");
        }
    }

    redrawTeams() {
        this.userCtx.clearRect(0, 0, this.userCanvas.width, this.userCanvas.height);
        this.opposingCtx.clearRect(0, 0, this.opposingCanvas.width, this.opposingCanvas.height);

        this.userTeam.forEach((shape, index) => {
            const x = 50 + index * 100;
            const y = 150;
            shape.position = { x, y };
            shape.draw(this.userCtx, x, y); // Ensure this method is implemented correctly
        });

       
        this.opposingTeam.forEach((shape, index) => {
            const x = 50 + index * 100;
            const y = 100;
            shape.position = { x, y };

            shape.draw(this.opposingCtx, x, y); // Ensure this method is implemented correctly
        });
    }

    addToUserTeam(shape) {
        this.userTeam.push(shape);
        this.redrawTeams();
    }

    addToOpposingTeam(shape) {
        this.opposingTeam.push(shape);
        this.redrawTeams();
    }

    testCanvas() {
        this.userCtx.fillStyle = 'red';
        this.userCtx.fillRect(10, 10, 50, 50); // Draw a red square
        this.opposingCtx.fillStyle = 'blue';
        this.opposingCtx.fillRect(10, 10, 50, 50); // Draw a blue square
    }

    generateNewOpposingTeam() {
        this.opposingTeam = []; // Clear the existing team
        const shapes = [
            { sides: [5, 5, 5], type: 'Equilateral' },
            { sides: [3, 4, 5], type: 'Right' },
            { sides: [4, 4, 4], type: 'Equilateral' },
            { sides: [6, 6, 4], type: 'Isosceles' },
            { sides: [7, 5, 4], type: 'Scalene' }
        ];

        // Randomly select shapes to add to the opposing team
        for (let i = 0; i < 3; i++) { // Example: Add 3 shapes
            const shapeData = shapes[Math.floor(Math.random() * shapes.length)];
            const newShape = new Triangle(...shapeData.sides);
            newShape.type = shapeData.type; // Set the type
            this.addToOpposingTeam(newShape);
        }
    }
}
