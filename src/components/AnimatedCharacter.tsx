import React, { useEffect, useState } from 'react';

interface AnimatedCharacterProps {
  direction: 'up' | 'down' | 'left' | 'right';
  state: 'idle' | 'walk';
  style?: React.CSSProperties;
}

export const AnimatedCharacter: React.FC<AnimatedCharacterProps> = ({
  direction,
  state,
  style = {}
}) => {
  const [frame, setFrame] = useState(0);
  const frameCount = 7; // We have 7 frames per animation (0-6)
  const frameRate = state === 'idle' ? 200 : 100; // Slower for idle, faster for walking

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(current => (current + 1) % frameCount);
    }, frameRate);

    return () => clearInterval(interval);
  }, [frameRate]);

  // Import the image directly from the src directory
  const imagePath = new URL(
    `../assets/characters/warrior/${state === 'idle' ? 'Idle' : 'Walk'}_${direction.charAt(0).toUpperCase() + direction.slice(1)}/${String(frame).padStart(3, '0')}.png`,
    import.meta.url
  ).href;

  console.log('Loading image:', imagePath);

  return (
    <div style={{ width: '64px', height: '64px' }}>
      <img 
        src={imagePath} 
        alt={`Character ${state} ${direction}`}
        style={{ 
          width: '100%', 
          height: '100%', 
          imageRendering: 'pixelated',
          display: 'block'
        }}
        onError={(e) => {
          console.error('Failed to load image:', imagePath);
          console.error('Error:', e);
        }}
      />
    </div>
  );
};