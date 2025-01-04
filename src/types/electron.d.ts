export interface Snippet {
  id: number;
  content: string;
  created_at: string;
}

export interface ElectronAPI {
  saveSnippet: (content: string) => Promise<number>;
  getSnippets: () => Promise<Snippet[]>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
} 