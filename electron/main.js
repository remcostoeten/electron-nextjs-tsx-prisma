import { app, BrowserWindow, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Prisma
let prisma;

async function initPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
    await prisma.$connect();
  }
  return prisma;
}

// Handle Prisma shutdown
app.on('before-quit', async () => {
  if (prisma) {
    await prisma.$disconnect();
  }
});

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
    win.webContents.openDevTools();
  } else {
    win.loadFile('dist/index.html');
  }
}

app.whenReady().then(async () => {
  await initPrisma();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers with error handling
ipcMain.handle('create-snippet', async (_, data) => {
  try {
    const { tags: tagNames, ...snippetData } = data;
    const db = await initPrisma();
    
    const snippet = await db.snippet.create({
      data: {
        ...snippetData,
        tags: {
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: {
        tags: true
      }
    });
    
    return snippet;
  } catch (error) {
    console.error('Error creating snippet:', error);
    throw error;
  }
});

ipcMain.handle('get-snippets', async () => {
  try {
    const db = await initPrisma();
    return db.snippet.findMany({
      include: {
        tags: true
      },
      orderBy: {
        updatedAt: 'desc'
      }
    });
  } catch (error) {
    console.error('Error getting snippets:', error);
    throw error;
  }
});

ipcMain.handle('get-tags', async () => {
  try {
    const db = await initPrisma();
    return db.tag.findMany();
  } catch (error) {
    console.error('Error getting tags:', error);
    throw error;
  }
});

ipcMain.handle('delete-snippet', async (_, id) => {
  try {
    const db = await initPrisma();
    await db.snippet.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting snippet:', error);
    throw error;
  }
});

ipcMain.handle('update-snippet', async (_, { id, tags: tagNames, ...data }) => {
  try {
    const db = await initPrisma();
    const snippet = await db.snippet.update({
      where: { id },
      data: {
        ...data,
        tags: {
          set: [],
          connectOrCreate: tagNames.map(name => ({
            where: { name },
            create: { name }
          }))
        }
      },
      include: {
        tags: true
      }
    });
    
    return snippet;
  } catch (error) {
    console.error('Error updating snippet:', error);
    throw error;
  }
}); 