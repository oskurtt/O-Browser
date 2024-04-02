const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

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