const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const puppeteerScript = require('./puppeteer.js');

function createWindow () {
  const win = new BrowserWindow({
    width: 1400,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  win.loadFile('index.html');
  //win.webContents.openDevTools();

  win.webContents.on('did-finish-load', () => {
    const profilesPath = path.join(__dirname, 'profiles');
    fs.readdir(profilesPath, { withFileTypes: true }, (err, entries) => {
        if (err) {
            console.error('Failed to read profiles directory:', err);
            return;
        }
        const folders = entries.filter(entry => entry.isDirectory()).map(dir => dir.name);
        win.webContents.send('profiles-loaded', folders);
    });
  });

  ipcMain.handle('create-profile-directory', async (event, profileName) => {
    const profilePath = path.join(__dirname, 'profiles', profileName);
    try {
        await fs.promises.access(profilePath, fs.constants.F_OK);
        return true;
    } catch {
        await fs.promises.mkdir(profilePath);
        return false; 
    }
  });

  ipcMain.on('delete-profile', (event, profileName) => {
    const profilePath = path.join(__dirname, 'profiles', profileName);
    fs.rmdir(profilePath, { recursive: true }, (err) => {
        if (err) {
            console.error(`Failed to delete profile directory ${profilePath}:`, err);
        }
    });
  });

  ipcMain.handle('rename-profile', async (event, oldName, newName) => {
    const profilesPath = path.join(__dirname, 'profiles');
    const oldPath = path.join(profilesPath, oldName);
    const newPath = path.join(profilesPath, newName);

    try {
        await fs.promises.rename(oldPath, newPath);
        return { success: true };
    } catch (err) {
        console.error(`Failed to rename profile from '${oldName}' to '${newName}':`, err);
        return { success: false, error: err.message };
    }
  });

  ipcMain.on('start-puppeteer', (event, profileName) => {
    console.log(`Starting Puppeteer for profile: ${profileName}`);
    puppeteerScript.startInstance(profileName);
});

  
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})