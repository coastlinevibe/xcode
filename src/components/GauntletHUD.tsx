import React from 'react';
import { Character } from '../types/game';
import { Heart, Star, Key, Trophy, Target, Code, Clock, Skull, Pizza } from 'lucide-react';

interface GauntletHUDProps {
  character: Character;
  level: number;
  totalLevels: number;
  score: number;
  health: number;
  maxHealth: number;
  food: number;
  maxFood: number;
  keys: number;
  potions: number;
  time: number;
  objective: string;
}

export const GauntletHUD: React.FC<GauntletHUDProps> = ({
  character,
  level,
  totalLevels,
  score,
  health,
  maxHealth,
  food,
  maxFood,
  keys,
  potions,
  time,
  objective
}) => {
  const healthPercentage = (health / maxHealth) * 100;
  const foodPercentage = (food / maxFood) * 100;
  
  // Gauntlet-style health warning
  const healthWarning = health < maxHealth * 0.3;
  const foodWarning = food < maxFood * 0.3;
  
  return (
    <div className="space-y-4">
      {/* Level Info - Gauntlet arcade style */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-4 rounded-xl shadow-lg border-2 border-yellow-600">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-yellow-400">Level {level}</h2>
            <p className="text-yellow-200">of {totalLevels}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-1 justify-end">
              <Trophy className="w-5 h-5 text-yellow-400" />
              <span className="text-xl font-bold text-yellow-400">{score}</span>
            </div>
            <p className="text-yellow-200 text-sm">Score</p>
          </div>
        </div>
      </div>

      {/* Character Stats - Gauntlet style meters */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`bg-black p-4 rounded-xl shadow-lg border-2 ${healthWarning ? 'border-red-600 animate-pulse' : 'border-red-400'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Heart className={`w-5 h-5 ${healthWarning ? 'text-red-600 animate-pulse' : 'text-red-500'}`} />
            <span className={`font-semibold ${healthWarning ? 'text-red-600' : 'text-red-400'}`}>Health</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                healthPercentage > 60 ? 'bg-green-500' : 
                healthPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${healthPercentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className={`text-sm ${healthWarning ? 'text-red-600 font-bold' : 'text-gray-400'}`}>
              {health}/{maxHealth}
            </p>
            {healthWarning && (
              <p className="text-sm text-red-600 font-bold animate-pulse">WARNING!</p>
            )}
          </div>
        </div>

        <div className={`bg-black p-4 rounded-xl shadow-lg border-2 ${foodWarning ? 'border-green-600 animate-pulse' : 'border-green-400'}`}>
          <div className="flex items-center space-x-2 mb-2">
            <Pizza className={`w-5 h-5 ${foodWarning ? 'text-green-600 animate-pulse' : 'text-green-500'}`} />
            <span className={`font-semibold ${foodWarning ? 'text-green-600' : 'text-green-400'}`}>Food</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-3 mb-1">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                foodPercentage > 60 ? 'bg-green-500' : 
                foodPercentage > 30 ? 'bg-yellow-500' : 'bg-red-500 animate-pulse'
              }`}
              style={{ width: `${foodPercentage}%` }}
            />
          </div>
          <div className="flex justify-between">
            <p className={`text-sm ${foodWarning ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
              {food}/{maxFood}
            </p>
            {foodWarning && (
              <p className="text-sm text-green-600 font-bold animate-pulse">NEED FOOD!</p>
            )}
          </div>
        </div>
      </div>

      {/* Inventory - Gauntlet style */}
      <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-amber-600">
        <div className="flex items-center space-x-2 mb-3">
          <Star className="w-5 h-5 text-amber-500" />
          <span className="font-semibold text-amber-400">Inventory</span>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
            <span className="text-xl text-yellow-400">🪙</span>
            <span className="text-xs text-gray-300 mt-1">x{score}</span>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
            <span className="text-xl text-amber-400">🗝️</span>
            <span className="text-xs text-gray-300 mt-1">x{keys}</span>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
            <span className="text-xl text-blue-400">🧪</span>
            <span className="text-xs text-gray-300 mt-1">x{potions}</span>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-2 flex flex-col items-center">
            <span className="text-xl text-purple-400">⏱️</span>
            <span className="text-xs text-gray-300 mt-1">{time}s</span>
          </div>
        </div>
      </div>

      {/* Character Class - Gauntlet style */}
      <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-blue-600">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-2xl">
            {character.class === 'warrior' ? '⚔️' : 
             character.class === 'valkyrie' ? '👑' : 
             character.class === 'wizard' ? '🧙‍♂️' : '🏹'}
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-400">{character.name}</h3>
            <p className="text-sm text-blue-300 capitalize">{character.class}</p>
          </div>
        </div>
      </div>

      {/* Objective - Gauntlet style */}
      <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-purple-600">
        <div className="flex items-center space-x-2 mb-2">
          <Target className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-purple-400">Mission</span>
        </div>
        <p className="text-purple-200">{objective}</p>
      </div>

      {/* Gauntlet Tips */}
      <div className="bg-black p-4 rounded-xl shadow-lg border-2 border-gray-600">
        <div className="flex items-center space-x-2 mb-2">
          <Skull className="w-5 h-5 text-gray-400" />
          <span className="font-semibold text-gray-400">Gauntlet Tips</span>
        </div>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• Health decreases over time - find food!</li>
          <li>• Destroy generators to stop enemies</li>
          <li>• Keys unlock doors to new areas</li>
          <li>• Potions grant temporary powers</li>
        </ul>
      </div>
    </div>
  );
};