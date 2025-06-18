import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  Upload, 
  Image, 
  Trash2, 
  Download,
  FolderOpen,
  Grid,
  List,
  Search,
  Filter,
  Eye,
  Copy,
  Palette
} from 'lucide-react';

interface Asset {
  id: string;
  name: string;
  type: 'sprite' | 'background' | 'ui' | 'icon';
  url: string;
  width: number;
  height: number;
  size: number;
  uploadedAt: Date;
  tags: string[];
}

interface AssetManagerProps {
  onBack: () => void;
}

export const AssetManager: React.FC<AssetManagerProps> = ({ onBack }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sprite' | 'background' | 'ui' | 'icon'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All Assets', icon: Image, count: assets.length },
    { id: 'sprite', label: 'Sprites', icon: Palette, count: assets.filter(a => a.type === 'sprite').length },
    { id: 'background', label: 'Backgrounds', icon: Image, count: assets.filter(a => a.type === 'background').length },
    { id: 'ui', label: 'UI Elements', icon: Grid, count: assets.filter(a => a.type === 'ui').length },
    { id: 'icon', label: 'Icons', icon: Eye, count: assets.filter(a => a.type === 'icon').length }
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);

    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        continue;
      }

      try {
        const img = new Image();
        const url = URL.createObjectURL(file);
        
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        });

        // Auto-categorize based on filename
        let type: Asset['type'] = 'sprite';
        const fileName = file.name.toLowerCase();
        if (fileName.includes('background') || fileName.includes('bg')) {
          type = 'background';
        } else if (fileName.includes('ui') || fileName.includes('button') || fileName.includes('menu')) {
          type = 'ui';
        } else if (fileName.includes('icon') || fileName.includes('ico')) {
          type = 'icon';
        }

        // Extract tags from filename
        const tags = fileName
          .replace(/\.(png|jpg|jpeg|gif|svg|webp)$/, '')
          .split(/[-_\s]+/)
          .filter(tag => tag.length > 2);

        const newAsset: Asset = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          type,
          url,
          width: img.naturalWidth,
          height: img.naturalHeight,
          size: file.size,
          uploadedAt: new Date(),
          tags
        };

        setAssets(prev => [...prev, newAsset]);
      } catch (error) {
        console.error('Error loading image:', error);
        alert(`Error loading ${file.name}`);
      }
    }

    setIsUploading(false);
    if (event.target) {
      event.target.value = '';
    }
  };

  const deleteAsset = (asset: Asset) => {
    if (confirm(`Delete ${asset.name}?`)) {
      URL.revokeObjectURL(asset.url);
      setAssets(prev => prev.filter(a => a.id !== asset.id));
      if (selectedAsset?.id === asset.id) {
        setSelectedAsset(null);
      }
    }
  };

  const copyAssetUrl = (asset: Asset) => {
    navigator.clipboard.writeText(asset.url);
    alert('Asset URL copied to clipboard!');
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = activeCategory === 'all' || asset.type === activeCategory;
    const matchesSearch = searchTerm === '' || 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (type: string) => {
    switch (type) {
      case 'sprite': return 'from-green-500 to-teal-600';
      case 'background': return 'from-blue-500 to-indigo-600';
      case 'ui': return 'from-purple-500 to-pink-600';
      case 'icon': return 'from-orange-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900 to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 via-red-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold">🖼️ Asset Manager</h1>
              <p className="text-orange-100">Organize your game's visual assets</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
              >
                {viewMode === 'grid' ? <List className="w-5 h-5" /> : <Grid className="w-5 h-5" />}
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 rounded-lg font-medium transition-colors"
              >
                <Upload className="w-5 h-5" />
                <span>{isUploading ? 'Uploading...' : 'Upload Images'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 sticky top-8">
              {/* Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search assets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-10 border border-white border-opacity-20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-orange-400"
                  />
                </div>
              </div>

              {/* Categories */}
              <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(({ id, label, icon: Icon, count }) => (
                  <button
                    key={id}
                    onClick={() => setActiveCategory(id as any)}
                    className={`
                      w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200
                      ${activeCategory === id 
                        ? 'bg-orange-500 bg-opacity-30 border-2 border-orange-400' 
                        : 'bg-white bg-opacity-5 hover:bg-opacity-10 border-2 border-transparent'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-5 h-5 text-white" />
                      <span className="text-white font-medium">{label}</span>
                    </div>
                    <span className="text-gray-300 text-sm">{count}</span>
                  </button>
                ))}
              </div>

              {/* Quick Stats */}
              <div className="mt-8 space-y-3">
                <h3 className="text-white font-medium">Quick Stats</h3>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Total Assets</div>
                  <div className="text-white font-bold text-lg">{assets.length}</div>
                </div>
                <div className="bg-white bg-opacity-5 rounded-lg p-3">
                  <div className="text-gray-300 text-sm">Total Size</div>
                  <div className="text-white font-bold text-lg">
                    {formatFileSize(assets.reduce((sum, asset) => sum + asset.size, 0))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  {activeCategory === 'all' ? 'All Assets' : 
                   categories.find(c => c.id === activeCategory)?.label}
                </h2>
                <div className="text-gray-300">
                  {filteredAssets.length} assets
                </div>
              </div>

              {filteredAssets.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🖼️</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Assets Found</h3>
                  <p className="text-gray-300 mb-6">
                    {searchTerm 
                      ? `No assets match "${searchTerm}"`
                      : activeCategory === 'all' 
                        ? 'Upload your first images to get started'
                        : `No ${activeCategory} assets found. Upload some images and they'll be categorized automatically.`
                    }
                  </p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Upload Images
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-white bg-opacity-5 rounded-xl p-3 hover:bg-opacity-10 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      {/* Image Preview */}
                      <div className="aspect-square bg-gray-800 rounded-lg mb-3 overflow-hidden">
                        <img
                          src={asset.url}
                          alt={asset.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Asset Info */}
                      <div className="space-y-1">
                        <h3 className="text-white font-medium text-sm truncate">{asset.name}</h3>
                        <div className="text-gray-300 text-xs">
                          {asset.width} × {asset.height}
                        </div>
                        <div className="text-gray-400 text-xs">
                          {formatFileSize(asset.size)}
                        </div>
                        
                        {/* Type Badge */}
                        <div className={`inline-block px-2 py-1 bg-gradient-to-r ${getCategoryColor(asset.type)} rounded text-white text-xs font-medium capitalize`}>
                          {asset.type}
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center space-x-1 mt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyAssetUrl(asset);
                          }}
                          className="p-1 bg-blue-600 hover:bg-blue-700 rounded text-white transition-colors"
                          title="Copy URL"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteAsset(asset);
                          }}
                          className="p-1 bg-red-600 hover:bg-red-700 rounded text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="bg-white bg-opacity-5 rounded-xl p-4 hover:bg-opacity-10 transition-all duration-200 cursor-pointer"
                      onClick={() => setSelectedAsset(asset)}
                    >
                      <div className="flex items-center space-x-4">
                        {/* Thumbnail */}
                        <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Asset Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{asset.name}</h3>
                          <div className="text-gray-300 text-sm space-y-1">
                            <div>Dimensions: {asset.width} × {asset.height}</div>
                            <div>Size: {formatFileSize(asset.size)}</div>
                            <div className="flex items-center space-x-2">
                              <span className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(asset.type)} rounded text-white text-xs font-medium capitalize`}>
                                {asset.type}
                              </span>
                              {asset.tags.length > 0 && (
                                <div className="flex space-x-1">
                                  {asset.tags.slice(0, 3).map((tag, index) => (
                                    <span key={index} className="px-2 py-1 bg-gray-600 rounded text-white text-xs">
                                      {tag}
                                    </span>
                                  ))}
                                  {asset.tags.length > 3 && (
                                    <span className="text-gray-400 text-xs">+{asset.tags.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyAssetUrl(asset);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                            title="Copy URL"
                          >
                            <Copy className="w-4 h-4 text-white" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteAsset(asset);
                            }}
                            className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upload Instructions */}
            <div className="mt-6 bg-orange-500 bg-opacity-10 border border-orange-400 border-opacity-30 rounded-xl p-4">
              <h3 className="text-orange-300 font-medium mb-2">💡 Asset Tips</h3>
              <ul className="text-orange-200 text-sm space-y-1">
                <li>• Supported formats: PNG, JPG, JPEG, GIF, SVG, WebP</li>
                <li>• Files are auto-categorized by filename keywords</li>
                <li>• Use descriptive names like "player_sprite.png" or "menu_background.jpg"</li>
                <li>• Optimize images for web to reduce file sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">{selectedAsset.name}</h2>
              <button
                onClick={() => setSelectedAsset(null)}
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Preview */}
              <div className="bg-gray-800 rounded-xl p-4">
                <img
                  src={selectedAsset.url}
                  alt={selectedAsset.name}
                  className="w-full h-auto max-h-96 object-contain mx-auto"
                />
              </div>

              {/* Asset Details */}
              <div className="space-y-4">
                <div className="bg-white bg-opacity-5 rounded-lg p-4">
                  <h3 className="text-white font-medium mb-3">Asset Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-300">Dimensions:</span>
                      <span className="text-white">{selectedAsset.width} × {selectedAsset.height}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">File Size:</span>
                      <span className="text-white">{formatFileSize(selectedAsset.size)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Type:</span>
                      <span className={`px-2 py-1 bg-gradient-to-r ${getCategoryColor(selectedAsset.type)} rounded text-white text-xs font-medium capitalize`}>
                        {selectedAsset.type}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-300">Uploaded:</span>
                      <span className="text-white">{selectedAsset.uploadedAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                {selectedAsset.tags.length > 0 && (
                  <div className="bg-white bg-opacity-5 rounded-lg p-4">
                    <h3 className="text-white font-medium mb-3">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAsset.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-gray-600 rounded-full text-white text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    onClick={() => copyAssetUrl(selectedAsset)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Copy className="w-5 h-5" />
                    <span>Copy Asset URL</span>
                  </button>
                  
                  <button
                    onClick={() => deleteAsset(selectedAsset)}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Asset</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};