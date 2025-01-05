/**
 * @author Remco Stoeten
 * @description Main process file for Electron application, handling window creation and lifecycle
 */

import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import prepareNext from 'electron-next'
import { join } from 'path'

async function createWindow() {
  await prepareNext('./renderer')

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    }
  })

  const url = isDev
    ? 'http://localhost:8000/'
    : `file://${join(__dirname, '../renderer/out/index.html')}`

  mainWindow.loadURL(url)

  if (isDev) {
    mainWindow.webContents.openDevTools()
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
}) 