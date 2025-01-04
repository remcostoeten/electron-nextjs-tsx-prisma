import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  saveSnippet: (content) => ipcRenderer.invoke('save-snippet', content),
  getSnippets: () => ipcRenderer.invoke('get-snippets'),
}); 