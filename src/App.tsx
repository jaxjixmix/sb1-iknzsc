import React, { useState, useEffect } from 'react';
import { Search, Image as ImageIcon, Video, Key, Copy, ExternalLink } from 'lucide-react';
import ApiKeyModal from './components/ApiKeyModal';
import AssetGrid from './components/AssetGrid';
import { Asset, AssetType, Orientation } from './types';

function App() {
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiModal, setShowApiModal] = useState(false);
  const [query, setQuery] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('image');
  const [orientation, setOrientation] = useState<Orientation>('landscape');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    chrome.storage.sync.get(['pexelsApiKey'], (result) => {
      if (result.pexelsApiKey) {
        setApiKey(result.pexelsApiKey);
      } else {
        setShowApiModal(true);
      }
    });
  }, []);

  const searchAssets = async () => {
    if (!query.trim() || !apiKey) return;

    setLoading(true);
    const endpoint = assetType === 'image' 
      ? 'https://api.pexels.com/v1/search'
      : 'https://api.pexels.com/videos/search';

    try {
      const response = await fetch(`${endpoint}?query=${query}&orientation=${orientation}&per_page=20`, {
        headers: {
          'Authorization': apiKey
        }
      });
      const data = await response.json();
      
      const formattedAssets = (assetType === 'image' ? data.photos : data.videos).map((item: any) => ({
        id: item.id,
        type: assetType,
        url: assetType === 'image' ? item.src.original : item.video_files[0].link,
        thumbnail: assetType === 'image' ? item.src.medium : item.image,
        width: item.width,
        height: item.height
      }));

      setAssets(formattedAssets);
    } catch (error) {
      console.error('Error fetching assets:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[400px] h-[600px] bg-gray-50">
      <div className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-800">Pexels Finder</h1>
          <button
            onClick={() => setShowApiModal(true)}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Key size={20} />
          </button>
        </div>

        <div className="relative mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchAssets()}
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setAssetType('image')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              assetType === 'image' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <ImageIcon size={16} />
            Images
          </button>
          <button
            onClick={() => setAssetType('video')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
              assetType === 'video' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            <Video size={16} />
            Videos
          </button>
          <select
            value={orientation}
            onChange={(e) => setOrientation(e.target.value as Orientation)}
            className="ml-auto px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 border-none outline-none"
          >
            <option value="landscape">Landscape</option>
            <option value="portrait">Portrait</option>
          </select>
        </div>
      </div>

      <div className="p-4 overflow-y-auto" style={{ height: 'calc(100% - 200px)' }}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <AssetGrid assets={assets} />
        )}
      </div>

      {showApiModal && (
        <ApiKeyModal
          apiKey={apiKey}
          onSave={(key) => {
            setApiKey(key);
            chrome.storage.sync.set({ pexelsApiKey: key });
            setShowApiModal(false);
          }}
          onClose={() => setShowApiModal(false)}
        />
      )}
    </div>
  );
}

export default App;