import React, { useEffect, useState } from 'react';
import { AnimatedCharacter } from './AnimatedCharacter';

interface GridPosition {
  x: number;
  y: number;
}

interface GameGridProps {
  width: number;
  height: number;
  onExecutionComplete: () => void;
  initialPosition?: GridPosition;
}

// Game state with grid coordinates
const gameState = {
  gridX: 5, // Start at position 5
  gridY: 5, // Start at position 5
  direction: 'down',
  isMoving: false
};

const CELL_SIZE = 48; // Size of each grid cell in pixels
const GRID_OFFSET_X = 100; // Offset from left
const GRID_OFFSET_Y = 100; // Offset from top

// Convert grid coordinates to pixel positions
function gridToPixel(gridPos: GridPosition) {
  return {
    x: GRID_OFFSET_X + (gridPos.x * CELL_SIZE),
    y: GRID_OFFSET_Y + (gridPos.y * CELL_SIZE)
  };
}

// Define the movement functions
function moveRight() {
  console.log('Moving right');
  gameState.direction = 'right';
  gameState.gridX += 1;
  gameState.isMoving = true;
  setTimeout(() => { gameState.isMoving = false; }, 500);
  return true;
}

function moveLeft() {
  console.log('Moving left');
  gameState.direction = 'left';
  gameState.gridX -= 1;
  gameState.isMoving = true;
  setTimeout(() => { gameState.isMoving = false; }, 500);
  return true;
}

function moveUp() {
  console.log('Moving up');
  gameState.direction = 'up';
  gameState.gridY -= 1;
  gameState.isMoving = true;
  setTimeout(() => { gameState.isMoving = false; }, 500);
  return true;
}

function moveDown() {
  console.log('Moving down');
  gameState.direction = 'down';
  gameState.gridY += 1;
  gameState.isMoving = true;
  setTimeout(() => { gameState.isMoving = false; }, 500);
  return true;
}

// Expose movement functions globally
window.yourName = {
  moveRight,
  moveLeft,
  moveUp,
  moveDown
};

export const GameGrid: React.FC<GameGridProps> = ({
  width,
  height,
  onExecutionComplete,
  initialPosition = { x: 5, y: 5 }
}) => {
  // Initialize game state with props
  useEffect(() => {
    gameState.gridX = initialPosition.x;
    gameState.gridY = initialPosition.y;
  }, [initialPosition]);

  const [gridPosition, setGridPosition] = useState<GridPosition>({ x: gameState.gridX, y: gameState.gridY });
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>(gameState.direction as any);
  const [isMoving, setIsMoving] = useState(false);

  // Update component when game state changes
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setGridPosition({ x: gameState.gridX, y: gameState.gridY });
      setDirection(gameState.direction as any);
      setIsMoving(gameState.isMoving);
    }, 50);

    return () => clearInterval(updateInterval);
  }, []);

  // Convert grid position to pixel position
  const pixelPosition = gridToPixel(gridPosition);

  return (
    <div 
      style={{ 
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: '600px',
        backgroundColor: '#1a1b26',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '20px'
      }}
    >
      <div
        style={{
          position: 'relative',
          width: width * CELL_SIZE + (GRID_OFFSET_X * 2),
          height: height * CELL_SIZE + (GRID_OFFSET_Y * 2),
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}
      >
        {/* Grid overlay for debugging */}
        <div style={{
          position: 'absolute',
          top: GRID_OFFSET_Y,
          left: GRID_OFFSET_X,
          width: width * CELL_SIZE,
          height: height * CELL_SIZE,
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, ${CELL_SIZE}px)`,
          gridTemplateRows: `repeat(${height}, ${CELL_SIZE}px)`,
          pointerEvents: 'none',
          opacity: 0.1
        }}>
          {Array.from({ length: width * height }).map((_, i) => (
            <div key={i} style={{ border: '1px solid black' }} />
          ))}
        </div>

        {/* Character */}
        <div
          style={{
            position: 'absolute',
            left: `${pixelPosition.x}px`,
            top: `${pixelPosition.y}px`,
            width: `${CELL_SIZE}px`,
            height: `${CELL_SIZE}px`,
            transform: 'translate(0, 0)',
            transition: 'all 0.5s ease-out',
            zIndex: 1
          }}
        >
          <AnimatedCharacter
            direction={direction}
            state={isMoving ? 'walk' : 'idle'}
          />
        </div>
      </div>
    </div>
  );
};