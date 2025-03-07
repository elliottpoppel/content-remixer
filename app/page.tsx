'use client';

import { useState, useEffect } from 'react';

interface Prompt {
  id: string;
  name: string;
  content: string;
}

const DEFAULT_PROMPT = {
  id: 'default',
  name: 'Remix for Twitter',
  content: "Transform the following content into a tweet (280 characters or less) while preserving the original voice:"
};

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(DEFAULT_PROMPT.content);
  const [savedPrompts, setSavedPrompts] = useState<Prompt[]>([]);
  const [isCreatingPrompt, setIsCreatingPrompt] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(DEFAULT_PROMPT.id);
  const [newPromptName, setNewPromptName] = useState('');

  // Load saved prompts from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedPrompts');
    if (saved) {
      setSavedPrompts(JSON.parse(saved));
    }
  }, []);

  // Save prompts to localStorage when they change
  useEffect(() => {
    localStorage.setItem('savedPrompts', JSON.stringify(savedPrompts));
  }, [savedPrompts]);

  const handleRemix = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/remix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          content: input,
          prompt: currentPrompt
        }),
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

  const handleCreatePrompt = () => {
    if (!newPromptName || !currentPrompt) return;
    
    const newPrompt: Prompt = {
      id: Date.now().toString(),
      name: newPromptName,
      content: currentPrompt
    };
    
    setSavedPrompts([...savedPrompts, newPrompt]);
    setNewPromptName('');
    setCurrentPrompt(currentPrompt);
    setIsCreatingPrompt(false);
    setSelectedPromptId(newPrompt.id);
  };

  const handleDeletePrompt = (id: string) => {
    setSavedPrompts(savedPrompts.filter(prompt => prompt.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <main className="max-w-3xl mx-auto px-6 py-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-12">
          <h1 className="text-[2.5rem] leading-tight tracking-[-0.02em] font-semibold text-[#37352F]">
            Content Remixer
          </h1>
          <p className="text-[15px] text-[#6B6B6B]">
            Transform your content into tweet-sized messages while preserving the original voice
          </p>
        </div>

        {/* Prompt Menu */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Default Prompt Pill */}
          <button
            onClick={() => {
              setSelectedPromptId(DEFAULT_PROMPT.id);
              setCurrentPrompt(DEFAULT_PROMPT.content);
            }}
            className={`
              px-4 py-2 rounded-full text-[14px] transition-all duration-150
              ${selectedPromptId === DEFAULT_PROMPT.id
                ? 'bg-[#37352F] text-white'
                : 'bg-[#F1F1F1] text-[#37352F] hover:bg-[#E6E6E6]'
              }
            `}
          >
            {DEFAULT_PROMPT.name}
          </button>

          {/* Saved Prompt Pills */}
          {savedPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() => {
                setSelectedPromptId(prompt.id);
                setCurrentPrompt(prompt.content);
              }}
              className={`
                group relative px-4 py-2 rounded-full text-[14px] transition-all duration-150
                ${selectedPromptId === prompt.id
                  ? 'bg-[#37352F] text-white'
                  : 'bg-[#F1F1F1] text-[#37352F] hover:bg-[#E6E6E6]'
                }
              `}
            >
              {prompt.name}
              {/* Delete button overlay */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeletePrompt(prompt.id);
                  if (selectedPromptId === prompt.id) {
                    setSelectedPromptId(DEFAULT_PROMPT.id);
                    setCurrentPrompt(DEFAULT_PROMPT.content);
                  }
                }}
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#E03E3E] text-white
                         opacity-0 group-hover:opacity-100 transition-opacity duration-150
                         flex items-center justify-center text-[12px]"
              >
                ×
              </button>
            </button>
          ))}

          {/* Add New Prompt Button */}
          <button
            onClick={() => setIsCreatingPrompt(true)}
            className="px-4 py-2 rounded-full text-[14px] border border-dashed 
                     border-[#37352F] text-[#37352F] hover:bg-[#F9F9F9]
                     transition-all duration-150"
          >
            + New Prompt
          </button>
        </div>

        {/* Create New Prompt Dialog */}
        {isCreatingPrompt && (
          <div className="space-y-4 p-4 border border-[#E6E6E6] rounded-[3px] bg-[#F9F9F9]">
            <div className="flex justify-between items-center">
              <h3 className="text-[14px] font-medium text-[#37352F]">Create New Prompt</h3>
              <button
                onClick={() => setIsCreatingPrompt(false)}
                className="text-[#6B6B6B] hover:text-[#37352F]"
              >
                ×
              </button>
            </div>
            <input
              type="text"
              placeholder="Prompt name"
              value={newPromptName}
              onChange={(e) => setNewPromptName(e.target.value)}
              className="w-full px-3 py-2 rounded-[3px] border border-[#E6E6E6] 
                       text-[14px] text-[#37352F] focus:outline-none 
                       focus:ring-[2px] focus:border-[#37352F]"
            />
            <textarea
              value={currentPrompt}
              onChange={(e) => setCurrentPrompt(e.target.value)}
              placeholder="Enter your prompt..."
              className="w-full h-[100px] p-3 rounded-[3px] border border-[#E6E6E6] 
                       text-[14px] text-[#37352F] focus:outline-none 
                       focus:ring-[2px] focus:border-[#37352F] resize-none"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsCreatingPrompt(false)}
                className="px-3 py-1 rounded-[3px] text-[13px] text-[#6B6B6B]
                         hover:text-[#37352F]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePrompt}
                disabled={!newPromptName || !currentPrompt}
                className="px-3 py-1 rounded-[3px] text-[13px] bg-[#37352F] 
                         text-white disabled:bg-[#F1F1F1] 
                         disabled:text-[#9B9B9B]"
              >
                Save Prompt
              </button>
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1">
            <label className="text-[13px] font-medium text-[#37352F]">
              Input Text
            </label>
            <span className="text-[13px] text-[#6B6B6B]">
              {input.length} characters
            </span>
          </div>
          <textarea
            className="w-full h-[180px] p-4 rounded-[3px]
                     bg-white border border-[#E6E6E6] 
                     text-[15px] text-[#37352F]
                     placeholder-[#9B9B9B]
                     focus:outline-none focus:ring-[2px] 
                     focus:ring-[#E6E6E6] focus:border-[#37352F]
                     transition-all duration-150 ease-in-out
                     hover:border-[#37352F]/50
                     resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your content here..."
          />
        </div>

        {/* Action Button */}
        <div className="flex justify-center pt-2">
          <button
            onClick={handleRemix}
            disabled={isLoading || !input}
            className={`
              px-4 py-[6px] rounded-[3px] text-[14px]
              transition-all duration-150 ease-in-out
              ${isLoading || !input 
                ? 'bg-[#F1F1F1] text-[#9B9B9B] cursor-not-allowed' 
                : 'bg-[#37352F] text-white hover:bg-[#2B2B2B] active:bg-[#1A1A1A]'
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                <span>Remixing...</span>
              </div>
            ) : (
              'Remix to Tweet'
            )}
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 rounded-[3px] bg-[#FFF3F3] 
                         border border-[#FFC7C7]
                         text-[#E03E3E] text-[14px]">
            {error}
          </div>
        )}

        {/* Output Section */}
        {output && (
          <div className="space-y-2 pt-4">
            <div className="flex justify-between items-center px-1">
              <label className="text-[13px] font-medium text-[#37352F]">
                Remixed Output
              </label>
              <span className={`text-[13px] ${
                output.length > 280 
                  ? 'text-[#E03E3E]' 
                  : 'text-[#6B6B6B]'
              }`}>
                {output.length}/280 characters
              </span>
            </div>
            <div className="relative group">
              <textarea
                readOnly
                value={output}
                className="w-full h-[180px] p-4 rounded-[3px]
                         bg-[#F9F9F9] border border-[#E6E6E6]
                         text-[15px] text-[#37352F]
                         focus:outline-none focus:ring-[2px]
                         focus:ring-[#E6E6E6] focus:border-[#37352F]
                         transition-all duration-150 ease-in-out
                         resize-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(output);
                }}
                className="absolute top-3 right-3 p-1.5 rounded-[3px]
                         opacity-0 group-hover:opacity-100
                         bg-white border border-[#E6E6E6]
                         text-[#6B6B6B] hover:text-[#37352F]
                         hover:border-[#37352F]/50
                         transition-all duration-150 ease-in-out"
                title="Copy to clipboard"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 