const { contextBridge, shell, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => shell.openExternal(url)
});

contextBridge.exposeInMainWorld('electronAPI', {
    onProfilesLoaded: (callback) => ipcRenderer.on('profiles-loaded', callback)
});