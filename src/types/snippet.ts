export type SnippetType = 'CODE' | 'MARKDOWN' | 'RICH_TEXT';

export interface Tag {
  id: number;
  name: string;
}

export interface Snippet {
  id: number;
  title: string;
  description?: string;
  content: string;
  language: string;
  type: SnippetType;
  tags: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateSnippetInput {
  title: string;
  description?: string;
  content: string;
  language: string;
  type: SnippetType;
  tags: string[];
} 