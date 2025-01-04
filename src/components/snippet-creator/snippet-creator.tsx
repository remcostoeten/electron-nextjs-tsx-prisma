/**
 * @author Remco Stoeten
 * @description A modern code snippet creator component with syntax highlighting and line numbers
 */

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { ElectronAPI } from '@/types/electron';

declare global {
  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export function SnippetCreator() {
  const [content, setContent] = useState<string>('');

  const handleSave = useCallback(async () => {
    if (!content.trim() || !window.electronAPI) return;
    try {
      await window.electronAPI.saveSnippet(content);
      setContent('');
    } catch (error) {
      console.error('Failed to save snippet:', error);
    }
  }, [content]);

  const handleCopy = useCallback(async () => {
    if (!content.trim()) return;
    await navigator.clipboard.writeText(content);
  }, [content]);

  return (
    <Card className="w-full bg-[#1E1E1E] text-white border-none">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-sm font-medium">Snippet Creator</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Help</Button>
          <Button variant="ghost" size="sm">Feedback</Button>
        </div>
      </div>
      
      <div className="p-4">
        <div className="relative min-h-[400px] font-mono text-sm">
          <div className="absolute left-0 top-0 flex flex-col items-end pr-4 text-gray-500 select-none">
            {content.split('\n').map((_, i) => (
              <div key={i + 1} className="h-6 leading-6">
                {i + 1}
              </div>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full min-h-[400px] pl-12 bg-transparent resize-none focus:outline-none"
            placeholder="Type your code here..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 p-4 border-t border-gray-800">
        <Button onClick={handleSave} variant="secondary">
          Save Snippet
        </Button>
        <Button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700">
          Copy Snippet
        </Button>
      </div>
    </Card>
  );
} 