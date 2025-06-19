import React, { useState } from 'react';
import { ArrowLeft, Search, Image, Layout, Monitor, Eye } from 'lucide-react';
import { AnimationEditor } from './AnimationEditor';
import { SpriteLibrary } from './SpriteLibrary';

interface AssetManagerProps {
  onBack: () => void;
}

interface AnimationData {
  name: string;
  frames: string[];
  settings: {
    speed: number;
    loop: boolean;
    pingPong: boolean;
    reverse: boolean;
  };
}

export const AssetManager: React.FC<AssetManagerProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'sprites' | 'backgrounds' | 'ui' | 'icons'>('all');
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [spriteName, setSpriteName] = useState('');
  const [animations, setAnimations] = useState<AnimationData[]>([]);

  const categories = [
    { id: 'all', label: 'All Assets', icon: Image, count: 0 },
    { id: 'sprites', label: 'Sprites', icon: Image, count: 0 },
    { id: 'backgrounds', label: 'Backgrounds', icon: Layout, count: 0 },
    { id: 'ui', label: 'UI Elements', icon: Monitor, count: 0 },
    { id: 'icons', label: 'Icons', icon: Eye, count: 0 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500">
      {isEditorOpen ? (
        <AnimationEditor
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          spriteName={spriteName}
          onSpriteNameChange={setSpriteName}
          animations={animations}
          onAnimationsUpdate={setAnimations}
        />
      ) : (
        <div className="container mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Dashboard
              </button>
              <div className="flex items-center space-x-3">
                <img src="/game-assets.png" alt="Asset Manager" className="w-8 h-8" />
                <h1 className="text-2xl font-bold text-white">Asset Manager</h1>
              </div>
            </div>
            <button
              onClick={() => {
                setSpriteName('');
                setAnimations([]);
                setIsEditorOpen(true);
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
            >
              Create Sprite
            </button>
      </div>

          <div className="relative mb-6">
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 bg-black/20 text-white placeholder-white/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
          </div>

          <div className="flex space-x-4 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-black/30 text-white'
                    : 'bg-black/20 text-white/80 hover:bg-black/25'
                }`}
              >
                <category.icon className="w-5 h-5 mr-2" />
                {category.label}
                <span className="ml-2 bg-black/20 px-2 py-0.5 rounded-full text-sm">
                  {category.count}
                </span>
              </button>
                      ))}
                    </div>

          {selectedCategory === 'all' || selectedCategory === 'sprites' ? (
            <SpriteLibrary />
          ) : (
            <div className="text-center text-white/60 py-12">
              No assets found in this category
            </div>
          )}
        </div>
      )}
    </div>
  );
};