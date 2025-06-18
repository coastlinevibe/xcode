import React from 'react';
import { Character, Enemy, Collectible, Obstacle, Position, SpriteAnimation } from '../types/game';
import { AnimatedCharacter } from './AnimatedCharacter';

interface GameGridProps {
  gridSize: { width: number; height: number };
  character: Character;
  enemies: Enemy[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  exit: Position;
  isRunning: boolean;
  sprites?: Record<string, SpriteAnimation>;
  currentAction?: 'idle' | 'walking' | 'attacking' | 'dead';
}

export const GameGrid: React.FC<GameGridProps> = ({
  gridSize,
  character,
  enemies,
  collectibles,
  obstacles,
  exit,
  isRunning,
  sprites = {},
  currentAction = 'idle'
}) => {
  const getCellContent = (x: number, y: number) => {
    // Character
    if (character.position.x === x && character.position.y === y) {
      return (
        <AnimatedCharacter
          character={character}
          isRunning={isRunning}
          sprites={sprites}
          currentAction={currentAction}
        />
      );
    }

    // Exit
    if (exit.x === x && exit.y === y) {
      const canExit = character.hasKey;
      return (
        <div className={`
          absolute inset-1 rounded-lg shadow-lg flex items-center justify-center text-2xl
          ${canExit 
            ? 'bg-gradient-to-br from-green-400 to-green-600 animate-pulse' 
            : 'bg-gradient-to-br from-gray-400 to-gray-600'
          }
        `}>
          🚪
        </div>
      );
    }

    // Enemies
    const enemy = enemies.find(e => e.position.x === x && e.position.y === y && e.isAlive);
    if (enemy) {
      const enemyEmoji = enemy.type === 'orc' ? '👹' : enemy.type === 'skeleton' ? '💀' : '🐉';
      const enemyColor = enemy.type === 'dragon' ? 'from-red-600 to-red-800' : 'from-orange-600 to-orange-800';
      return (
        <div className={`absolute inset-1 bg-gradient-to-br ${enemyColor} rounded-lg shadow-lg flex flex-col items-center justify-center text-lg transform transition-all duration-300 hover:scale-105`}>
          <div className="text-xl animate-pulse">{enemyEmoji}</div>
          <div className="w-full bg-black bg-opacity-30 rounded-full h-1 mt-1">
            <div 
              className="bg-red-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }}
            />
          </div>
        </div>
      );
    }

    // Obstacles
    const obstacle = obstacles.find(obs => obs.position.x === x && obs.position.y === y);
    if (obstacle) {
      if (obstacle.type === 'wall') {
        return (
          <div className="absolute inset-0 bg-gradient-to-br from-stone-600 to-stone-800 border-2 border-stone-500 flex items-center justify-center text-stone-300">
            🧱
          </div>
        );
      } else {
        const obstacleEmoji = obstacle.type === 'spike' ? '⚡' : obstacle.type === 'fire' ? '🔥' : '☠️';
        const obstacleColor = obstacle.type === 'spike' ? 'from-yellow-500 to-orange-600' : 
                             obstacle.type === 'fire' ? 'from-red-500 to-red-700' : 'from-purple-500 to-purple-700';
        return (
          <div className={`absolute inset-1 bg-gradient-to-br ${obstacleColor} rounded-lg shadow-lg flex items-center justify-center text-xl animate-pulse`}>
            {obstacleEmoji}
          </div>
        );
      }
    }

    // Collectibles
    const collectible = collectibles.find(item => item.position.x === x && item.position.y === y && !item.collected);
    if (collectible) {
      const itemEmoji = collectible.type === 'coin' ? '🪙' : 
                       collectible.type === 'gem' ? '💎' : 
                       collectible.type === 'heart' ? '❤️' : '🗝️';
      const itemColor = collectible.type === 'coin' ? 'from-yellow-400 to-yellow-600' :
                       collectible.type === 'gem' ? 'from-purple-400 to-purple-600' :
                       collectible.type === 'heart' ? 'from-red-400 to-red-600' : 'from-amber-400 to-amber-600';
      return (
        <div className={`absolute inset-2 bg-gradient-to-br ${itemColor} rounded-full shadow-lg flex items-center justify-center text-lg animate-bounce transform transition-all duration-300 hover:scale-110`}>
          {itemEmoji}
        </div>
      );
    }

    return null;
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const isCharacterPath = character.position.x === x && character.position.y === y;
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`
              relative w-12 h-12 border border-slate-300 transition-all duration-500
              ${isCharacterPath && isRunning 
                ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-lg' 
                : 'bg-gradient-to-br from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300'
              }
            `}
          >
            {getCellContent(x, y)}
          </div>
        );
      }
    }
    return cells;
  };

  return (
    <div className="flex justify-center">
      <div 
        className={`
          grid gap-1 p-6 rounded-2xl shadow-inner border-4 transition-all duration-500
          ${isRunning 
            ? 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300 shadow-2xl' 
            : 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200'
          }
        `}
        style={{ 
          gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.height}, 1fr)`
        }}
      >
        {renderGrid()}
      </div>
    </div>
  );
};