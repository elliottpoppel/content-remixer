'use client';

import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRemix = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) {
        throw new Error('Failed to remix content');
      }

      const data = await response.json();
      setOutput(data.message);
    } catch (error) {
      setError('Failed to remix content. Please try again.');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      // Optional: Add a temporary "Copied!" message
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-4 space-y-6 bg-black text-white">
      <h1 className="text-2xl font-normal">Content Remixer</h1>
      
      <div className="space-y-2">
        <label className="block text-sm text-gray-400">
          Input Text
        </label>
        <textarea
          className="w-full p-2 border border-gray-700 rounded-md mb-1 h-32 bg-black text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your content here..."
        />
        <div className="text-sm text-gray-500 flex justify-end">
          {input.length} characters
        </div>
      </div>

      <button
        onClick={handleRemix}
        disabled={isLoading || !input}
        className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50 hover:bg-blue-600 transition-colors"
      >
        {isLoading ? 'Remixing...' : 'Remix to Tweet'}
      </button>

      {error && (
        <div className="p-3 bg-red-900/50 border border-red-700 rounded-md text-red-400">
          {error}
        </div>
      )}

      {output && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm text-gray-400">
              Remixed Output
            </label>
            <div className="text-sm text-gray-500">
              {output.length}/280 characters
            </div>
          </div>
          <div className="relative">
            <textarea
              readOnly
              value={output}
              className="w-full p-2 border border-gray-700 rounded-md bg-black text-white h-32 focus:outline-none"
            />
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-300"
              title="Copy to clipboard"
            >
              📋
            </button>
          </div>
        </div>
      )}
    </main>
  );
} 