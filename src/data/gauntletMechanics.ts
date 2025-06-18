// 🎮 Gauntlet II Inspired Game Mechanics
// Based on the original arcade classic with educational coding twists

export interface GauntletMechanic {
  name: string;
  description: string;
  originalDescription: string;
  educationalBenefit: string;
  implementation: string;
}

// Core Gauntlet II mechanics to implement in our educational game
export const GAUNTLET_MECHANICS: GauntletMechanic[] = [
  {
    name: "Four Character Classes",
    description: "Four distinct hero classes with unique abilities that match our mentors",
    originalDescription: "Warrior (strongest), Valkyrie (fastest), Wizard (magic), Elf (agile)",
    educationalBenefit: "Each class teaches different coding concepts through their abilities",
    implementation: "Sage (Wizard) teaches variables, Rex (Warrior) teaches loops, Arrow (Elf) teaches logic, Luna (Valkyrie) teaches functions"
  },
  {
    name: "Health Depletion",
    description: "Health constantly decreases over time, requiring food pickups",
    originalDescription: "Health ticks down automatically, requiring strategic food collection",
    educationalBenefit: "Creates urgency and teaches resource management in coding",
    implementation: "Add automatic health reduction with 'code efficiency' pickups that restore health"
  },
  {
    name: "Treasure Collection",
    description: "Collect gems, coins, and treasures for points and power",
    originalDescription: "Gold, silver, treasure chests with point values",
    educationalBenefit: "Rewards for completing coding challenges correctly",
    implementation: "Different treasure types for different coding achievements (loops, functions, etc.)"
  },
  {
    name: "Potion System",
    description: "Special potions that grant temporary abilities",
    originalDescription: "Temporary invincibility, extra damage, speed boost potions",
    educationalBenefit: "Represents coding power-ups like functions and efficient algorithms",
    implementation: "Code efficiency potions, loop potions, function potions that grant special abilities"
  },
  {
    name: "Monster Generators",
    description: "Spawners that continuously create enemies until destroyed",
    originalDescription: "Ghost, Demon, Grunts generators that must be destroyed",
    educationalBenefit: "Teaches the concept of infinite loops and how to break them",
    implementation: "Bug generators that spawn coding bugs until player writes code to destroy them"
  },
  {
    name: "Exit Portal",
    description: "Each level has an exit that must be reached to progress",
    originalDescription: "Exit appears after objectives are completed",
    educationalBenefit: "Represents completing a coding challenge successfully",
    implementation: "Exit portal appears after all coding objectives for the level are met"
  },
  {
    name: "Keys and Doors",
    description: "Collect keys to unlock doors blocking progress",
    originalDescription: "Keys unlock color-matched doors",
    educationalBenefit: "Represents prerequisites in coding (must learn X before Y)",
    implementation: "Concept keys that unlock advanced coding areas (e.g., loop key unlocks function door)"
  },
  {
    name: "Special Abilities",
    description: "Each character class has unique special abilities",
    originalDescription: "Warrior has strongest attack, Wizard has best magic, etc.",
    educationalBenefit: "Different approaches to solving coding problems",
    implementation: "Rex can use powerful loop attacks, Sage can create variable containers, etc."
  },
  {
    name: "Voice Announcements",
    description: "Iconic voice callouts for important events",
    originalDescription: "\"Warrior needs food, badly!\" and \"Elf shot the food!\"",
    educationalBenefit: "Audio reinforcement of coding concepts and mistakes",
    implementation: "\"Syntax error detected!\" \"Loop condition is false!\" \"Function executed successfully!\""
  },
  {
    name: "Multiplayer Cooperation",
    description: "Multiple players can work together with different strengths",
    originalDescription: "Up to 4 players with different classes working together",
    educationalBenefit: "Teaches collaborative coding and specialization",
    implementation: "Allow students to pair program with different mentor characters"
  },
  {
    name: "Secret Rooms",
    description: "Hidden areas with special rewards for exploration",
    originalDescription: "Secret walls that can be destroyed to find treasure",
    educationalBenefit: "Rewards curiosity and trying different coding approaches",
    implementation: "Hidden coding challenges that reveal bonus content when solved creatively"
  },
  {
    name: "Reflective Shots",
    description: "Projectiles that bounce off walls",
    originalDescription: "Wizard and Elf shots can bounce to hit enemies around corners",
    educationalBenefit: "Teaches concepts of recursion and indirect problem solving",
    implementation: "Recursive function attacks that can solve complex problems"
  },
  {
    name: "Death",
    description: "Character death with ability to continue",
    originalDescription: "When health reaches zero, player can continue with another credit",
    educationalBenefit: "Teaches persistence through coding failures",
    implementation: "When code fails completely, student can restart with helpful hints"
  },
  {
    name: "Poison Food",
    description: "Some pickups look beneficial but cause harm",
    originalDescription: "Poison food reduces health instead of increasing it",
    educationalBenefit: "Teaches debugging and identifying harmful code patterns",
    implementation: "Bug pickups that look like helpful code but introduce errors"
  },
  {
    name: "Transporters",
    description: "Teleport players to different areas of the level",
    originalDescription: "Teleport pads that move players instantly across the map",
    educationalBenefit: "Represents function calls and code jumps",
    implementation: "Function transporters that move players to different code sections"
  },
  {
    name: "Level Timers",
    description: "Time limits to complete level objectives",
    originalDescription: "Some levels had time limits before exits closed",
    educationalBenefit: "Teaches code optimization and efficiency",
    implementation: "Optimization challenges with time limits to solve coding problems"
  },
  {
    name: "It Tags",
    description: "Special enemy that infects players with 'It' status",
    originalDescription: "Being tagged as 'It' attracts all enemies to the player",
    educationalBenefit: "Represents buggy code that causes cascading errors",
    implementation: "Bug infection that spreads to other code blocks until fixed"
  },
  {
    name: "Acid Puddles",
    description: "Hazardous floor tiles that damage players",
    originalDescription: "Acid puddles that drain health when stepped on",
    educationalBenefit: "Represents dangerous coding practices to avoid",
    implementation: "Bad practice puddles that damage code health when used"
  },
  {
    name: "Treasure Rooms",
    description: "Special rooms filled with valuable collectibles",
    originalDescription: "Rooms packed with treasure for massive point gains",
    educationalBenefit: "Rewards for mastering advanced coding concepts",
    implementation: "Bonus challenge rooms with advanced coding rewards"
  }
];

// Gauntlet II enemy types to implement as coding challenges
export const GAUNTLET_ENEMIES = [
  {
    name: "Grunts",
    originalDescription: "Basic enemies that chase players",
    codingEquivalent: "Syntax Errors",
    difficulty: "Easy",
    behavior: "Moves directly toward player, defeated with basic attacks"
  },
  {
    name: "Ghosts",
    originalDescription: "Can pass through walls to chase players",
    codingEquivalent: "Logic Errors",
    difficulty: "Medium",
    behavior: "Ignores obstacles, requires logical thinking to defeat"
  },
  {
    name: "Demons",
    originalDescription: "Shoot fireballs at players from a distance",
    codingEquivalent: "Runtime Errors",
    difficulty: "Hard",
    behavior: "Attacks from distance, requires defensive coding strategies"
  },
  {
    name: "Lobbers",
    originalDescription: "Throw projectiles over walls",
    codingEquivalent: "Scope Errors",
    difficulty: "Medium",
    behavior: "Attacks from unexpected angles, teaching variable scope"
  },
  {
    name: "Sorcerers",
    originalDescription: "Turn invisible and reappear elsewhere",
    codingEquivalent: "Hidden Bugs",
    difficulty: "Hard",
    behavior: "Disappears and reappears, teaching debugging skills"
  },
  {
    name: "Death",
    originalDescription: "Invincible enemy that drains health on contact",
    codingEquivalent: "Infinite Loops",
    difficulty: "Very Hard",
    behavior: "Cannot be defeated, only avoided, teaching loop exit conditions"
  },
  {
    name: "Acid Puddles",
    originalDescription: "Floor hazards that damage players",
    codingEquivalent: "Anti-patterns",
    difficulty: "Medium",
    behavior: "Damages player when touched, teaching code best practices"
  },
  {
    name: "It",
    originalDescription: "Special enemy that tags players as 'It'",
    codingEquivalent: "Cascading Errors",
    difficulty: "Hard",
    behavior: "Causes all other enemies to target player, teaching error handling"
  }
];

// Gauntlet II power-ups as coding concept rewards
export const GAUNTLET_POWERUPS = [
  {
    name: "Food",
    originalDescription: "Restores player health",
    codingEquivalent: "Code Optimization",
    effect: "Restores code health when player writes efficient code"
  },
  {
    name: "Treasure",
    originalDescription: "Provides points",
    codingEquivalent: "Clean Code",
    effect: "Awards points for well-structured, readable code"
  },
  {
    name: "Potion",
    originalDescription: "Temporary special ability",
    codingEquivalent: "Library Functions",
    effect: "Grants temporary access to powerful pre-built functions"
  },
  {
    name: "Key",
    originalDescription: "Unlocks doors",
    codingEquivalent: "Concept Mastery",
    effect: "Unlocks access to more advanced coding concepts"
  },
  {
    name: "Speed Boots",
    originalDescription: "Increases movement speed",
    codingEquivalent: "Keyboard Shortcuts",
    effect: "Allows faster code writing and execution"
  },
  {
    name: "Invincibility",
    originalDescription: "Temporary immunity to damage",
    codingEquivalent: "Error Handling",
    effect: "Code continues running despite minor errors"
  },
  {
    name: "Extra Shot Power",
    originalDescription: "Stronger attacks",
    codingEquivalent: "Advanced Functions",
    effect: "Code has greater impact and efficiency"
  }
];

// Gauntlet II level types as educational progression
export const GAUNTLET_LEVEL_TYPES = [
  {
    name: "Treasure Rooms",
    originalDescription: "Rooms filled with collectibles",
    educationalEquivalent: "Concept Introduction",
    purpose: "Introduces new coding concepts in a low-pressure environment"
  },
  {
    name: "Combat Arenas",
    originalDescription: "Open areas with many enemies",
    educationalEquivalent: "Practice Challenges",
    purpose: "Tests understanding of concepts with multiple coding challenges"
  },
  {
    name: "Maze Levels",
    originalDescription: "Complex navigation puzzles",
    educationalEquivalent: "Logic Puzzles",
    purpose: "Develops problem-solving and algorithm development skills"
  },
  {
    name: "Boss Levels",
    originalDescription: "Powerful enemies requiring strategy",
    educationalEquivalent: "Capstone Projects",
    purpose: "Tests mastery of multiple concepts in a complex challenge"
  },
  {
    name: "Secret Levels",
    originalDescription: "Hidden areas with special rewards",
    educationalEquivalent: "Bonus Challenges",
    purpose: "Provides extra practice for students who want more depth"
  }
];

// Iconic Gauntlet II voice lines adapted for coding education
export const GAUNTLET_VOICE_LINES = [
  {
    original: "Warrior needs food, badly!",
    coding: "Sage needs food, badly!",
    trigger: "When food is critically low"
  },
  {
    original: "Elf shot the food!",
    coding: "Sage deleted the variable!",
    trigger: "When a necessary variable is removed from code"
  },
  {
    original: "Wizard is about to die!",
    coding: "Sage is about to die!",
    trigger: "When health is critically low"
  },
  {
    original: "Use magic to fight Death!",
    coding: "Use recursion to solve this problem!",
    trigger: "When a recursive solution would be optimal"
  },
  {
    original: "Remember, don't shoot food!",
    coding: "Remember, don't delete working code!",
    trigger: "When student is about to remove functional code"
  },
  {
    original: "I've not seen such bravery!",
    coding: "I've not seen such elegant code!",
    trigger: "When student writes particularly efficient solution"
  },
  {
    original: "Let's see you get out of here!",
    coding: "Let's see you debug this!",
    trigger: "When presenting a complex debugging challenge"
  },
  {
    original: "Welcome to Gauntlet!",
    coding: "Welcome to Code Gauntlet!",
    trigger: "When starting the game"
  },
  {
    original: "I like Valkyrie!",
    coding: "I like your function approach!",
    trigger: "When student uses functions effectively"
  }
];