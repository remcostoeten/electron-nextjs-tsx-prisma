/**
 * @author Remco Stoeten
 * @description Sidebar component for navigation and tag filtering
 */

'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Hash, Code2, FileText, Type } from 'lucide-react';
import type { Tag, SnippetType } from '@/types/snippet';

interface SidebarProps {
  onCreateNew: () => void;
  onTagSelect: (tag: Tag | null) => void;
  onTypeSelect: (type: SnippetType | null) => void;
  selectedTag: Tag | null;
  selectedType: SnippetType | null;
  refreshKey: number;
}

export function Sidebar({ onCreateNew, onTagSelect, onTypeSelect, selectedTag, selectedType, refreshKey }: SidebarProps) {
  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    const loadTags = async () => {
      if (!window.electronAPI) return;
      const fetchedTags = await window.electronAPI.getTags();
      setTags(fetchedTags);
    };
    loadTags();
  }, [refreshKey]);

  const types: { type: SnippetType; icon: any; label: string }[] = [
    { type: 'CODE', icon: Code2, label: 'Code' },
    { type: 'MARKDOWN', icon: FileText, label: 'Markdown' },
    { type: 'RICH_TEXT', icon: Type, label: 'Rich Text' },
  ];

  return (
    <div className="w-64 bg-[#1E1E1E] border-r border-gray-800 h-screen p-4 flex flex-col">
      <Button 
        onClick={onCreateNew}
        className="w-full mb-6 bg-blue-600 hover:bg-blue-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        New Snippet
      </Button>

      <div className="mb-6">
        <h2 className="text-sm font-semibold text-gray-400 mb-2">Types</h2>
        <div className="space-y-1">
          {types.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              variant={selectedType === type ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onTypeSelect(selectedType === type ? null : type)}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-400 mb-2">Tags</h2>
        <div className="space-y-1">
          {tags.map((tag) => (
            <Button
              key={tag.id}
              variant={selectedTag?.id === tag.id ? 'secondary' : 'ghost'}
              className="w-full justify-start"
              onClick={() => onTagSelect(selectedTag?.id === tag.id ? null : tag)}
            >
              <Hash className="w-4 h-4 mr-2" />
              {tag.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
} 