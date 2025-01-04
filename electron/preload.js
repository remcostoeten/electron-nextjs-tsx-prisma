import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  createSnippet: async (data) => {
    try {
      return await ipcRenderer.invoke('create-snippet', data);
    } catch (error) {
      console.error('Failed to create snippet:', error);
      throw error;
    }
  },
  
  getSnippets: async () => {
    try {
      return await ipcRenderer.invoke('get-snippets');
    } catch (error) {
      console.error('Failed to get snippets:', error);
      throw error;
    }
  },
  
  getTags: async () => {
    try {
      return await ipcRenderer.invoke('get-tags');
    } catch (error) {
      console.error('Failed to get tags:', error);
      throw error;
    }
  },
  
  deleteSnippet: async (id) => {
    try {
      return await ipcRenderer.invoke('delete-snippet', id);
    } catch (error) {
      console.error('Failed to delete snippet:', error);
      throw error;
    }
  },
  
  updateSnippet: async (data) => {
    try {
      return await ipcRenderer.invoke('update-snippet', data);
    } catch (error) {
      console.error('Failed to update snippet:', error);
      throw error;
    }
  }
}); 