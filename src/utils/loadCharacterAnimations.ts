import { SpriteAnimation, SpriteDirection } from '../types/game';

export type AnimationType = 'idle' | 'walk' | 'attack' | 'death';
export type Direction = 'down' | 'left' | 'right' | 'up';
export type CharacterClass = 'warrior' | 'wizard' | 'elf' | 'valkyrie';

// Statically import all possible frames for all classes/types/directions
const allFrames: Record<CharacterClass, Record<string, Record<string, string>>> = {
  warrior: {
    idle_down: import.meta.glob('/src/assets/characters/warrior/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/warrior/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/warrior/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/warrior/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/warrior/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/warrior/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/warrior/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/warrior/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/warrior/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/warrior/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/warrior/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/warrior/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/warrior/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/warrior/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/warrior/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/warrior/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  wizard: {
    idle_down: import.meta.glob('/src/assets/characters/wizard/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/wizard/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/wizard/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/wizard/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/wizard/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/wizard/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/wizard/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/wizard/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/wizard/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/wizard/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/wizard/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/wizard/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/wizard/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/wizard/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/wizard/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/wizard/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  elf: {
    idle_down: import.meta.glob('/src/assets/characters/elf/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/elf/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/elf/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/elf/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/elf/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/elf/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/elf/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/elf/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/elf/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/elf/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/elf/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/elf/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/elf/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/elf/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/elf/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/elf/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
  valkyrie: {
    idle_down: import.meta.glob('/src/assets/characters/valkyrie/idle_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_left: import.meta.glob('/src/assets/characters/valkyrie/idle_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_right: import.meta.glob('/src/assets/characters/valkyrie/idle_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    idle_up: import.meta.glob('/src/assets/characters/valkyrie/idle_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_down: import.meta.glob('/src/assets/characters/valkyrie/walk_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_left: import.meta.glob('/src/assets/characters/valkyrie/walk_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_right: import.meta.glob('/src/assets/characters/valkyrie/walk_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    walk_up: import.meta.glob('/src/assets/characters/valkyrie/walk_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_down: import.meta.glob('/src/assets/characters/valkyrie/attack_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_left: import.meta.glob('/src/assets/characters/valkyrie/attack_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_right: import.meta.glob('/src/assets/characters/valkyrie/attack_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    attack_up: import.meta.glob('/src/assets/characters/valkyrie/attack_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_down: import.meta.glob('/src/assets/characters/valkyrie/death_down/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_left: import.meta.glob('/src/assets/characters/valkyrie/death_left/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_right: import.meta.glob('/src/assets/characters/valkyrie/death_right/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
    death_up: import.meta.glob('/src/assets/characters/valkyrie/death_up/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' }),
  },
};

function getFrameUrls(characterClass: CharacterClass, animType: AnimationType, dir: Direction): string[] {
  const key = `${animType}_${dir}`;
  const modules = allFrames[characterClass]?.[key] || {};
  return Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, url]) => url);
}

export function loadCharacterAnimations(characterClass: CharacterClass): Record<string, SpriteAnimation> {
  const animationTypes: AnimationType[] = ['idle', 'walk', 'attack', 'death'];
  const directions: Direction[] = ['down', 'left', 'right', 'up'];
  const animations: Record<string, SpriteAnimation> = {};

  for (const animType of animationTypes) {
    const directionsObj: Record<Direction, SpriteDirection> = {
      down: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
      left: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
      right: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
      up: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
    };

    for (const dir of directions) {
      const urls = getFrameUrls(characterClass, animType, dir);
      const frames = urls.map((url, idx) => ({
        id: `frame_${idx}`,
        url,
        width: 64, // Set your frame width
        height: 64, // Set your frame height
        sourceX: 0,
        sourceY: 0,
      }));
      if (frames.length > 0) {
        directionsObj[dir] = {
          frames,
          frameCount: frames.length,
          animationSpeed: 150,
          loop: animType !== 'death',
        };
      }
    }

    animations[animType] = {
      id: animType,
      name: animType,
      directions: directionsObj,
    };
  }

  return animations;
} 