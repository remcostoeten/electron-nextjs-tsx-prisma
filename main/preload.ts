/**
 * @author Remco Stoeten
 * @description Preload script for secure IPC communication between main and renderer processes
 */

import { contextBridge, ipcRenderer } from 'electron'

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron',
  {
    send: (channel: string, data: any) => {
      // whitelist channels
      const validChannels = ['toMain']
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data)
      }
    },
    receive: (channel: string, func: (...args: any[]) => void) => {
      const validChannels = ['fromMain']
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args))
      }
    }
  }
) 