import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Play, RotateCcw, Download, Eye, Settings, Pause, SkipBack, SkipForward, FolderOpen, Grid, Plus, Zap, Ruler, RefreshCw, CheckCircle, AlertCircle, Image, ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';
import { SpriteSheet, SpriteAnimation, SpriteDirection, SpriteFrame } from '../types/game';

interface SpriteManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSpritesUpdate: (sprites: Record<string, SpriteAnimation>) => void;
  currentSprites: Record<string, SpriteAnimation>;
}

export const SpriteManager: React.FC<SpriteManagerProps> = ({
  isOpen,
  onClose,
  onSpritesUpdate,
  currentSprites
}) => {
  const [animations, setAnimations] = useState<Record<string, SpriteAnimation>>(currentSprites);
  const [selectedAnimation, setSelectedAnimation] = useState<string>('idle');
  const [selectedDirection, setSelectedDirection] = useState<'down' | 'left' | 'right' | 'up'>('down');
  const [previewFrame, setPreviewFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFrameGrid, setShowFrameGrid] = useState(false);
  const [bulkUploadMode, setBulkUploadMode] = useState(false);
  const [isDetectingSize, setIsDetectingSize] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'success' | 'error' | 'processing'>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number>();

  const animationTypes = [
    { key: 'idle', label: 'Idle', description: 'Standing still animation', defaultFrames: { down: 4, left: 4, right: 4, up: 4 } },
    { key: 'walk', label: 'Walk', description: 'Movement animation', defaultFrames: { down: 8, left: 7, right: 7, up: 8 } },
    { key: 'attack', label: 'Attack', description: 'Combat animation', defaultFrames: { down: 6, left: 6, right: 6, up: 6 } },
    { key: 'death', label: 'Death', description: 'Defeat animation', defaultFrames: { down: 8, left: 8, right: 8, up: 8 } }
  ];

  const directions = [
    { key: 'down' as const, label: 'Down', icon: ArrowDown, construct3Index: 0 },
    { key: 'left' as const, label: 'Left', icon: ArrowLeft, construct3Index: 1 },
    { key: 'right' as const, label: 'Right', icon: ArrowRight, construct3Index: 2 },
    { key: 'up' as const, label: 'Up', icon: ArrowUp, construct3Index: 3 }
  ];

  // Auto-detect image dimensions
  const detectImageSize = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  };

  // Create sprite frames from individual frame files (Construct 3 style)
  const createFramesFromIndividualFiles = (files: { file: File; url: string; width: number; height: number }[]): SpriteFrame[] => {
    console.log(`🎬 Creating ${files.length} individual frames from separate files`);
    
    return files.map((fileData, index) => ({
      id: `frame_${index}`,
      url: fileData.url, // Each frame has its own unique URL
      width: fileData.width,
      height: fileData.height,
      sourceX: 0, // No offset needed for individual files
      sourceY: 0  // No offset needed for individual files
    }));
  };

  // Create sprite frames from a horizontal sprite sheet (Construct 3 style)
  const createFramesFromSpriteSheet = (
    url: string, 
    frameCount: number, 
    frameWidth: number, 
    frameHeight: number
  ): SpriteFrame[] => {
    const frames: SpriteFrame[] = [];
    
    console.log(`🎬 Creating ${frameCount} frames from sprite sheet:`, {
      url: url.substring(0, 50) + '...',
      frameWidth,
      frameHeight,
      totalWidth: frameWidth * frameCount
    });
    
    for (let i = 0; i < frameCount; i++) {
      frames.push({
        id: `frame_${i}`,
        url, // Each frame references the SAME sprite sheet URL
        width: frameWidth,
        height: frameHeight,
        sourceX: i * frameWidth, // Horizontal offset for this specific frame
        sourceY: 0 // Always 0 for horizontal sprite sheets
      });
    }
    
    return frames;
  };

  // Parse filename to detect animation type and direction
  const parseFilename = (filename: string): { animationType: string; direction: string } => {
    const lower = filename.toLowerCase();
    
    let animationType = 'idle';
    let direction = 'down';
    
    // Detect animation type
    if (lower.includes('walk')) animationType = 'walk';
    else if (lower.includes('attack') || lower.includes('fight')) animationType = 'attack';
    else if (lower.includes('death') || lower.includes('die') || lower.includes('dead')) animationType = 'death';
    else if (lower.includes('idle')) animationType = 'idle';
    
    // Detect direction
    if (lower.includes('left') || lower.includes('_l_') || lower.includes('_l.')) direction = 'left';
    else if (lower.includes('right') || lower.includes('_r_') || lower.includes('_r.')) direction = 'right';
    else if (lower.includes('up') || lower.includes('_u_') || lower.includes('_u.')) direction = 'up';
    else if (lower.includes('down') || lower.includes('_d_') || lower.includes('_d.')) direction = 'down';
    
    return { animationType, direction };
  };

  // Group files by animation and direction
  const groupFilesByAnimationAndDirection = (files: File[]): Record<string, Record<string, File[]>> => {
    const groups: Record<string, Record<string, File[]>> = {};
    
    for (const file of files) {
      const { animationType, direction } = parseFilename(file.name);
      
      if (!groups[animationType]) {
        groups[animationType] = {};
      }
      if (!groups[animationType][direction]) {
        groups[animationType][direction] = [];
      }
      
      groups[animationType][direction].push(file);
    }
    
    // Sort files within each group by filename (to maintain frame order)
    Object.keys(groups).forEach(animationType => {
      Object.keys(groups[animationType]).forEach(direction => {
        groups[animationType][direction].sort((a, b) => a.name.localeCompare(b.name));
      });
    });
    
    return groups;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please upload image files');
      return;
    }

    const file = imageFiles[0];
    const statusKey = `${selectedAnimation}_${selectedDirection}`;
    setUploadStatus(prev => ({ ...prev, [statusKey]: 'processing' }));
    setIsDetectingSize(true);

    try {
      const { width, height } = await detectImageSize(file);
      const animType = animationTypes.find(a => a.key === selectedAnimation);
      const defaultFrameCount = animType?.defaultFrames[selectedDirection] || 4;
      
      // Calculate frame dimensions (Construct 3 style)
      const frameWidth = Math.floor(width / defaultFrameCount);
      const frameHeight = height;
      
      console.log(`🎯 Processing ${selectedAnimation}_${selectedDirection}:`, {
        originalSize: `${width}×${height}`,
        frameCount: defaultFrameCount,
        frameSize: `${frameWidth}×${frameHeight}`,
        isNewSpriteSheet: true
      });
      
      // Create a UNIQUE URL for this specific direction
      const url = URL.createObjectURL(file);
      const frames = createFramesFromSpriteSheet(url, defaultFrameCount, frameWidth, frameHeight);
      
      // Create or update animation - CRITICAL: Each direction gets its own sprite sheet!
      setAnimations(prev => {
        const newAnimations = { ...prev };
        
        if (!newAnimations[selectedAnimation]) {
          newAnimations[selectedAnimation] = {
            id: selectedAnimation,
            name: selectedAnimation,
            directions: {
              down: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
              left: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
              right: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
              up: { frames: [], frameCount: 0, animationSpeed: 150, loop: true }
            }
          };
        }
        
        // IMPORTANT: Only update the SPECIFIC direction, don't touch others!
        newAnimations[selectedAnimation].directions[selectedDirection] = {
          frames, // This direction gets its OWN frames from its OWN sprite sheet
          frameCount: defaultFrameCount,
          animationSpeed: 150,
          loop: selectedAnimation !== 'death' // Death animation shouldn't loop
        };
        
        console.log(`✅ Updated ${selectedAnimation}.directions.${selectedDirection} with ${defaultFrameCount} frames`);
        
        return newAnimations;
      });

      setUploadStatus(prev => ({ ...prev, [statusKey]: 'success' }));
      
      console.log(`✅ Construct 3 Style: ${selectedAnimation}_${selectedDirection} → ${defaultFrameCount} frames of ${frameWidth}×${frameHeight}px from sprite sheet`);
      
    } catch (error) {
      console.error('Error processing sprite:', error);
      setUploadStatus(prev => ({ ...prev, [statusKey]: 'error' }));
      alert('Could not process sprite sheet. Please try again.');
    } finally {
      setIsDetectingSize(false);
      setTimeout(() => {
        setUploadStatus(prev => ({ ...prev, [statusKey]: undefined }));
      }, 3000);
    }
    
    setPreviewFrame(0);
    setIsAnimating(false);
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleBulkUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) {
      alert('Please upload image files');
      return;
    }

    setIsDetectingSize(true);

    try {
      const newAnimations: Record<string, SpriteAnimation> = { ...animations };
      let processedCount = 0;

      // Group files by animation type and direction
      const fileGroups = groupFilesByAnimationAndDirection(imageFiles);
      
      console.log('🎬 Grouped files:', fileGroups);

      for (const [animationType, directions] of Object.entries(fileGroups)) {
        for (const [direction, directionFiles] of Object.entries(directions)) {
          const statusKey = `${animationType}_${direction}`;
          setUploadStatus(prev => ({ ...prev, [statusKey]: 'processing' }));

          try {
            console.log(`🎯 Processing ${animationType}_${direction} with ${directionFiles.length} individual frames`);

            // Process each individual frame file
            const frameData: { file: File; url: string; width: number; height: number }[] = [];
            
            for (const file of directionFiles) {
              const { width, height } = await detectImageSize(file);
              const url = URL.createObjectURL(file);
              frameData.push({ file, url, width, height });
            }

            // Create frames from individual files (Construct 3 style)
            const frames = createFramesFromIndividualFiles(frameData);
            
            // Create animation if it doesn't exist
            if (!newAnimations[animationType]) {
              newAnimations[animationType] = {
                id: animationType,
                name: animationType,
                directions: {
                  down: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
                  left: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
                  right: { frames: [], frameCount: 0, animationSpeed: 150, loop: true },
                  up: { frames: [], frameCount: 0, animationSpeed: 150, loop: true }
                }
              };
            }
            
            // CRITICAL: Update ONLY the specific direction with its OWN individual frame files
            newAnimations[animationType].directions[direction as keyof SpriteAnimation['directions']] = {
              frames, // Each frame is from a separate file
              frameCount: frames.length,
              animationSpeed: 150,
              loop: animationType !== 'death'
            };
            
            setUploadStatus(prev => ({ ...prev, [statusKey]: 'success' }));
            processedCount++;
            
            console.log(`✅ ${animationType}_${direction}: ${frames.length} individual frames processed`);
            
          } catch (error) {
            console.error(`❌ Error processing ${animationType}_${direction}:`, error);
            setUploadStatus(prev => ({ ...prev, [statusKey]: 'error' }));
          }
        }
      }

      setAnimations(newAnimations);
      setBulkUploadMode(false);
      
      // Show detailed success message
      const animationSummary = Object.entries(newAnimations).map(([key, anim]) => {
        const directionCounts = Object.entries(anim.directions)
          .filter(([_, dir]) => dir.frames.length > 0)
          .map(([dirKey, dir]) => `${dirKey}:${dir.frameCount}`)
          .join(', ');
        return `${key}(${directionCounts})`;
      }).join('\n');
      
      alert(`Successfully processed ${processedCount} animation directions!\n\n🎬 Construct 3 Style Results:\n${animationSummary}\n\nEach frame is now an individual file!`);
      
      setTimeout(() => {
        setUploadStatus({});
      }, 5000);
      
    } catch (error) {
      console.error('Error in bulk upload:', error);
      alert('Error processing some files. Please try again.');
    } finally {
      setIsDetectingSize(false);
    }
    
    if (event.target) {
      event.target.value = '';
    }
  };

  const startPreviewAnimation = () => {
    const currentAnimation = animations[selectedAnimation];
    const currentDirection = currentAnimation?.directions[selectedDirection];
    
    if (!currentDirection || currentDirection.frames.length === 0) return;
    
    if (isAnimating) {
      stopPreviewAnimation();
      return;
    }

    setIsAnimating(true);
    let frame = 0;
    
    const animate = () => {
      setPreviewFrame(frame);
      frame = (frame + 1) % currentDirection.frameCount;
      animationRef.current = setTimeout(animate, currentDirection.animationSpeed);
    };
    
    animate();
  };

  const stopPreviewAnimation = () => {
    setIsAnimating(false);
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const nextFrame = () => {
    const currentAnimation = animations[selectedAnimation];
    const currentDirection = currentAnimation?.directions[selectedDirection];
    if (!currentDirection) return;
    
    setPreviewFrame(prev => (prev + 1) % currentDirection.frameCount);
  };

  const prevFrame = () => {
    const currentAnimation = animations[selectedAnimation];
    const currentDirection = currentAnimation?.directions[selectedDirection];
    if (!currentDirection) return;
    
    setPreviewFrame(prev => (prev - 1 + currentDirection.frameCount) % currentDirection.frameCount);
  };

  const goToFrame = (frameIndex: number) => {
    setPreviewFrame(frameIndex);
    setIsAnimating(false);
  };

  const removeAnimation = (animationType: string, direction: string) => {
    setAnimations(prev => {
      const newAnimations = { ...prev };
      if (newAnimations[animationType]) {
        const directionData = newAnimations[animationType].directions[direction as keyof SpriteAnimation['directions']];
        if (directionData.frames.length > 0) {
          // Clean up URLs for this specific direction only
          directionData.frames.forEach(frame => {
            if (frame.url.startsWith('blob:')) {
              URL.revokeObjectURL(frame.url);
            }
          });
          
          // Reset only this direction, leave others untouched
          newAnimations[animationType].directions[direction as keyof SpriteAnimation['directions']] = {
            frames: [],
            frameCount: 0,
            animationSpeed: 150,
            loop: true
          };
          
          console.log(`🗑️ Removed ${animationType}_${direction}, other directions preserved`);
        }
      }
      return newAnimations;
    });
    setPreviewFrame(0);
    setIsAnimating(false);
  };

  const saveSprites = () => {
    console.log('🎯 Saving Construct 3-style animations:', Object.keys(animations));
    Object.entries(animations).forEach(([key, animation]) => {
      console.log(`  ${key}:`);
      Object.entries(animation.directions).forEach(([dir, dirData]) => {
        if (dirData.frames.length > 0) {
          console.log(`    ${dir}: ${dirData.frameCount} individual frames`);
          console.log(`      Frame URLs: ${dirData.frames.map(f => f.url.substring(0, 30)).join(', ')}...`);
        }
      });
    });
    onSpritesUpdate(animations);
    onClose();
  };

  const exportSprites = () => {
    const exportData = Object.entries(animations).reduce((acc, [key, animation]) => {
      acc[key] = {
        name: animation.name,
        directions: Object.entries(animation.directions).reduce((dirAcc, [dirKey, dirData]) => {
          if (dirData.frames.length > 0) {
            dirAcc[dirKey] = {
              frameCount: dirData.frameCount,
              animationSpeed: dirData.animationSpeed,
              loop: dirData.loop
            };
          }
          return dirAcc;
        }, {} as any)
      };
      return acc;
    }, {} as any);

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'construct3-animations.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderFrameGrid = () => {
    const currentAnimation = animations[selectedAnimation];
    const currentDirection = currentAnimation?.directions[selectedDirection];
    
    if (!currentDirection || currentDirection.frames.length === 0) {
      return <div className="text-gray-400 text-center py-4">No frames available</div>;
    }

    const frames = [];
    for (let i = 0; i < currentDirection.frameCount; i++) {
      const frame = currentDirection.frames[i];
      frames.push(
        <div
          key={i}
          className={`
            relative cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-200
            ${i === previewFrame ? 'border-blue-500 shadow-lg scale-110' : 'border-gray-300 hover:border-blue-300'}
          `}
          onClick={() => goToFrame(i)}
          style={{ width: '60px', height: '60px' }}
        >
          <div
            className="w-full h-full bg-gray-100"
            style={{
              backgroundImage: `url(${frame.url})`,
              backgroundPosition: `-${frame.sourceX}px -${frame.sourceY}px`,
              backgroundRepeat: 'no-repeat',
              imageRendering: 'pixelated',
              transform: `scale(${Math.min(60 / frame.width, 60 / frame.height)})`
            }}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs text-center py-1">
            {i}
          </div>
        </div>
      );
    }
    return frames;
  };

  const getStatusIcon = (animationType: string, direction: string) => {
    const statusKey = `${animationType}_${direction}`;
    const status = uploadStatus[statusKey];
    
    if (status === 'processing') {
      return <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>;
    }
    if (status === 'success') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (status === 'error') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    
    const animation = animations[animationType];
    if (animation?.directions[direction as keyof SpriteAnimation['directions']]?.frames.length > 0) {
      return <div className="w-3 h-3 bg-green-500 rounded-full"></div>;
    }
    
    return null;
  };

  if (!isOpen) return null;

  const currentAnimation = animations[selectedAnimation];
  const currentDirection = currentAnimation?.directions[selectedDirection];
  const currentFrame = currentDirection?.frames[previewFrame];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">🎬 Construct 3 Animation System</h2>
              <p className="text-purple-100">Individual frames OR sprite sheets per direction</p>
            </div>
            <div className="flex items-center space-x-3">
              {isDetectingSize && (
                <div className="flex items-center space-x-2 px-3 py-2 bg-yellow-500 bg-opacity-20 rounded-lg">
                  <Zap className="w-4 h-4 animate-pulse" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
              <button
                onClick={() => setBulkUploadMode(!bulkUploadMode)}
                className={`
                  flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${bulkUploadMode 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-white bg-opacity-20 hover:bg-opacity-30'
                  }
                `}
              >
                <FolderOpen size={20} />
                <span>{bulkUploadMode ? 'Single Mode' : 'Bulk Mode'}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Left Panel - Animation & Direction Selection */}
          <div className="w-1/3 bg-gray-50 p-6 border-r overflow-y-auto">
            {/* Animation Types */}
            <h3 className="text-lg font-semibold mb-4">Animation Types</h3>
            <div className="space-y-2 mb-6">
              {animationTypes.map(({ key, label, description }) => (
                <div
                  key={key}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border-2
                    ${selectedAnimation === key 
                      ? 'bg-blue-100 border-blue-500 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm'
                    }
                  `}
                  onClick={() => setSelectedAnimation(key)}
                >
                  <div className="font-medium text-gray-800">{label}</div>
                  <div className="text-sm text-gray-600">{description}</div>
                </div>
              ))}
            </div>

            {/* Directions */}
            <h3 className="text-lg font-semibold mb-4">Directions (Individual Sprites)</h3>
            <div className="grid grid-cols-2 gap-2 mb-6">
              {directions.map(({ key, label, icon: Icon, construct3Index }) => (
                <div
                  key={key}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 text-center
                    ${selectedDirection === key 
                      ? 'bg-green-100 border-green-500 shadow-md' 
                      : 'bg-white border-gray-200 hover:border-green-300 hover:shadow-sm'
                    }
                  `}
                  onClick={() => setSelectedDirection(key)}
                >
                  <Icon className="w-6 h-6 mx-auto mb-1" />
                  <div className="font-medium text-sm">{label}</div>
                  <div className="text-xs text-gray-500">Dir {construct3Index}</div>
                  <div className="mt-1">
                    {getStatusIcon(selectedAnimation, key)}
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Section */}
            <div className="space-y-3">
              {bulkUploadMode ? (
                <div className="space-y-3">
                  <button
                    onClick={() => bulkFileInputRef.current?.click()}
                    disabled={isDetectingSize}
                    className={`
                      w-full flex items-center justify-center space-x-2 p-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl
                      ${isDetectingSize 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                      }
                    `}
                  >
                    <FolderOpen size={20} />
                    <span>Upload Individual Frames</span>
                  </button>
                  <input
                    ref={bulkFileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleBulkUpload}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-600 p-3 bg-green-50 rounded-lg">
                    <strong>🎬 Individual Frame Mode:</strong>
                    <div className="mt-1 space-y-1">
                      <div>• Upload 000.png, 001.png, 002.png...</div>
                      <div>• Each file = one animation frame</div>
                      <div>• Auto-groups by filename pattern</div>
                      <div>• Perfect for your 7-frame setup!</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isDetectingSize}
                    className={`
                      w-full flex items-center justify-center space-x-2 p-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl
                      ${isDetectingSize 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                      }
                    `}
                  >
                    <Upload size={20} />
                    <span>Upload {selectedAnimation} {selectedDirection}</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="text-xs text-gray-600 p-3 bg-blue-50 rounded-lg">
                    <strong>🎬 Sprite Sheet Mode:</strong>
                    <div className="mt-1 space-y-1">
                      <div>• Upload horizontal sprite sheet</div>
                      <div>• Frames arranged side-by-side</div>
                      <div>• Auto-slices into individual frames</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Progress */}
            <div className="mt-6 p-3 bg-gray-100 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-2">Animation Progress</div>
              {animationTypes.map(({ key, label }) => {
                const animation = animations[key];
                const completedDirections = animation ? 
                  Object.values(animation.directions).filter(dir => dir.frames.length > 0).length : 0;
                
                return (
                  <div key={key} className="flex justify-between text-xs mb-1">
                    <span>{label}:</span>
                    <span className={completedDirections === 4 ? 'text-green-600 font-medium' : 'text-gray-500'}>
                      {completedDirections}/4 directions
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel - Preview and Controls */}
          <div className="flex-1 p-6 overflow-y-auto">
            {currentDirection && currentDirection.frames.length > 0 ? (
              <div className="space-y-6">
                {/* Current Selection Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-blue-800">
                        {selectedAnimation.toUpperCase()} - {selectedDirection.toUpperCase()}
                      </div>
                      <div className="text-sm text-blue-600">
                        🎬 {currentDirection.frameCount} individual frames
                      </div>
                      <div className="text-xs text-blue-500 mt-1">
                        Frame type: {currentDirection.frames[0]?.sourceX === 0 ? 'Individual files' : 'Sprite sheet slices'}
                      </div>
                    </div>
                    <button
                      onClick={() => removeAnimation(selectedAnimation, selectedDirection)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
                    >
                      <X size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>

                {/* Preview Section */}
                <div className="bg-gray-900 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">
                      🎬 Animation Preview
                    </h3>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowFrameGrid(!showFrameGrid)}
                        className={`
                          flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                          ${showFrameGrid 
                            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                            : 'bg-gray-600 hover:bg-gray-700 text-white'
                          }
                        `}
                      >
                        <Grid size={16} />
                        <span>Frame Grid</span>
                      </button>
                      <button
                        onClick={startPreviewAnimation}
                        className={`
                          flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors
                          ${isAnimating 
                            ? 'bg-red-600 hover:bg-red-700 text-white' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                          }
                        `}
                      >
                        {isAnimating ? <Pause size={16} /> : <Play size={16} />}
                        <span>{isAnimating ? 'Pause' : 'Play'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Main Preview */}
                  <div className="flex justify-center mb-4">
                    <div 
                      className="relative bg-white rounded-lg p-4 shadow-inner"
                      style={{ 
                        width: Math.max((currentFrame?.width || 64) + 32, 128),
                        height: Math.max((currentFrame?.height || 64) + 32, 128)
                      }}
                    >
                      {currentFrame && (
                        <div
                          className="bg-gray-200 border-2 border-dashed border-gray-400 overflow-hidden mx-auto"
                          style={{
                            width: currentFrame.width,
                            height: currentFrame.height,
                            backgroundImage: `url(${currentFrame.url})`,
                            backgroundPosition: `-${currentFrame.sourceX}px -${currentFrame.sourceY}px`,
                            backgroundRepeat: 'no-repeat',
                            imageRendering: 'pixelated'
                          }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Frame Controls */}
                  <div className="flex items-center justify-center space-x-4 mb-4">
                    <button
                      onClick={prevFrame}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      title="Previous Frame"
                    >
                      <SkipBack size={16} />
                    </button>
                    <div className="text-center text-gray-300">
                      <div className="text-lg font-bold">
                        Frame {previewFrame} / {currentDirection.frameCount - 1}
                      </div>
                      <div className="text-sm opacity-75">
                        {currentFrame?.width}×{currentFrame?.height}px • {currentDirection.animationSpeed}ms
                      </div>
                      <div className="text-xs text-green-400 mt-1">
                        🎬 {currentDirection.frames[0]?.sourceX === 0 ? 'Individual Files' : 'Sprite Sheet'}
                      </div>
                    </div>
                    <button
                      onClick={nextFrame}
                      className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                      title="Next Frame"
                    >
                      <SkipForward size={16} />
                    </button>
                  </div>

                  {/* Frame Grid */}
                  {showFrameGrid && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="text-white font-medium mb-3">
                        🎬 Frame Grid ({currentDirection.frameCount} frames)
                      </h4>
                      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto">
                        {renderFrameGrid()}
                      </div>
                      <div className="text-xs text-gray-400 mt-2">
                        Click any frame to jump to it • Each frame from {currentDirection.frames[0]?.sourceX === 0 ? 'individual file' : 'sprite sheet slice'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <Eye size={64} className="mb-4 opacity-50" />
                <h3 className="text-xl font-medium mb-2">
                  No {selectedAnimation} animation for {selectedDirection} direction
                </h3>
                <p className="text-center mb-4">
                  Upload individual frame files (000.png, 001.png...) or a horizontal sprite sheet.
                </p>
                <div className="text-sm text-gray-400 text-center space-y-2">
                  <p>🎬 <strong>Individual Frames:</strong> Perfect for your 7-frame setup</p>
                  <p>📐 <strong>Sprite Sheets:</strong> Horizontal layout, auto-sliced</p>
                  <p>🔄 <strong>Construct 3 Style:</strong> Each direction independent</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={exportSprites}
              className="flex items-center space-x-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              <Download size={16} />
              <span>Export Config</span>
            </button>
            <div className="text-sm text-gray-500">
              <span className="font-medium">{Object.keys(animations).length}</span> animations configured
              {Object.keys(animations).length > 0 && (
                <span className="ml-2">
                  • <span className="font-medium">
                    {Object.values(animations).reduce((sum, anim) => 
                      sum + Object.values(anim.directions).reduce((dirSum, dir) => dirSum + dir.frameCount, 0), 0
                    )}
                  </span> total frames
                </span>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-md font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveSprites}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
            >
              Apply Animations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};