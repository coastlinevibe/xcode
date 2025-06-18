import { Level } from '../types/game';

export const LEVELS: Level[] = [
  {
    id: 1,
    name: "First Steps",
    description: "Learn to move your hero through the dungeon",
    gridSize: { width: 8, height: 6 },
    character: {
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      gems: 0,
      hasKey: false,
      direction: 'right'
    },
    enemies: [],
    collectibles: [
      {
        id: 'gem1',
        position: { x: 3, y: 2 },
        type: 'gem',
        value: 10,
        collected: false
      },
      {
        id: 'gem2',
        position: { x: 5, y: 1 },
        type: 'gem',
        value: 10,
        collected: false
      }
    ],
    obstacles: [
      { position: { x: 2, y: 1 }, type: 'wall' },
      { position: { x: 2, y: 2 }, type: 'wall' },
      { position: { x: 2, y: 3 }, type: 'wall' },
      { position: { x: 4, y: 3 }, type: 'spike', damage: 20 }
    ],
    exit: { x: 7, y: 5 },
    objective: "Move to the exit and collect gems along the way",
    hints: [
      "Use yourName.moveRight() to move right",
      "Use yourName.moveDown() to move down",
      "Gems are automatically collected when you step on them",
      "Use brackets to repeat commands: yourName.moveRight(3) or yourName.moveRight[3]"
    ],
    starterCode: `// Move your hero to the exit!
// Use these commands:
// yourName.moveRight()
// yourName.moveLeft() 
// yourName.moveUp()
// yourName.moveDown()

// NEW: Use brackets to repeat commands!
// yourName.moveRight(3)  // moves right 3 times
// yourName.moveDown[2]   // moves down 2 times

yourName.moveRight(3);
yourName.moveDown(2);
// Add more moves here...`,
    solution: `yourName.moveRight(3);
yourName.moveDown(2);
yourName.moveRight(1);
yourName.moveDown(1);
yourName.moveRight(2);
yourName.moveDown(2);`
  },
  {
    id: 2,
    name: "Combat Training",
    description: "Learn to fight enemies and use loops with bracket notation",
    gridSize: { width: 10, height: 8 },
    character: {
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      gems: 0,
      hasKey: false,
      direction: 'right'
    },
    enemies: [
      {
        id: 'orc1',
        position: { x: 3, y: 2 },
        health: 30,
        maxHealth: 30,
        type: 'orc',
        damage: 15,
        isAlive: true
      },
      {
        id: 'skeleton1',
        position: { x: 6, y: 4 },
        health: 20,
        maxHealth: 20,
        type: 'skeleton',
        damage: 10,
        isAlive: true
      }
    ],
    collectibles: [
      {
        id: 'heart1',
        position: { x: 1, y: 3 },
        type: 'heart',
        value: 25,
        collected: false
      },
      {
        id: 'key1',
        position: { x: 8, y: 1 },
        type: 'key',
        value: 0,
        collected: false
      }
    ],
    obstacles: [
      { position: { x: 2, y: 1 }, type: 'wall' },
      { position: { x: 2, y: 2 }, type: 'wall' },
      { position: { x: 4, y: 5 }, type: 'fire', damage: 25 },
      { position: { x: 5, y: 5 }, type: 'fire', damage: 25 }
    ],
    exit: { x: 9, y: 7 },
    objective: "Defeat enemies, collect the key, and reach the exit",
    hints: [
      "Use yourName.attack() when next to an enemy",
      "Use while loops to attack until enemies are defeated",
      "Check yourName.health to monitor your health",
      "Use yourName.attack(5) to attack 5 times quickly"
    ],
    starterCode: `// Fight enemies and collect the key!
// New commands:
// yourName.attack()
// yourName.isEnemyNear()
// while (condition) { ... }

// Use brackets for repeated attacks:
// yourName.attack(3)  // attacks 3 times

yourName.moveDown(3);
yourName.moveRight(3);
while (yourName.isEnemyNear()) {
    yourName.attack();
}
// Add more code here...`,
    solution: `yourName.moveDown(3);
yourName.moveRight(3);
while (yourName.isEnemyNear()) {
    yourName.attack();
}
yourName.moveRight(3);
yourName.moveUp(3);
yourName.moveRight(1);
yourName.moveDown(5);
while (yourName.isEnemyNear()) {
    yourName.attack();
}
yourName.moveRight(2);
yourName.moveDown(1);`
  },
  {
    id: 3,
    name: "Advanced Tactics",
    description: "Use functions and complex logic with efficient bracket notation",
    gridSize: { width: 12, height: 10 },
    character: {
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      gems: 0,
      hasKey: false,
      direction: 'right'
    },
    enemies: [
      {
        id: 'dragon1',
        position: { x: 6, y: 5 },
        health: 50,
        maxHealth: 50,
        type: 'dragon',
        damage: 30,
        isAlive: true
      },
      {
        id: 'orc1',
        position: { x: 3, y: 7 },
        health: 30,
        maxHealth: 30,
        type: 'orc',
        damage: 15,
        isAlive: true
      },
      {
        id: 'orc2',
        position: { x: 9, y: 2 },
        health: 30,
        maxHealth: 30,
        type: 'orc',
        damage: 15,
        isAlive: true
      }
    ],
    collectibles: [
      {
        id: 'gem1',
        position: { x: 2, y: 3 },
        type: 'gem',
        value: 20,
        collected: false
      },
      {
        id: 'gem2',
        position: { x: 8, y: 8 },
        type: 'gem',
        value: 20,
        collected: false
      },
      {
        id: 'heart1',
        position: { x: 5, y: 1 },
        type: 'heart',
        value: 30,
        collected: false
      },
      {
        id: 'key1',
        position: { x: 10, y: 7 },
        type: 'key',
        value: 0,
        collected: false
      }
    ],
    obstacles: [
      { position: { x: 4, y: 2 }, type: 'wall' },
      { position: { x: 4, y: 3 }, type: 'wall' },
      { position: { x: 4, y: 4 }, type: 'wall' },
      { position: { x: 7, y: 6 }, type: 'poison', damage: 20 },
      { position: { x: 8, y: 6 }, type: 'poison', damage: 20 },
      { position: { x: 1, y: 8 }, type: 'spike', damage: 15 },
      { position: { x: 2, y: 8 }, type: 'spike', damage: 15 }
    ],
    exit: { x: 11, y: 9 },
    objective: "Use functions to efficiently navigate and defeat the dragon",
    hints: [
      "Create functions to avoid repeating code",
      "Use yourName.distanceTo(enemy) to find the nearest enemy",
      "Plan your path to avoid taking unnecessary damage",
      "Combine functions with bracket notation for efficiency"
    ],
    starterCode: `// Use functions and advanced tactics!
// New commands:
// yourName.distanceTo(target)
// function myFunction() { ... }

function moveRight(steps) {
    yourName.moveRight(steps);  // Use bracket notation in functions!
}

function moveDown(steps) {
    yourName.moveDown(steps);
}

function fightEnemy() {
    while (yourName.isEnemyNear()) {
        yourName.attack();
    }
}

// Your strategy here...
moveRight(2);
moveDown(3);`,
    solution: `function moveRight(steps) {
    yourName.moveRight(steps);
}

function moveDown(steps) {
    yourName.moveDown(steps);
}

function fightEnemy() {
    while (yourName.isEnemyNear()) {
        yourName.attack();
    }
}

moveRight(2);
moveDown(3);
fightEnemy();
moveRight(6);
moveDown(2);
fightEnemy();
moveRight(2);`
  }
];