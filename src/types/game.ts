export interface Position {
  x: number;
  y: number;
}

export interface Character {
  name: string;
  class: 'warrior' | 'valkyrie' | 'wizard' | 'elf';
  position: Position;
  health: number;
  maxHealth: number;
  food: number;
  maxFood: number;
  gems: number;
  hasKey: boolean;
  direction: 'up' | 'down' | 'left' | 'right';
  specialPower?: string;
  level: number;
  experience: number;
}

export interface Enemy {
  id: string;
  type: 'grunt' | 'ghost' | 'demon' | 'sorcerer' | 'lobber' | 'death' | 'orc' | 'skeleton' | 'dragon';
  position: Position;
  health: number;
  maxHealth: number;
  damage: number;
  isAlive: boolean;
  speed: number;
  behavior: 'chase' | 'shoot' | 'teleport' | 'patrol';
  spawnedFromGenerator?: boolean;
  generatorId?: string;
}

export interface Collectible {
  id: string;
  position: Position;
  type: 'gem' | 'heart' | 'key' | 'coin' | 'food' | 'potion' | 'treasure';
  value: number;
  collected: boolean;
  effect?: string;
  duration?: number;
}

export interface Obstacle {
  position: Position;
  type: 'wall' | 'spike' | 'fire' | 'poison' | 'acid' | 'it' | 'generator';
  damage?: number;
  generatesType?: string;
  generationRate?: number;
  health?: number;
}

// New Construct 3-style sprite interfaces
export interface SpriteAnimation {
  id: string;
  name: string; // e.g., "walk", "idle", "attack"
  directions: {
    down: SpriteDirection;    // Direction 0
    left: SpriteDirection;    // Direction 1  
    right: SpriteDirection;   // Direction 2
    up: SpriteDirection;      // Direction 3
  };
}

export interface SpriteDirection {
  frames: SpriteFrame[];
  frameCount: number;
  animationSpeed: number;
  loop: boolean;
}

export interface SpriteFrame {
  id: string;
  url: string;
  width: number;
  height: number;
  sourceX: number; // X position in sprite sheet
  sourceY: number; // Y position in sprite sheet (usually 0 for horizontal sheets)
}

export interface SpriteSheet {
  id: string;
  name: string;
  animationType: 'idle' | 'walk' | 'attack' | 'death';
  direction: 'down' | 'left' | 'right' | 'up';
  file: File;
  url: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animationSpeed: number;
  frames: SpriteFrame[];
}

export interface Level {
  id: number;
  name: string;
  description: string;
  gridSize: { width: number; height: number };
  character: Character;
  enemies: Enemy[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  exit: Position;
  objective: string;
  hints: string[];
  starterCode: string;
  solution?: string;
  timeLimit?: number;
  generators?: Position[];
  specialEffects?: string[];
  // Gauntlet-specific properties
  floorType?: 'dungeon' | 'crystal' | 'logic' | 'tower';
  difficulty?: 'easy' | 'medium' | 'hard' | 'expert';
  bossLevel?: boolean;
  treasureRoom?: boolean;
  secretAreas?: Position[];
}

export interface GameState {
  currentLevel: number;
  character: Character;
  enemies: Enemy[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  exit: Position;
  isRunning: boolean;
  isComplete: boolean;
  gameOver: boolean;
  moves: number;
  executionLog: string[];
  score: number;
  time: number;
  food: number;
  maxFood: number;
  keys: number;
  potions: number;
  activeEffects: string[];
  generators?: Position[];
}

export interface CodeExecution {
  success: boolean;
  error?: string;
  steps: ExecutionStep[];
}

export interface ExecutionStep {
  type: 'move' | 'attack' | 'collect' | 'wait' | 'say';
  data: any;
  timestamp: number;
}

// Gauntlet-specific interfaces
export interface Generator {
  id: string;
  position: Position;
  type: 'grunt' | 'ghost' | 'demon';
  health: number;
  maxHealth: number;
  generationRate: number; // in seconds
  lastGenerated: number;
  isActive: boolean;
}

export interface PowerUp {
  id: string;
  type: 'invincibility' | 'speed' | 'power' | 'shot' | 'magic';
  duration: number; // in seconds
  startTime: number;
  isActive: boolean;
}

export interface GauntletVoiceLine {
  text: string;
  trigger: string;
  played: boolean;
}