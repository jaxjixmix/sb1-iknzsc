import React, { useState } from 'react';
import { Copy, ExternalLink } from 'lucide-react';
import { Asset } from '../types';

interface AssetGridProps {
  assets: Asset[];
}

function AssetGrid({ assets }: AssetGridProps) {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-4">
        {assets.map((asset) => (
          <div
            key={asset.id}
            onClick={() => setSelectedAsset(asset)}
            className="relative group cursor-pointer rounded-lg overflow-hidden"
          >
            <img
              src={asset.thumbnail}
              alt=""
              className="w-full h-40 object-cover"
            />
            {asset.type === 'video' && (
              <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white bg-opacity-30 flex items-center justify-center">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAsset && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
            <h3 className="text-lg font-semibold mb-4">Copy Asset URL</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Direct URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={selectedAsset.url}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => copyToClipboard(selectedAsset.url)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Markdown</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={`![${selectedAsset.type === 'video' ? 'Video thumbnail' : 'Image'}](${selectedAsset.url})`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => copyToClipboard(`![${selectedAsset.type === 'video' ? 'Video thumbnail' : 'Image'}](${selectedAsset.url})`)}
                    className="p-2 text-gray-600 hover:text-gray-800"
                  >
                    <Copy size={20} />
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Close
                </button>
                <a
                  href={selectedAsset.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Open <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AssetGrid;