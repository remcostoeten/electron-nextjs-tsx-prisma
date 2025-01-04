/**
 * @author Remco Stoeten
 * @description Editor component for creating and editing snippets
 */

'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Save, Trash2 } from 'lucide-react';
import type { Snippet, CreateSnippetInput, SnippetType } from '@/types/snippet';

interface SnippetEditorProps {
  snippet?: Snippet;
  onSave: (data: CreateSnippetInput) => Promise<void>;
  onDelete?: () => Promise<void>;
}

export function SnippetEditor({ snippet, onSave, onDelete }: SnippetEditorProps) {
  const [title, setTitle] = useState(snippet?.title ?? '');
  const [description, setDescription] = useState(snippet?.description ?? '');
  const [content, setContent] = useState(snippet?.content ?? '');
  const [language, setLanguage] = useState(snippet?.language ?? 'plaintext');
  const [type, setType] = useState<SnippetType>(snippet?.type ?? 'CODE');
  const [tags, setTags] = useState<string[]>(snippet?.tags.map(t => t.name) ?? []);
  const [tagInput, setTagInput] = useState('');

  const handleSave = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
    
    await onSave({
      title,
      description,
      content,
      language,
      type,
      tags
    });
  }, [title, description, content, language, type, tags, onSave]);

  const handleTagAdd = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      setTags(prev => [...new Set([...prev, tagInput.trim()])]);
      setTagInput('');
    }
  }, [tagInput]);

  const removeTag = useCallback((tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }, []);

  return (
    <Card className="p-6 bg-[#1E1E1E] border-none">
      <div className="flex justify-between mb-6">
        <div className="space-y-4 flex-1 mr-4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold"
          />
          <Input
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          {onDelete && (
            <Button onClick={onDelete} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2 mb-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 text-sm bg-gray-700 text-gray-300 px-2 py-1 rounded"
            >
              {tag}
              <button
                onClick={() => removeTag(tag)}
                className="text-gray-400 hover:text-gray-200"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <Input
          placeholder="Add tags (press Enter)"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
        />
      </div>

      <div className="mb-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="plaintext">Plain Text</option>
          <option value="javascript">JavaScript</option>
          <option value="typescript">TypeScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="csharp">C#</option>
          <option value="cpp">C++</option>
          <option value="php">PHP</option>
          <option value="ruby">Ruby</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="sql">SQL</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="markdown">Markdown</option>
        </select>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-[400px] p-4 bg-gray-900 text-white font-mono text-sm rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your snippet content here..."
      />
    </Card>
  );
} 