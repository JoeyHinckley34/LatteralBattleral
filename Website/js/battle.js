// File: js/battle.js
class BattleManager {
    constructor() {
        this.userTeam = [];
        this.opposingTeam = [];
        this.selectedShape = null;
        this.selectedAbility = null;
        this.battleContainer = document.getElementById('battleContainer');
        this.battleLog = document.getElementById('battleLog');
        this.currentTurn = 'user';
        this.abilityMenu = document.getElementById('ability-menu');
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
        if (this.currentTurn !== 'user') {
            this.log("Wait for your turn!");
            return;
        }

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
        this.abilityMenu.style.position = 'relative';
        // this.abilityMenu.style.left = `${shape.position.x + rect.left}px`;
        // this.abilityMenu.style.top = `${shape.position.y + rect.top - 50}px`;
        this.abilityMenu.style.display = 'block';
    }

    getShapeAbilities(shape) {
        return [
            {
                name: 'Basic Attack',
                execute: (attacker, target) => {
                    const damage = 20;
                    this.applyDamage(target, damage);
                    // Store the new sides after damage
                    target.sides = [...target.sides]; // Create new array to ensure update
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

        if (this.currentTurn === 'user') {
            this.currentTurn = 'opponent';
            setTimeout(() => this.executeOpponentTurn(), 1000);
        }
    }

    executeOpponentTurn() {
        if (this.opposingTeam.length === 0 || this.userTeam.length === 0) {
            return;
        }

        const attacker = this.opposingTeam[Math.floor(Math.random() * this.opposingTeam.length)];
        const target = this.userTeam[Math.floor(Math.random() * this.userTeam.length)];
        
        const ability = this.getShapeAbilities(attacker)[0];

        this.log(`Opponent's ${attacker.type} triangle attacks ${target.type} triangle!`);
        
        ability.execute(attacker, target);
        this.checkForDefeatedShapes();
        this.redrawTeams();

        this.currentTurn = 'user';
        this.log("Your turn!");
    }

    applyDamage(shape, damage) {
        // Instead of modifying sides, we set a damaged state
        shape.isDamaged = true; // New property to track damage state
        
        shape.takeDamage(damage); // Use the attack function from shape.js
        this.log(`${shape.type} triangle took damage!`);
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
            shape.draw(this.userCtx, x, y); // Pass the damage state to the draw method
        });

        // Set fill style for opposing shapes
        this.opposingCtx.fillStyle = 'red'; // Change color to red

        this.opposingTeam.forEach((shape, index) => {
            const x = 50 + index * 100;
            const y = 100;
            shape.position = { x, y };

            shape.draw(this.opposingCtx, x, y); // Pass the damage state to the draw method
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
