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
  name: string;
  frames: string[];
  settings: {
    speed: number;
    loop: boolean;
    pingPong: boolean;
    reverse: boolean;
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

export enum TileType {
  Empty = 0,
  Wall = 1,
  Floor = 2,
  Crate = 3,
  Exit = 4
}

export interface TileData {
  type: TileType;
  x: number;
  y: number;
  properties?: {
    [key: string]: any;
  };
}

export interface TileMap {
  width: number;
  height: number;
  tileSize: number;
  tiles: TileData[];
  startPosition: {
    x: number;
    y: number;
  };
  exitPosition?: {
    x: number;
    y: number;
  };
}

export interface Level {
  id: string;
  name: string;
  map: TileMap;
  objectives: string[];
  hints?: string[];
}

export interface GameState {
  x: number;
  y: number;
  direction: 'up' | 'down' | 'left' | 'right';
  isRunning: boolean;
  gameOver: boolean;
  moves: number;
  diamonds: number;
  keys: number;
  character: {
    class: string;
    position: {
      x: number;
      y: number;
    };
    direction: 'up' | 'down' | 'left' | 'right';
  };
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

export interface Animation {
  name: string;
  frames: string[];
  settings: {
    speed: number;
    loop: boolean;
    pingPong: boolean;
    reverse: boolean;
  };
}

export interface AnimationFolder {
  id: string;
  name: string;
  animations: number[]; // Array of animation indices
  isOpen: boolean;
}

export interface Sprite {
  id: string;
  name: string;
  animations: SpriteAnimation[];
  folders: AnimationFolder[];
  createdAt?: string;
  updatedAt?: string;
}