import { Level } from '../types/game';

// Gauntlet-inspired levels with coding education focus
export const GAUNTLET_LEVELS: Level[] = [
  {
    id: 1,
    name: "Dungeon Entrance",
    description: "Your first steps into the Code Gauntlet",
    gridSize: { width: 10, height: 8 },
    character: {
      name: "Coder",
      class: 'warrior',
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      food: 100,
      maxFood: 100,
      gems: 0,
      hasKey: false,
      direction: 'right',
      level: 1,
      experience: 0
    },
    enemies: [
      {
        id: 'grunt1',
        type: 'grunt',
        position: { x: 5, y: 3 },
        health: 20,
        maxHealth: 20,
        damage: 10,
        isAlive: true,
        speed: 1,
        behavior: 'chase'
      }
    ],
    collectibles: [
      {
        id: 'food1',
        position: { x: 3, y: 2 },
        type: 'food',
        value: 20,
        collected: false
      },
      {
        id: 'key1',
        position: { x: 7, y: 5 },
        type: 'key',
        value: 0,
        collected: false
      },
      {
        id: 'coin1',
        position: { x: 2, y: 6 },
        type: 'coin',
        value: 10,
        collected: false
      }
    ],
    obstacles: [
      { position: { x: 2, y: 1 }, type: 'wall' },
      { position: { x: 2, y: 2 }, type: 'wall' },
      { position: { x: 2, y: 3 }, type: 'wall' },
      { position: { x: 4, y: 5 }, type: 'spike', damage: 10 },
      { position: { x: 8, y: 2 }, type: 'generator' }
    ],
    exit: { x: 9, y: 7 },
    objective: "Collect the key, defeat the grunt, and reach the exit",
    hints: [
      "Use hero.moveRight() to move right",
      "Use hero.attack() when next to an enemy",
      "Food restores your health which decreases over time",
      "Destroy generators to stop enemies from spawning"
    ],
    starterCode: `// Welcome to the Code Gauntlet!
// Your health decreases over time, so move quickly!
// Use these commands:
// hero.moveRight()
// hero.moveLeft() 
// hero.moveUp()
// hero.moveDown()
// hero.attack()

// Get the key and reach the exit!
hero.moveRight(3);
hero.moveDown(2);
// Add more code here...`,
    solution: `hero.moveRight(3);
hero.moveDown(2);
hero.moveRight(2);
hero.moveDown(1);
hero.attack();
hero.moveRight(2);
hero.moveUp(2);
hero.moveRight(2);
hero.moveDown(4);`,
    timeLimit: 60,
    generators: [{ x: 8, y: 2 }],
    floorType: 'dungeon',
    difficulty: 'easy'
  },
  
  {
    id: 2,
    name: "Generator Room",
    description: "Learn to destroy monster generators",
    gridSize: { width: 12, height: 10 },
    character: {
      name: "Coder",
      class: 'wizard',
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      food: 80,
      maxFood: 100,
      gems: 0,
      hasKey: false,
      direction: 'right',
      level: 1,
      experience: 0
    },
    enemies: [
      {
        id: 'ghost1',
        type: 'ghost',
        position: { x: 5, y: 5 },
        health: 15,
        maxHealth: 15,
        damage: 8,
        isAlive: true,
        speed: 1.5,
        behavior: 'chase',
        spawnedFromGenerator: true,
        generatorId: 'gen1'
      },
      {
        id: 'grunt1',
        type: 'grunt',
        position: { x: 8, y: 3 },
        health: 20,
        maxHealth: 20,
        damage: 10,
        isAlive: true,
        speed: 1,
        behavior: 'chase'
      }
    ],
    collectibles: [
      {
        id: 'food1',
        position: { x: 3, y: 2 },
        type: 'food',
        value: 30,
        collected: false
      },
      {
        id: 'potion1',
        position: { x: 6, y: 7 },
        type: 'potion',
        value: 0,
        collected: false,
        effect: 'invincibility',
        duration: 10
      },
      {
        id: 'key1',
        position: { x: 10, y: 2 },
        type: 'key',
        value: 0,
        collected: false
      }
    ],
    obstacles: [
      { position: { x: 2, y: 1 }, type: 'wall' },
      { position: { x: 2, y: 2 }, type: 'wall' },
      { position: { x: 2, y: 3 }, type: 'wall' },
      { position: { x: 5, y: 2 }, type: 'generator', generatesType: 'ghost', generationRate: 10 },
      { position: { x: 9, y: 8 }, type: 'generator', generatesType: 'grunt', generationRate: 15 },
      { position: { x: 7, y: 4 }, type: 'fire', damage: 15 }
    ],
    exit: { x: 11, y: 9 },
    objective: "Destroy the generators and collect the key to escape",
    hints: [
      "Generators continuously spawn enemies",
      "Attack generators to destroy them",
      "Potions grant temporary special abilities",
      "Your health decreases faster in this level - find food!"
    ],
    starterCode: `// Generators spawn enemies until destroyed!
// Use these commands:
// hero.moveRight()
// hero.moveLeft() 
// hero.moveUp()
// hero.moveDown()
// hero.attack()
// hero.usePotion() - if you have one

// Destroy the generators and escape!
hero.moveRight(3);
hero.moveDown(2);
// Add more code here...`,
    solution: `hero.moveRight(3);
hero.moveDown(2);
hero.moveRight(2);
hero.attack(); // Attack the generator
hero.moveRight(2);
hero.moveUp(1);
hero.moveRight(3);
hero.moveDown(7);
hero.moveLeft(2);
hero.attack(); // Attack the second generator
hero.moveRight(4);`,
    timeLimit: 90,
    generators: [
      { x: 5, y: 2 },
      { x: 9, y: 8 }
    ],
    floorType: 'dungeon',
    difficulty: 'medium'
  },
  
  {
    id: 3,
    name: "Treasure Vault",
    description: "A room filled with treasure and danger",
    gridSize: { width: 14, height: 12 },
    character: {
      name: "Coder",
      class: 'elf',
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      food: 70,
      maxFood: 100,
      gems: 0,
      hasKey: false,
      direction: 'right',
      level: 2,
      experience: 100
    },
    enemies: [
      {
        id: 'demon1',
        type: 'demon',
        position: { x: 7, y: 6 },
        health: 30,
        maxHealth: 30,
        damage: 15,
        isAlive: true,
        speed: 0.8,
        behavior: 'shoot'
      },
      {
        id: 'ghost1',
        type: 'ghost',
        position: { x: 10, y: 3 },
        health: 15,
        maxHealth: 15,
        damage: 8,
        isAlive: true,
        speed: 1.5,
        behavior: 'chase'
      },
      {
        id: 'death1',
        type: 'death',
        position: { x: 12, y: 10 },
        health: 100,
        maxHealth: 100,
        damage: 30,
        isAlive: true,
        speed: 0.5,
        behavior: 'chase'
      }
    ],
    collectibles: [
      {
        id: 'food1',
        position: { x: 2, y: 3 },
        type: 'food',
        value: 40,
        collected: false
      },
      {
        id: 'treasure1',
        position: { x: 5, y: 5 },
        type: 'treasure',
        value: 100,
        collected: false
      },
      {
        id: 'treasure2',
        position: { x: 6, y: 5 },
        type: 'treasure',
        value: 100,
        collected: false
      },
      {
        id: 'treasure3',
        position: { x: 5, y: 6 },
        type: 'treasure',
        value: 100,
        collected: false
      },
      {
        id: 'treasure4',
        position: { x: 6, y: 6 },
        type: 'treasure',
        value: 100,
        collected: false
      },
      {
        id: 'key1',
        position: { x: 12, y: 2 },
        type: 'key',
        value: 0,
        collected: false
      },
      {
        id: 'potion1',
        position: { x: 3, y: 9 },
        type: 'potion',
        value: 0,
        collected: false,
        effect: 'invincibility',
        duration: 15
      }
    ],
    obstacles: [
      { position: { x: 4, y: 4 }, type: 'wall' },
      { position: { x: 4, y: 5 }, type: 'wall' },
      { position: { x: 4, y: 6 }, type: 'wall' },
      { position: { x: 4, y: 7 }, type: 'wall' },
      { position: { x: 7, y: 4 }, type: 'wall' },
      { position: { x: 7, y: 5 }, type: 'wall' },
      { position: { x: 7, y: 7 }, type: 'wall' },
      { position: { x: 5, y: 7 }, type: 'wall' },
      { position: { x: 6, y: 7 }, type: 'wall' },
      { position: { x: 5, y: 4 }, type: 'wall' },
      { position: { x: 6, y: 4 }, type: 'wall' },
      { position: { x: 9, y: 8 }, type: 'acid', damage: 10 },
      { position: { x: 10, y: 8 }, type: 'acid', damage: 10 },
      { position: { x: 11, y: 8 }, type: 'acid', damage: 10 },
      { position: { x: 8, y: 1 }, type: 'it' }
    ],
    exit: { x: 13, y: 11 },
    objective: "Collect treasures and escape without being caught by Death",
    hints: [
      "Death cannot be defeated - only avoided",
      "The 'It' tag will make all enemies chase you",
      "Treasure rooms contain valuable points",
      "Use potions strategically to navigate dangerous areas"
    ],
    starterCode: `// Welcome to the Treasure Vault!
// Death cannot be defeated - only avoided!
// Use these commands:
// hero.moveRight()
// hero.moveLeft() 
// hero.moveUp()
// hero.moveDown()
// hero.attack()
// hero.usePotion()
// hero.checkForDeath() - returns true if Death is nearby

// Collect treasures and escape!
hero.moveRight(2);
hero.moveDown(3);
// Add more code here...`,
    solution: `hero.moveRight(2);
hero.moveDown(3);
hero.moveRight(2);
hero.moveUp(1);
hero.moveRight(1);
// Collect treasures
hero.moveDown(2);
hero.moveLeft(1);
hero.moveDown(3);
hero.moveRight(3);
hero.usePotion(); // Use invincibility
hero.moveDown(2);
hero.moveRight(4);
hero.moveUp(9);
hero.moveRight(2);`,
    timeLimit: 120,
    floorType: 'dungeon',
    difficulty: 'hard',
    treasureRoom: true,
    secretAreas: [{ x: 1, y: 11 }]
  },
  
  {
    id: 4,
    name: "Crystal Caverns",
    description: "Navigate the glowing crystal maze",
    gridSize: { width: 15, height: 12 },
    character: {
      name: "Coder",
      class: 'valkyrie',
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      food: 60,
      maxFood: 100,
      gems: 0,
      hasKey: false,
      direction: 'right',
      level: 3,
      experience: 250,
      specialPower: 'shield'
    },
    enemies: [
      {
        id: 'sorcerer1',
        type: 'sorcerer',
        position: { x: 7, y: 6 },
        health: 25,
        maxHealth: 25,
        damage: 12,
        isAlive: true,
        speed: 1.2,
        behavior: 'teleport'
      },
      {
        id: 'lobber1',
        type: 'lobber',
        position: { x: 12, y: 3 },
        health: 20,
        maxHealth: 20,
        damage: 10,
        isAlive: true,
        speed: 0.7,
        behavior: 'shoot'
      },
      {
        id: 'ghost1',
        type: 'ghost',
        position: { x: 5, y: 9 },
        health: 15,
        maxHealth: 15,
        damage: 8,
        isAlive: true,
        speed: 1.5,
        behavior: 'chase'
      }
    ],
    collectibles: [
      {
        id: 'food1',
        position: { x: 3, y: 2 },
        type: 'food',
        value: 30,
        collected: false
      },
      {
        id: 'food2',
        position: { x: 10, y: 8 },
        type: 'food',
        value: 30,
        collected: false
      },
      {
        id: 'gem1',
        position: { x: 6, y: 4 },
        type: 'gem',
        value: 50,
        collected: false
      },
      {
        id: 'gem2',
        position: { x: 9, y: 7 },
        type: 'gem',
        value: 50,
        collected: false
      },
      {
        id: 'key1',
        position: { x: 13, y: 2 },
        type: 'key',
        value: 0,
        collected: false
      },
      {
        id: 'potion1',
        position: { x: 2, y: 10 },
        type: 'potion',
        value: 0,
        collected: false,
        effect: 'speed',
        duration: 10
      }
    ],
    obstacles: [
      // Crystal maze walls
      { position: { x: 3, y: 3 }, type: 'wall' },
      { position: { x: 4, y: 3 }, type: 'wall' },
      { position: { x: 5, y: 3 }, type: 'wall' },
      { position: { x: 3, y: 4 }, type: 'wall' },
      { position: { x: 3, y: 5 }, type: 'wall' },
      { position: { x: 3, y: 6 }, type: 'wall' },
      { position: { x: 4, y: 6 }, type: 'wall' },
      { position: { x: 5, y: 6 }, type: 'wall' },
      
      { position: { x: 8, y: 2 }, type: 'wall' },
      { position: { x: 8, y: 3 }, type: 'wall' },
      { position: { x: 8, y: 4 }, type: 'wall' },
      { position: { x: 9, y: 4 }, type: 'wall' },
      { position: { x: 10, y: 4 }, type: 'wall' },
      { position: { x: 10, y: 5 }, type: 'wall' },
      { position: { x: 10, y: 6 }, type: 'wall' },
      
      { position: { x: 7, y: 8 }, type: 'wall' },
      { position: { x: 8, y: 8 }, type: 'wall' },
      { position: { x: 9, y: 8 }, type: 'wall' },
      { position: { x: 7, y: 9 }, type: 'wall' },
      { position: { x: 7, y: 10 }, type: 'wall' },
      
      // Hazards
      { position: { x: 6, y: 7 }, type: 'acid', damage: 15 },
      { position: { x: 11, y: 9 }, type: 'fire', damage: 20 },
      { position: { x: 12, y: 9 }, type: 'fire', damage: 20 },
      
      // Generator
      { position: { x: 13, y: 5 }, type: 'generator', generatesType: 'ghost', generationRate: 20 }
    ],
    exit: { x: 14, y: 11 },
    objective: "Navigate the crystal maze, collect gems, and find the exit",
    hints: [
      "Sorcerers teleport around the map",
      "Lobbers can throw projectiles over walls",
      "Use your special shield ability with hero.useSpecial()",
      "The crystal maze has multiple paths - find the safest one"
    ],
    starterCode: `// Crystal Caverns - a maze of teleporting sorcerers!
// New commands:
// hero.useSpecial() - activates your class special ability
// hero.detectEnemy(type) - returns true if that enemy type is nearby
// hero.findPath(x, y) - tries to find a path to coordinates

// Navigate the maze and escape!
hero.moveRight(2);
hero.moveDown(2);
// Add more code here...`,
    solution: `hero.moveRight(2);
hero.moveDown(2);
hero.moveRight(3);
hero.moveDown(4);
hero.moveRight(2);
if (hero.detectEnemy('sorcerer')) {
  hero.useSpecial(); // Use shield
}
hero.moveDown(2);
hero.moveRight(3);
hero.moveDown(3);
hero.moveRight(5);`,
    timeLimit: 150,
    floorType: 'crystal',
    difficulty: 'medium',
    generators: [{ x: 13, y: 5 }],
    specialEffects: ['crystalGlow', 'teleportFlash']
  },
  
  {
    id: 5,
    name: "Logic Labyrinth Boss",
    description: "Face the fearsome Logic Sphinx in a battle of wits",
    gridSize: { width: 16, height: 14 },
    character: {
      name: "Coder",
      class: 'wizard',
      position: { x: 0, y: 0 },
      health: 100,
      maxHealth: 100,
      food: 50,
      maxFood: 100,
      gems: 0,
      hasKey: false,
      direction: 'right',
      level: 5,
      experience: 500,
      specialPower: 'fireball'
    },
    enemies: [
      {
        id: 'boss1',
        type: 'dragon',
        position: { x: 12, y: 7 },
        health: 100,
        maxHealth: 100,
        damage: 25,
        isAlive: true,
        speed: 0.5,
        behavior: 'shoot'
      },
      {
        id: 'grunt1',
        type: 'grunt',
        position: { x: 5, y: 5 },
        health: 20,
        maxHealth: 20,
        damage: 10,
        isAlive: true,
        speed: 1,
        behavior: 'chase'
      },
      {
        id: 'grunt2',
        type: 'grunt',
        position: { x: 8, y: 9 },
        health: 20,
        maxHealth: 20,
        damage: 10,
        isAlive: true,
        speed: 1,
        behavior: 'chase'
      }
    ],
    collectibles: [
      {
        id: 'food1',
        position: { x: 3, y: 2 },
        type: 'food',
        value: 50,
        collected: false
      },
      {
        id: 'food2',
        position: { x: 7, y: 12 },
        type: 'food',
        value: 50,
        collected: false
      },
      {
        id: 'potion1',
        position: { x: 4, y: 8 },
        type: 'potion',
        value: 0,
        collected: false,
        effect: 'power',
        duration: 20
      },
      {
        id: 'key1',
        position: { x: 14, y: 7 },
        type: 'key',
        value: 0,
        collected: false
      }
    ],
    obstacles: [
      // Boss chamber walls
      { position: { x: 10, y: 5 }, type: 'wall' },
      { position: { x: 10, y: 6 }, type: 'wall' },
      { position: { x: 10, y: 8 }, type: 'wall' },
      { position: { x: 10, y: 9 }, type: 'wall' },
      { position: { x: 11, y: 5 }, type: 'wall' },
      { position: { x: 11, y: 9 }, type: 'wall' },
      { position: { x: 12, y: 5 }, type: 'wall' },
      { position: { x: 12, y: 9 }, type: 'wall' },
      { position: { x: 13, y: 5 }, type: 'wall' },
      { position: { x: 13, y: 9 }, type: 'wall' },
      { position: { x: 14, y: 5 }, type: 'wall' },
      { position: { x: 14, y: 9 }, type: 'wall' },
      
      // Hazards
      { position: { x: 6, y: 3 }, type: 'fire', damage: 20 },
      { position: { x: 7, y: 3 }, type: 'fire', damage: 20 },
      { position: { x: 8, y: 3 }, type: 'fire', damage: 20 },
      { position: { x: 6, y: 11 }, type: 'acid', damage: 15 },
      { position: { x: 7, y: 11 }, type: 'acid', damage: 15 },
      { position: { x: 8, y: 11 }, type: 'acid', damage: 15 },
      
      // Generators
      { position: { x: 2, y: 12 }, type: 'generator', generatesType: 'grunt', generationRate: 25 }
    ],
    exit: { x: 15, y: 13 },
    objective: "Defeat the Logic Sphinx boss and escape the labyrinth",
    hints: [
      "The boss has a pattern - observe before attacking",
      "Use your special fireball ability for ranged attacks",
      "The key is guarded by the boss",
      "Potions will help you defeat the boss faster"
    ],
    starterCode: `// BOSS BATTLE: The Logic Sphinx!
// New commands:
// hero.useSpecial() - cast a powerful fireball
// hero.observePattern() - returns the boss's attack pattern
// hero.dodge(direction) - quickly move to avoid an attack

// Defeat the boss and escape!
hero.moveRight(3);
hero.moveDown(2);
// Add your boss battle strategy here...`,
    solution: `hero.moveRight(3);
hero.moveDown(2);
hero.moveRight(7);
hero.moveDown(5);

// Get the potion first
hero.moveLeft(6);
hero.moveDown(1);
// Use the potion
hero.usePotion();

// Attack the boss
hero.moveRight(8);
const pattern = hero.observePattern();
for (let i = 0; i < 5; i++) {
  hero.useSpecial(); // Fireball attack
  if (pattern === 'fire') {
    hero.dodge('left');
  } else {
    hero.dodge('right');
  }
}

// Get the key and exit
hero.moveRight(2);
hero.moveDown(6);`,
    timeLimit: 180,
    floorType: 'logic',
    difficulty: 'hard',
    bossLevel: true,
    generators: [{ x: 2, y: 12 }],
    specialEffects: ['bossIntro', 'fireballExplosion', 'victoryFanfare']
  }
];