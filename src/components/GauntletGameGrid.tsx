import React, { useState, useEffect, useRef } from 'react';
import { Character, Enemy, Collectible, Obstacle, Position, SpriteAnimation } from '../types/game';
import { AnimatedCharacter } from './AnimatedCharacter';

interface GauntletGameGridProps {
  gridSize: { width: number; height: number };
  character: Character;
  enemies: Enemy[];
  collectibles: Collectible[];
  obstacles: Obstacle[];
  exit: Position;
  isRunning: boolean;
  health: number;
  maxHealth: number;
  food: number;
  maxFood: number;
  score: number;
  level: number;
  time: number;
  sprites?: Record<string, SpriteAnimation>;
  currentAction?: 'idle' | 'walking' | 'attacking' | 'dead';
  onCollectItem?: (item: Collectible) => void;
  onEnemyDefeat?: (enemy: Enemy) => void;
  onExitReached?: () => void;
}

export const GauntletGameGrid: React.FC<GauntletGameGridProps> = ({
  gridSize,
  character,
  enemies,
  collectibles,
  obstacles,
  exit,
  isRunning,
  health,
  maxHealth,
  food,
  maxFood,
  score,
  level,
  time,
  sprites = {},
  currentAction = 'idle',
  onCollectItem,
  onEnemyDefeat,
  onExitReached
}) => {
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [generators, setGenerators] = useState<Position[]>([
    { x: 2, y: 2 }, { x: gridSize.width - 3, y: gridSize.height - 3 }
  ]);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const messageTimeoutRef = useRef<NodeJS.Timeout>();

  // Gauntlet-style automatic health depletion
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // This would be handled by the game state in a real implementation
        // For now, we'll just show a message
        if (health <= 20 && !showMessage) {
          displayMessage(`${character.name} needs food, badly!`);
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isRunning, health, character.name, showMessage]);

  const displayMessage = (message: string) => {
    setShowMessage(message);
    if (messageTimeoutRef.current) {
      clearTimeout(messageTimeoutRef.current);
    }
    messageTimeoutRef.current = setTimeout(() => {
      setShowMessage(null);
    }, 3000);
  };

  // Gauntlet-style generator animation
  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        // Animate generators (in a real implementation, this would spawn enemies)
        setGenerators(prev => [...prev]);
      }, 500);
      
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getCellContent = (x: number, y: number) => {
    // Check for generators first (Gauntlet-style monster generators)
    const isGenerator = generators.some(g => g.x === x && g.y === y);
    if (isGenerator) {
      return (
        <div className="absolute inset-0 bg-red-600 rounded-md border-2 border-red-800 animate-pulse flex items-center justify-center">
          <div className="text-white text-xs font-bold">GEN</div>
        </div>
      );
    }

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
      // Gauntlet-style enemy visualization
      const enemyEmoji = getEnemyEmoji(enemy.type);
      const enemyColor = getEnemyColor(enemy.type);
      
      return (
        <div className={`absolute inset-1 bg-gradient-to-br ${enemyColor} rounded-lg shadow-lg 
          flex flex-col items-center justify-center text-lg transform transition-all duration-300 
          hover:scale-105 ${isRunning ? 'animate-bounce' : ''}`}>
          <div className="text-xl">{enemyEmoji}</div>
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
      } else if (obstacle.type === 'generator') {
        return (
          <div className="absolute inset-0 bg-red-600 rounded-md border-2 border-red-800 animate-pulse flex items-center justify-center">
            <div className="text-white text-xs font-bold">GEN</div>
          </div>
        );
      } else {
        const obstacleEmoji = getObstacleEmoji(obstacle.type);
        const obstacleColor = getObstacleColor(obstacle.type);
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
      const itemEmoji = getCollectibleEmoji(collectible.type);
      const itemColor = getCollectibleColor(collectible.type);
      return (
        <div className={`absolute inset-2 bg-gradient-to-br ${itemColor} rounded-full shadow-lg flex items-center justify-center text-lg animate-bounce transform transition-all duration-300 hover:scale-110`}>
          {itemEmoji}
        </div>
      );
    }

    return null;
  };

  const getEnemyEmoji = (type: string): string => {
    switch (type) {
      case 'grunt': return '👹';
      case 'ghost': return '👻';
      case 'demon': return '👿';
      case 'sorcerer': return '🧙';
      case 'lobber': return '🧟';
      case 'death': return '💀';
      case 'dragon': return '🐉';
      case 'orc': return '👺';
      case 'skeleton': return '☠️';
      default: return '👾';
    }
  };

  const getEnemyColor = (type: string): string => {
    switch (type) {
      case 'grunt': return 'from-yellow-600 to-yellow-800';
      case 'ghost': return 'from-blue-400 to-blue-600';
      case 'demon': return 'from-red-600 to-red-800';
      case 'sorcerer': return 'from-purple-600 to-purple-800';
      case 'lobber': return 'from-green-600 to-green-800';
      case 'death': return 'from-black to-gray-800';
      case 'dragon': return 'from-red-700 to-red-900';
      case 'orc': return 'from-orange-600 to-orange-800';
      case 'skeleton': return 'from-gray-300 to-gray-500';
      default: return 'from-indigo-500 to-indigo-700';
    }
  };

  const getObstacleEmoji = (type: string): string => {
    switch (type) {
      case 'spike': return '⚡';
      case 'fire': return '🔥';
      case 'poison': return '☠️';
      case 'acid': return '🧪';
      case 'it': return '🎯';
      default: return '⚠️';
    }
  };

  const getObstacleColor = (type: string): string => {
    switch (type) {
      case 'spike': return 'from-yellow-500 to-orange-600';
      case 'fire': return 'from-red-500 to-red-700';
      case 'poison': return 'from-green-500 to-green-700';
      case 'acid': return 'from-green-300 to-green-500';
      case 'it': return 'from-purple-500 to-purple-700';
      default: return 'from-gray-500 to-gray-700';
    }
  };

  const getCollectibleEmoji = (type: string): string => {
    switch (type) {
      case 'coin': return '🪙';
      case 'gem': return '💎';
      case 'heart': return '❤️';
      case 'key': return '🗝️';
      case 'food': return '🍗';
      case 'potion': return '🧪';
      case 'treasure': return '💰';
      default: return '✨';
    }
  };

  const getCollectibleColor = (type: string): string => {
    switch (type) {
      case 'coin': return 'from-yellow-400 to-yellow-600';
      case 'gem': return 'from-purple-400 to-purple-600';
      case 'heart': return 'from-red-400 to-red-600';
      case 'key': return 'from-amber-400 to-amber-600';
      case 'food': return 'from-green-400 to-green-600';
      case 'potion': return 'from-blue-400 to-blue-600';
      case 'treasure': return 'from-yellow-300 to-yellow-500';
      default: return 'from-teal-400 to-teal-600';
    }
  };

  const renderGrid = () => {
    const cells = [];
    for (let y = 0; y < gridSize.height; y++) {
      for (let x = 0; x < gridSize.width; x++) {
        const isCharacterPath = character.position.x === x && character.position.y === y;
        const isExit = exit.x === x && exit.y === y;
        const isGenerator = generators.some(g => g.x === x && g.y === y);
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`
              relative w-12 h-12 border border-slate-700 transition-all duration-500
              ${isCharacterPath && isRunning 
                ? 'bg-gradient-to-br from-yellow-200 to-yellow-300 shadow-lg' 
                : isExit
                ? 'bg-gradient-to-br from-green-100 to-green-200'
                : isGenerator
                ? 'bg-gradient-to-br from-red-100 to-red-200'
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

  // Gauntlet-style HUD
  const renderHUD = () => (
    <div className="absolute top-2 left-2 right-2 flex justify-between items-center bg-black bg-opacity-70 text-white p-2 rounded-lg">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <div className="text-xs text-red-400">HEALTH</div>
          <div className="w-24 bg-gray-800 h-3 rounded-full">
            <div 
              className="bg-red-600 h-3 rounded-full"
              style={{ width: `${(health / maxHealth) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-xs text-green-400">FOOD</div>
          <div className="w-24 bg-gray-800 h-3 rounded-full">
            <div 
              className="bg-green-600 h-3 rounded-full"
              style={{ width: `${(food / maxFood) * 100}%` }}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="text-yellow-400">
          <span className="text-xs">SCORE</span>
          <div className="font-bold">{score}</div>
        </div>
        
        <div className="text-blue-400">
          <span className="text-xs">LEVEL</span>
          <div className="font-bold">{level}</div>
        </div>
        
        <div className="text-purple-400">
          <span className="text-xs">TIME</span>
          <div className="font-bold">{time}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative">
      {/* Gauntlet-style message display */}
      {showMessage && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black bg-opacity-80 text-yellow-400 px-6 py-3 rounded-lg text-xl font-bold animate-pulse">
          {showMessage}
        </div>
      )}
      
      {/* Gauntlet-style HUD */}
      {renderHUD()}
      
      <div 
        ref={gridRef}
        className={`
          grid gap-1 p-6 rounded-2xl shadow-inner border-4 transition-all duration-500 relative
          ${isRunning 
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-yellow-600 shadow-2xl' 
            : 'bg-gradient-to-br from-slate-700 to-slate-800 border-slate-600'
          }
        `}
        style={{ 
          gridTemplateColumns: `repeat(${gridSize.width}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.height}, 1fr)`
        }}
      >
        {renderGrid()}
        
        {/* Active effects display (Gauntlet-style) */}
        {activeEffects.length > 0 && (
          <div className="absolute bottom-2 right-2 flex space-x-2">
            {activeEffects.map((effect, index) => (
              <div key={index} className="w-8 h-8 bg-purple-600 bg-opacity-70 rounded-full flex items-center justify-center text-white text-xs animate-pulse">
                {effect === 'invincibility' ? '🛡️' : 
                 effect === 'speed' ? '⚡' : 
                 effect === 'power' ? '💪' : '✨'}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};