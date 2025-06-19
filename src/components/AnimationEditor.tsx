import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Plus, 
  Grid, 
  Image, 
  X, 
  Edit, 
  Folder, 
  FolderPlus, 
  ChevronDown, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  RotateCcw 
} from 'lucide-react';
import { saveSprite, initializeStorage } from '../utils/storageHelpers';
import { signInAnonymously } from '../lib/supabase';
import { SpriteAnimation, AnimationFolder } from '../types/game';

interface AnimationEditorProps {
  isOpen: boolean;
  onClose: () => void;
  spriteName: string;
  onSpriteNameChange: (name: string) => void;
  animations: SpriteAnimation[];
  onAnimationsUpdate: (animations: SpriteAnimation[]) => void;
}

interface ImageToolsState {
  showGrid: boolean;
  zoom: number;
  flipHorizontal: boolean;
  flipVertical: boolean;
  imageSize: {
    width: number;
    height: number;
  };
}

export const AnimationEditor: React.FC<AnimationEditorProps> = ({
  isOpen,
  onClose,
  spriteName,
  onSpriteNameChange,
  animations = [],
  onAnimationsUpdate,
}) => {
  const [selectedAnimationIndex, setSelectedAnimationIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isReversed, setIsReversed] = useState(false);
  const [isRevertMode, setIsRevertMode] = useState(false);
  const [editingAnimationName, setEditingAnimationName] = useState<number | null>(null);
  const [folders, setFolders] = useState<AnimationFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [draggedAnimationIndex, setDraggedAnimationIndex] = useState<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);
  const animationRef = useRef<number>();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [spritesheetSettings, setSpritesheetSettings] = useState({
    file: null as File | null,
    previewUrl: '',
    cols: 1,
    rows: 1,
    direction: 'horizontal' as 'horizontal' | 'vertical'
  });
  const [imageTools, setImageTools] = useState<ImageToolsState>({
    showGrid: true,
    zoom: 8,
    flipHorizontal: false,
    flipVertical: false,
    imageSize: {
      width: 64,
      height: 64
    }
  });

  // Calculate animations in folders once for the entire component
  const animationsInFolders = folders.flatMap(f => f.animations);
  const unorganizedAnimationsCount = animations.length - animationsInFolders.length;

  const selectedAnimation = animations[selectedAnimationIndex];

  // Initialize storage and sign in when component mounts
  useEffect(() => {
    const init = async () => {
      try {
        // Sign in anonymously to get storage access
        await signInAnonymously();
        // Initialize storage after signing in
        await initializeStorage();
      } catch (error) {
        console.error('Error initializing:', error);
        // Don't throw the error, just log it and continue
        // The user will need to set up their .env file with Supabase credentials
      }
    };
    
    init();
  }, []);

  useEffect(() => {
    if ((isPlaying || showPreviewModal) && selectedAnimation?.frames.length) {
      const speed = selectedAnimation.settings.speed || 5;
      const frameTime = 1000 / speed;

      const animate = (timestamp: number) => {
        if (!lastFrameTimeRef.current) {
          lastFrameTimeRef.current = timestamp;
        }

        const elapsed = timestamp - lastFrameTimeRef.current;

        if (elapsed >= frameTime) {
          setCurrentFrame(prev => {
            let nextFrame = prev;
            
            // Use the reverse setting from animation settings
            const shouldMoveBackward = selectedAnimation.settings.reverse ? !isReversed : isReversed;
            
            if (shouldMoveBackward) {
              nextFrame = prev - 1;
            } else {
              nextFrame = prev + 1;
            }

            // Handle ping-pong
            if (selectedAnimation.settings.pingPong) {
              if (isReversed && nextFrame < 0) {
                setIsReversed(false);
                return 1; // Start moving forward from second frame
              } else if (!isReversed && nextFrame >= selectedAnimation.frames.length) {
                setIsReversed(true);
                return selectedAnimation.frames.length - 2; // Start moving backward from second-to-last frame
              }
            }
            // Handle normal looping - Fixed loop logic
            else if (selectedAnimation.settings.loop) {
              if (nextFrame >= selectedAnimation.frames.length) {
                return 0;
              } else if (nextFrame < 0) {
                return selectedAnimation.frames.length - 1;
              }
            }
            // No looping - Fixed non-loop logic
            else {
              if (nextFrame >= selectedAnimation.frames.length || nextFrame < 0) {
                setIsPlaying(false);
                setCurrentFrame(0); // Reset to first frame when animation ends
                return 0;
              }
            }

            return nextFrame;
          });

          lastFrameTimeRef.current = timestamp;
        }

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        lastFrameTimeRef.current = 0;
      };
    }
  }, [isPlaying, showPreviewModal, selectedAnimation, isReversed]);

  // Reset animation state when changing animations
  useEffect(() => {
    setCurrentFrame(0);
    setIsReversed(false);
    setIsRevertMode(false);
    setIsPlaying(false);
    lastFrameTimeRef.current = 0;
  }, [selectedAnimationIndex]);

  const handleAddAnimation = () => {
    const newAnimation: SpriteAnimation = {
      name: `Animation ${animations.length + 1}`,
      frames: [],
      settings: {
        speed: 12,
        loop: true,
        pingPong: false,
        reverse: false
      }
    };
    onAnimationsUpdate([...animations, newAnimation]);
    setSelectedAnimationIndex(animations.length);
  };

  const handleDeleteAnimation = (index: number) => {
    // First remove the animation from any folders
    const updatedFolders = folders.map(folder => ({
      ...folder,
      // Update the animation indices in each folder
      animations: folder.animations
        .filter(animIndex => animIndex !== index)
        .map(animIndex => animIndex > index ? animIndex - 1 : animIndex)
    }));
    
    // Then remove the animation from the main list
    const newAnimations = animations.filter((_, i) => i !== index);
    onAnimationsUpdate(newAnimations);
    
    // Update folders with the new indices
    setFolders(updatedFolders);
    
    // Reset selection if the deleted animation was selected
    if (selectedAnimationIndex === index) {
      setSelectedAnimationIndex(-1);
    } else if (selectedAnimationIndex > index) {
      // Adjust selected animation index if it was after the deleted one
      setSelectedAnimationIndex(selectedAnimationIndex - 1);
    }
  };

  const handleDuplicateAnimation = (index: number) => {
    const animationToDuplicate = animations[index];
    const duplicatedAnimation: SpriteAnimation = {
      name: `${animationToDuplicate.name} (Copy)`,
      frames: [...animationToDuplicate.frames],
      settings: { ...animationToDuplicate.settings }
    };
    const updatedAnimations = [...animations];
    updatedAnimations.splice(index + 1, 0, duplicatedAnimation);
    onAnimationsUpdate(updatedAnimations);
  };

  const handleFrameUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || selectedAnimationIndex === -1) return;

    const newFrames = [...(selectedAnimation?.frames || [])];
    for (const file of Array.from(e.target.files)) {
      const reader = new FileReader();
      await new Promise<void>((resolve) => {
        reader.onload = (e) => {
          if (e.target?.result) {
            newFrames.push(e.target.result as string);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    const updatedAnimations = animations.map((anim, index) =>
      index === selectedAnimationIndex
        ? { ...anim, frames: newFrames }
        : anim
    );
    onAnimationsUpdate(updatedAnimations);
    setShowUploadModal(false);
  };

  const handleSpritesheetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setSpritesheetSettings(prev => ({
      ...prev,
      file,
      previewUrl: url
    }));
  };

  const sliceSpritesheet = async () => {
    if (!spritesheetSettings.file || !spritesheetSettings.previewUrl || selectedAnimationIndex === -1) return;

    try {
      // Create a new image element
      const img = document.createElement('img');
      img.src = spritesheetSettings.previewUrl;
      
      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = (e) => reject(new Error('Failed to load image'));
      });

      // Create canvas and get context
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Calculate frame dimensions
      const frameWidth = Math.floor(img.width / spritesheetSettings.cols);
      const frameHeight = Math.floor(img.height / spritesheetSettings.rows);
      
      // Set canvas size to frame size
      canvas.width = frameWidth;
      canvas.height = frameHeight;

      const frames: string[] = [];

      // Slice frames based on direction
      const totalRows = spritesheetSettings.rows;
      const totalCols = spritesheetSettings.cols;

      if (spritesheetSettings.direction === 'horizontal') {
        // Read left to right, top to bottom
        for (let row = 0; row < totalRows; row++) {
          for (let col = 0; col < totalCols; col++) {
            // Clear previous frame
            ctx.clearRect(0, 0, frameWidth, frameHeight);
            
            // Draw current frame
            ctx.drawImage(
              img,
              col * frameWidth,
              row * frameHeight,
              frameWidth,
              frameHeight,
              0,
              0,
              frameWidth,
              frameHeight
            );

            // Convert to data URL and add to frames
            const frameDataUrl = canvas.toDataURL('image/png');
            frames.push(frameDataUrl);
          }
        }
      } else {
        // Read top to bottom, left to right
        for (let col = 0; col < totalCols; col++) {
          for (let row = 0; row < totalRows; row++) {
            // Clear previous frame
            ctx.clearRect(0, 0, frameWidth, frameHeight);
            
            // Draw current frame
            ctx.drawImage(
              img,
              col * frameWidth,
              row * frameHeight,
              frameWidth,
              frameHeight,
              0,
              0,
              frameWidth,
              frameHeight
            );

            // Convert to data URL and add to frames
            const frameDataUrl = canvas.toDataURL('image/png');
            frames.push(frameDataUrl);
          }
        }
      }

      // Update animations with new frames
      const updatedAnimations = animations.map((anim, index) =>
        index === selectedAnimationIndex
          ? { ...anim, frames: [...anim.frames, ...frames] }
          : anim
      );

      onAnimationsUpdate(updatedAnimations);
      
      // Reset spritesheet settings and close modal
      setSpritesheetSettings({
        file: null,
        previewUrl: '',
        cols: 1,
        rows: 1,
        direction: 'horizontal'
      });
      setShowUploadModal(false);

    } catch (error) {
      console.error('Error slicing spritesheet:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleAddFolder = () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: AnimationFolder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
      animations: [],
      isOpen: true
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const handleMoveToFolder = (animationIndex: number, folderId: string) => {
    // Remove animation from other folders if it exists
    const updatedFolders = folders.map(folder => ({
      ...folder,
      animations: folder.animations.filter(anim => anim !== animationIndex)
    }));

    // Add animation to selected folder
    const folderIndex = updatedFolders.findIndex(f => f.id === folderId);
    if (folderIndex !== -1) {
      updatedFolders[folderIndex].animations.push(animationIndex);
    }

    setFolders(updatedFolders);
  };

  const toggleFolder = (folderId: string) => {
    setFolders(prevFolders => 
      prevFolders.map(folder => 
        folder.id === folderId 
          ? { ...folder, isOpen: !folder.isOpen }
          : folder
      )
    );
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    setDraggedAnimationIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    const animationIndex = parseInt(e.dataTransfer.getData('text/plain'));
    handleMoveToFolder(animationIndex, folderId);
    setDraggedAnimationIndex(null);
  };

  const getAnimationsForCurrentView = () => {
    if (!selectedFolder) {
      // Show ONLY animations that are not in any folder
      return animations
        .map((anim, index) => ({
          animation: anim,
          index
        }))
        .filter(({index}) => !animationsInFolders.includes(index));
    }

    // Show ONLY animations in the selected folder
    const folder = folders.find(f => f.id === selectedFolder);
    return folder?.animations
      .filter(index => index < animations.length) // Only show valid indices
      .map(index => ({
        animation: animations[index],
        index
      })) || [];
  };

  const handleAddAnimationToFolder = (folderId: string) => {
    const newAnimation = {
      name: `Animation ${animations.length + 1}`,
      frames: [],
      settings: {
        speed: 5,
        loop: true,
        pingPong: false,
        reverse: false,
      }
    };
    
    // Add the animation to the animations array
    const newAnimations = [...animations, newAnimation];
    onAnimationsUpdate(newAnimations);
    
    // Add the new animation's index to the folder
    const newAnimationIndex = newAnimations.length - 1;
    setFolders(prevFolders =>
      prevFolders.map(folder =>
        folder.id === folderId
          ? { ...folder, animations: [...folder.animations, newAnimationIndex] }
          : folder
      )
    );
    
    // Select the new animation and its folder
    setSelectedAnimationIndex(newAnimationIndex);
    setSelectedFolder(folderId);
  };

  const handleRenameAnimation = (index: number, newName: string) => {
    const updatedAnimations = [...animations];
    updatedAnimations[index] = {
      ...updatedAnimations[index],
      name: newName
    };
    onAnimationsUpdate(updatedAnimations);
    setEditingAnimationName(null);
  };

  // Function to handle image resizing
  const handleResize = (newSize: { width: number; height: number }) => {
    setImageTools(prev => ({
      ...prev,
      imageSize: newSize
    }));
  };

  // Function to handle zoom with more granular control
  const handleZoom = (delta: number) => {
    setImageTools(prev => ({
      ...prev,
      zoom: Math.max(0.25, Math.min(32, prev.zoom + delta)) // Allow up to 3200% zoom
    }));
  };

  // Function to handle direct zoom level setting
  const handleZoomLevel = (level: number) => {
    setImageTools(prev => ({
      ...prev,
      zoom: Math.max(0.25, Math.min(32, level))
    }));
  };

  // Function to handle mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.5 : 0.5;
      handleZoom(delta);
    }
  };

  // Function to handle flipping
  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    setImageTools(prev => ({
      ...prev,
      flipHorizontal: direction === 'horizontal' ? !prev.flipHorizontal : prev.flipHorizontal,
      flipVertical: direction === 'vertical' ? !prev.flipVertical : prev.flipVertical
    }));
  };

  const renderAnimationItem = ({animation, index}: {animation: SpriteAnimation, index: number}) => (
    <div
      key={index}
      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
        selectedAnimationIndex === index ? 'bg-blue-500' : 'hover:bg-[#444444]'
      }`}
      onClick={() => setSelectedAnimationIndex(index)}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', ''); // Required for Firefox
        setDraggedAnimationIndex(index);
      }}
      onDragEnd={() => setDraggedAnimationIndex(null)}
    >
      <div className="flex items-center flex-1 min-w-0">
        <Play className="w-4 h-4 mr-2 text-white" />
        {editingAnimationName === index ? (
          <input
            type="text"
            className="bg-[#444444] text-white px-2 py-1 rounded w-full"
            defaultValue={animation.name}
            autoFocus
            onBlur={(e) => handleRenameAnimation(index, e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleRenameAnimation(index, e.currentTarget.value);
              } else if (e.key === 'Escape') {
                setEditingAnimationName(null);
              }
            }}
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div className="flex items-center justify-between flex-1">
            <span className="text-white truncate">{animation.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingAnimationName(index);
              }}
              className="p-1 hover:bg-[#555555] rounded text-gray-400 hover:text-white ml-2"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-[#2D2D2D] rounded-lg shadow-2xl w-[1200px] h-[800px] flex flex-col">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 border-b border-[#555555]">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 hover:bg-[#444444] rounded transition-colors text-white"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <input
              type="text"
              value={spriteName}
              onChange={(e) => onSpriteNameChange(e.target.value)}
              className="bg-[#444444] text-white px-3 py-1 rounded"
              placeholder="Sprite Name"
            />
          </div>

          {/* Image Tools */}
          <div className="flex items-center space-x-4">
            {/* Grid Toggle */}
            <button
              onClick={() => setImageTools(prev => ({ ...prev, showGrid: !prev.showGrid }))}
              className={`p-2 rounded transition-colors ${
                imageTools.showGrid ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-[#444444]'
              }`}
              title="Toggle Grid"
            >
              <Grid className="w-5 h-5" />
            </button>

            {/* Enhanced Zoom Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleZoom(-1)}
                className="p-2 hover:bg-[#444444] rounded transition-colors text-white"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              
              <div className="relative inline-block">
                <select
                  value={imageTools.zoom}
                  onChange={(e) => handleZoomLevel(Number(e.target.value))}
                  className="bg-[#444444] text-white px-2 py-1 rounded w-24 appearance-none cursor-pointer"
                >
                  <option value="0.25">25%</option>
                  <option value="0.5">50%</option>
                  <option value="1">100%</option>
                  <option value="2">200%</option>
                  <option value="4">400%</option>
                  <option value="8">800%</option>
                  <option value="16">1600%</option>
                  <option value="24">2400%</option>
                  <option value="32">3200%</option>
                </select>
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <ChevronDown className="w-4 h-4 text-white" />
                </div>
              </div>

              <button
                onClick={() => handleZoom(1)}
                className="p-2 hover:bg-[#444444] rounded transition-colors text-white"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Flip Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleFlip('horizontal')}
                className={`p-2 rounded transition-colors ${
                  imageTools.flipHorizontal ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-[#444444]'
                }`}
                title="Flip Horizontal"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleFlip('vertical')}
                className={`p-2 rounded transition-colors ${
                  imageTools.flipVertical ? 'bg-blue-500 text-white' : 'text-gray-400 hover:bg-[#444444]'
                }`}
                title="Flip Vertical"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>

            {/* Size Controls */}
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={imageTools.imageSize.width}
                onChange={(e) => handleResize({ ...imageTools.imageSize, width: Number(e.target.value) })}
                className="bg-[#444444] text-white px-2 py-1 rounded w-16"
                min="1"
                max="512"
              />
              <span className="text-white">×</span>
              <input
                type="number"
                value={imageTools.imageSize.height}
                onChange={(e) => handleResize({ ...imageTools.imageSize, height: Number(e.target.value) })}
                className="bg-[#444444] text-white px-2 py-1 rounded w-16"
                min="1"
                max="512"
              />
            </div>

            <button
              onClick={() => {/* TODO: Save sprite */}}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Save Sprite
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-64 bg-[#333333] p-4 border-r border-[#555555] flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-medium">Folders</h3>
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="p-2 hover:bg-[#444444] rounded transition-colors text-white"
                title="Create New Folder"
              >
                <FolderPlus className="w-4 h-4" />
              </button>
            </div>

            {/* Folder List */}
            <div className="space-y-2 mb-4">
              <div
                className={`flex items-center p-2 rounded cursor-pointer ${
                  !selectedFolder ? 'bg-blue-500' : 'hover:bg-[#444444]'
                }`}
                onClick={() => setSelectedFolder(null)}
                onDragOver={handleDragOver}
                onDrop={(e) => {
                  e.preventDefault();
                  if (draggedAnimationIndex !== null) {
                    // Remove from all folders
                    setFolders(prevFolders =>
                      prevFolders.map(folder => ({
                        ...folder,
                        animations: folder.animations.filter(anim => anim !== draggedAnimationIndex)
                      }))
                    );
                  }
                  setDraggedAnimationIndex(null);
                }}
              >
                <Folder className="w-4 h-4 mr-2 text-white" />
                <span className="text-white">All Animations</span>
                <span className="ml-2 text-gray-400 text-sm">
                  ({unorganizedAnimationsCount})
                </span>
              </div>
              {folders.map(folder => (
                <div
                  key={folder.id}
                  className="space-y-1"
                >
                  <div
                    className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                      selectedFolder === folder.id ? 'bg-blue-500' : 'hover:bg-[#444444]'
                    }`}
                    onClick={() => setSelectedFolder(folder.id)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, folder.id)}
                  >
                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolder(folder.id);
                        }}
                        className="p-1 hover:bg-[#555555] rounded"
                      >
                        {folder.isOpen ? (
                          <ChevronDown className="w-4 h-4 text-white" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-white" />
                        )}
                      </button>
                      <Folder className="w-4 h-4 mr-2 text-white" />
                      <span className="text-white">{folder.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-400 text-sm">{folder.animations.length}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddAnimationToFolder(folder.id);
                        }}
                        className="p-1 hover:bg-[#555555] rounded text-gray-400 hover:text-white"
                        title="Add Animation to Folder"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Animations in folder */}
                  {folder.isOpen && folder.animations.map(animIndex => 
                    renderAnimationItem({
                      animation: animations[animIndex],
                      index: animIndex
                    })
                  )}
                </div>
              ))}
            </div>

            {/* Animations section - Only show if we're in All Animations view */}
            {!selectedFolder && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-medium">Animations</h3>
                  <button
                    onClick={handleAddAnimation}
                    className="p-2 hover:bg-[#444444] rounded transition-colors text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 flex-1 overflow-y-auto">
                  {getAnimationsForCurrentView().map(({animation, index}) => 
                    renderAnimationItem({animation, index})
                  )}
                </div>
              </>
            )}
          </div>

          {/* Main Preview Area with wheel zoom support */}
          <div 
            className="flex-1 p-4 relative"
            onWheel={handleWheel}
          >
            <div 
              className="w-full h-full flex items-center justify-center overflow-auto"
              style={{
                background: imageTools.showGrid 
                  ? `url("data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='0' y='0' width='8' height='8' fill='%23333333'/%3E%3Crect x='8' y='8' width='8' height='8' fill='%23333333'/%3E%3C/svg%3E")`
                  : '#333333'
              }}
            >
              {selectedAnimation && (
                <div 
                  style={{
                    transform: `scale(${imageTools.zoom}) 
                              scaleX(${imageTools.flipHorizontal ? -1 : 1}) 
                              scaleY(${imageTools.flipVertical ? -1 : 1})`,
                    width: imageTools.imageSize.width,
                    height: imageTools.imageSize.height,
                    transformOrigin: 'center',
                    transition: 'transform 0.1s ease-out'
                  }}
                  className="relative"
                >
                  <img
                    src={selectedAnimation.frames[currentFrame]}
                    alt={`Frame ${currentFrame}`}
                    className="pixelated"
                    style={{
                      width: '100%',
                      height: '100%',
                      imageRendering: 'pixelated'
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar - Frame Controls */}
          <div className="w-64 bg-[#333333] p-4 border-l border-[#555555]">
            {/* ... existing frame controls ... */}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && selectedAnimation && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-[70]">
          <button
            onClick={() => {
              setShowPreviewModal(false);
              setIsPlaying(false);
              setIsReversed(false);
              setIsRevertMode(false);
              lastFrameTimeRef.current = 0;
            }}
            className="absolute top-8 right-8 p-3 text-white hover:bg-[#444444] rounded-full bg-[#2D2D2D] transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div className="bg-[#2D2D2D] rounded-xl shadow-2xl relative max-w-[95vw] max-h-[95vh] p-8">
            <div className="flex items-center justify-center">
              <img
                src={selectedAnimation.frames[currentFrame]}
                alt="Animation Preview"
                className="w-auto h-auto max-w-[85vw] max-h-[85vh] object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60]">
          <div className="bg-[#2D2D2D] rounded-lg shadow-2xl w-[600px] p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-medium">Add Frames</h2>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setSpritesheetSettings({
                    file: null,
                    previewUrl: '',
                    cols: 1,
                    rows: 1,
                    direction: 'horizontal'
                  });
                }}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Multiple Sprites Option */}
              <div
                className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
                onClick={() => document.getElementById('frame-upload')?.click()}
              >
                <div className="flex items-center justify-center h-32 mb-4 border-2 border-dashed border-[#555555] rounded">
                  <Image className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-white text-center font-medium mb-2">Multiple Sprites</h3>
                <p className="text-gray-400 text-sm text-center">
                  Upload multiple image files as individual frames
                </p>
                <input
                  id="frame-upload"
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFrameUpload}
                />
              </div>

              {/* Spritesheet Option */}
              <div
                className="bg-[#333333] p-4 rounded-lg cursor-pointer hover:bg-[#444444] transition-colors"
                onClick={() => document.getElementById('spritesheet-upload')?.click()}
              >
                <div className="flex items-center justify-center h-32 mb-4 border-2 border-dashed border-[#555555] rounded">
                  <Grid className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-white text-center font-medium mb-2">Spritesheet</h3>
                <p className="text-gray-400 text-sm text-center">
                  Upload a single spritesheet and slice it into frames
                </p>
                <input
                  id="spritesheet-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleSpritesheetUpload}
                />
              </div>
            </div>

            {/* Spritesheet Settings */}
            {spritesheetSettings.previewUrl && (
              <div className="mt-6 pt-6 border-t border-[#555555]">
                <div className="flex space-x-6">
                  <div className="w-48 h-48 bg-[#222222] rounded border border-[#555555] flex items-center justify-center">
                    <img
                      src={spritesheetSettings.previewUrl}
                      alt="Spritesheet preview"
                      className="max-w-full max-h-full object-contain"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Columns</label>
                        <input
                          type="number"
                          min="1"
                          value={spritesheetSettings.cols}
                          onChange={(e) => setSpritesheetSettings(prev => ({
                            ...prev,
                            cols: Math.max(1, parseInt(e.target.value) || 1)
                          }))}
                          className="w-full bg-[#444444] text-white px-3 py-2 rounded border border-[#555555]"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm mb-1">Rows</label>
                        <input
                          type="number"
                          min="1"
                          value={spritesheetSettings.rows}
                          onChange={(e) => setSpritesheetSettings(prev => ({
                            ...prev,
                            rows: Math.max(1, parseInt(e.target.value) || 1)
                          }))}
                          className="w-full bg-[#444444] text-white px-3 py-2 rounded border border-[#555555]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm mb-1">Direction</label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 text-white">
                          <input
                            type="radio"
                            checked={spritesheetSettings.direction === 'horizontal'}
                            onChange={() => setSpritesheetSettings(prev => ({
                              ...prev,
                              direction: 'horizontal'
                            }))}
                          />
                          <span>Horizontal</span>
                        </label>
                        <label className="flex items-center space-x-2 text-white">
                          <input
                            type="radio"
                            checked={spritesheetSettings.direction === 'vertical'}
                            onChange={() => setSpritesheetSettings(prev => ({
                              ...prev,
                              direction: 'vertical'
                            }))}
                          />
                          <span>Vertical</span>
                        </label>
                      </div>
                    </div>
                    <button
                      onClick={sliceSpritesheet}
                      className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
                    >
                      Slice Spritesheet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Folder Modal */}
      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D2D2D] rounded-lg p-6 w-96">
            <h3 className="text-white text-lg font-medium mb-4">Create New Folder</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="w-full bg-[#444444] text-white px-3 py-2 rounded border border-[#555555] focus:outline-none focus:border-blue-500 mb-4"
              placeholder="Folder Name"
              autoFocus
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-white hover:bg-[#444444] rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFolder}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 