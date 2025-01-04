/**
 * @author Remco Stoeten
 * @description Main page component that renders the snippet management interface
 */

'use client';

import { useState, useCallback, useEffect } from 'react';
import { Sidebar } from '@/components/layout/sidebar';
import { SnippetList } from '@/components/snippet/snippet-list';
import { SnippetEditor } from '@/components/snippet/snippet-editor';
import type { Snippet, Tag, SnippetType, CreateSnippetInput } from '@/types/snippet';

export default function Home() {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [selectedType, setSelectedType] = useState<SnippetType | null>(null);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleCreateNew = useCallback(() => {
    setSelectedSnippet(null);
    setIsCreating(true);
    setError(null);
  }, []);

  const handleSave = useCallback(async (data: CreateSnippetInput) => {
    if (!window.electronAPI) {
      setError('Electron API not available');
      return;
    }

    try {
      if (selectedSnippet) {
        await window.electronAPI.updateSnippet({ ...data, id: selectedSnippet.id });
      } else {
        await window.electronAPI.createSnippet(data);
      }
      setIsCreating(false);
      setError(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to save snippet:', error);
      setError('Failed to save snippet. Please try again.');
    }
  }, [selectedSnippet]);

  const handleDelete = useCallback(async () => {
    if (!window.electronAPI || !selectedSnippet) {
      setError('Cannot delete snippet at this time');
      return;
    }

    try {
      await window.electronAPI.deleteSnippet(selectedSnippet.id);
      setSelectedSnippet(null);
      setError(null);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      setError('Failed to delete snippet. Please try again.');
    }
  }, [selectedSnippet]);

  return (
    <main className="flex h-screen bg-[#121212] text-white">
      <Sidebar
        onCreateNew={handleCreateNew}
        onTagSelect={setSelectedTag}
        onTypeSelect={setSelectedType}
        selectedTag={selectedTag}
        selectedType={selectedType}
        refreshKey={refreshKey}
      />
      <SnippetList
        onSelect={setSelectedSnippet}
        selectedTag={selectedTag}
        selectedType={selectedType}
        refreshKey={refreshKey}
      />
      <div className="flex-1 p-4 overflow-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 text-red-200 rounded-md">
            {error}
          </div>
        )}
        {(selectedSnippet || isCreating) ? (
          <SnippetEditor
            snippet={selectedSnippet || undefined}
            onSave={handleSave}
            onDelete={selectedSnippet ? handleDelete : undefined}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a snippet or create a new one
          </div>
        )}
      </div>
    </main>
  );
} 