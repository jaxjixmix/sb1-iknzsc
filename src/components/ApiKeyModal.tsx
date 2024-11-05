import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ApiKeyModalProps {
  apiKey: string;
  onSave: (key: string) => void;
  onClose: () => void;
}

function ApiKeyModal({ apiKey, onSave, onClose }: ApiKeyModalProps) {
  const [key, setKey] = useState(apiKey);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-[90%] max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Pexels API Key</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <p className="text-gray-600 mb-4">
          Enter your Pexels API key. You can get one from{' '}
          <a
            href="https://www.pexels.com/api/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600"
          >
            Pexels API
          </a>
        </p>
        
        <input
          type="text"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Enter your API key"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(key)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApiKeyModal;