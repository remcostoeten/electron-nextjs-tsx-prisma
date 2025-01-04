/**
 * @author Remco Stoeten
 * @description Component that displays a list of snippets with filtering capabilities
 */

import { useState, useEffect, useCallback } from 'react';
import type { Snippet, Tag, SnippetType } from '@/types/snippet';

interface SnippetListProps {
  onSelect: (snippet: Snippet) => void;
  selectedTag: Tag | null;
  selectedType: SnippetType | null;
  refreshKey: number;
}

export function SnippetList({ onSelect, selectedTag, selectedType, refreshKey }: SnippetListProps) {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSnippets = useCallback(async () => {
    if (!window.electronAPI) {
      setError('Electron API not available');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await window.electronAPI.getSnippets();
      console.log('Loaded snippets:', data); // Debug log
      setSnippets(data);
    } catch (err) {
      console.error('Error loading snippets:', err);
      setError('Failed to load snippets');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnippets();
  }, [loadSnippets, refreshKey]);

  const filteredSnippets = snippets.filter(snippet => {
    const matchesTag = !selectedTag || snippet.tags.some(tag => tag.id === selectedTag.id);
    const matchesType = !selectedType || snippet.type === selectedType;
    return matchesTag && matchesType;
  });

  if (loading) {
    return (
      <div className="w-80 border-r border-gray-800 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading snippets...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 border-r border-gray-800 p-4">
        <div className="text-red-500 p-4 rounded-md bg-red-900/20">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-gray-800 overflow-auto">
      {filteredSnippets.length === 0 ? (
        <div className="p-4 text-gray-500 text-center">
          No snippets found
        </div>
      ) : (
        <div className="space-y-2 p-2">
          {filteredSnippets.map(snippet => (
            <button
              key={snippet.id}
              onClick={() => onSelect(snippet)}
              className="w-full text-left p-3 rounded-md hover:bg-gray-800 transition-colors"
            >
              <h3 className="font-medium truncate">{snippet.title}</h3>
              {snippet.description && (
                <p className="text-sm text-gray-400 truncate mt-1">
                  {snippet.description}
                </p>
              )}
              {snippet.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {snippet.tags.map(tag => (
                    <span
                      key={tag.id}
                      className="px-2 py-0.5 text-xs rounded-full bg-gray-700 text-gray-300"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 