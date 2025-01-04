import type { Snippet, CreateSnippetInput, Tag } from './snippet';

export interface ElectronAPI {
  createSnippet: (data: CreateSnippetInput) => Promise<Snippet>;
  getSnippets: () => Promise<Snippet[]>;
  getTags: () => Promise<Tag[]>;
  deleteSnippet: (id: number) => Promise<boolean>;
  updateSnippet: (data: Partial<CreateSnippetInput> & { id: number }) => Promise<Snippet>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 