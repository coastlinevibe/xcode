import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types/game';
import { SpriteAnimation } from '../types/game';

interface AnimatedCharacterProps {
  character: Character;
  isRunning: boolean;
  sprites: Record<string, SpriteAnimation>;
  currentAction?: 'idle' | 'walking' | 'attacking' | 'dead';
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  character,
  isRunning,
  sprites,
  currentAction = 'idle'
}) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const animationRef = useRef<number>();

  // Determine which animation and direction to use (Construct 3 style)
  const getAnimationKey = (): string => {
    if (currentAction === 'attacking') return 'attack';
    if (currentAction === 'dead') return 'death';
    if (currentAction === 'walking' || isRunning) return 'walk';
    return 'idle';
  };

  // Map character direction to Construct 3 direction system
  const getDirectionKey = (): 'down' | 'left' | 'right' | 'up' => {
    switch (character.direction) {
      case 'left': return 'left';   // Direction 1
      case 'right': return 'right'; // Direction 2
      case 'up': return 'up';       // Direction 3
      case 'down': 
      default: return 'down';       // Direction 0 (default)
    }
  };

  const animationKey = getAnimationKey();
  const directionKey = getDirectionKey();
  const currentAnimation = sprites[animationKey];
  const currentDirection = currentAnimation?.directions[directionKey];

  // Debug logging
  useEffect(() => {
    console.log(`🎬 Construct 3 Animation:`, {
      action: currentAction,
      characterDirection: character.direction,
      animationKey,
      directionKey,
      animationFound: !!currentAnimation,
      directionFound: !!currentDirection,
      frameCount: currentDirection?.frameCount || 0,
      currentFrame,
      availableAnimations: Object.keys(sprites),
      isRunning
    });
  }, [currentAction, character.direction, animationKey, directionKey, currentAnimation, currentDirection, sprites, currentFrame, isRunning]);

  useEffect(() => {
    // Clear any existing animation
    if (animationRef.current) {
      clearInterval(animationRef.current);
    }

    if (!currentDirection || currentDirection.frames.length === 0) {
      setCurrentFrame(0);
      return;
    }

    // Reset frame when animation/direction changes
    setCurrentFrame(0);

    // Determine if we should animate
    const shouldAnimate = 
      isRunning || 
      currentAction === 'attacking' || 
      currentAction === 'dead' ||
      (currentAction === 'idle' && currentDirection.loop);
    
    if (shouldAnimate) {
      let frame = 0;
      const animate = () => {
        setCurrentFrame(frame);
        
        // For death animation, stop at the last frame
        if (currentAction === 'dead' && frame === currentDirection.frameCount - 1) {
          return; // Don't loop death animation
        }
        
        frame = (frame + 1) % currentDirection.frameCount;
      };

      // Start animation
      animate(); // Set initial frame
      animationRef.current = setInterval(animate, currentDirection.animationSpeed);
    }

    return () => {
      if (animationRef.current) {
        clearInterval(animationRef.current);
      }
    };
  }, [currentDirection, isRunning, currentAction]);

  // If no custom animation is available, fall back to emoji
  if (!currentDirection || currentDirection.frames.length === 0) {
    return (
      <div className={`
        absolute inset-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg 
        flex items-center justify-center text-white text-xl font-bold
        ${isRunning ? 'animate-bounce ring-4 ring-yellow-400 ring-opacity-50' : 'hover:scale-110'}
        transform transition-all duration-500
      `}>
        🧙‍♂️
      </div>
    );
  }

  const currentFrameData = currentDirection.frames[currentFrame];
  
  if (!currentFrameData) {
    return (
      <div className={`
        absolute inset-1 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full shadow-lg 
        flex items-center justify-center text-white text-xl font-bold
        ${isRunning ? 'animate-bounce ring-4 ring-yellow-400 ring-opacity-50' : 'hover:scale-110'}
        transform transition-all duration-500
      `}>
        🧙‍♂️
      </div>
    );
  }

  return (
    <div className={`
      absolute inset-1 rounded-full shadow-lg flex items-center justify-center
      ${isRunning ? 'ring-4 ring-yellow-400 ring-opacity-50' : 'hover:scale-110'}
      transform transition-all duration-500
    `}>
      <div
        className="w-full h-full"
        style={{
          backgroundImage: `url(${currentFrameData.url})`,
          // Use the pre-calculated source position for this frame (Construct 3 style)
          backgroundPosition: `-${currentFrameData.sourceX}px -${currentFrameData.sourceY}px`,
          backgroundRepeat: 'no-repeat',
          imageRendering: 'pixelated',
          width: currentFrameData.width,
          height: currentFrameData.height,
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
};