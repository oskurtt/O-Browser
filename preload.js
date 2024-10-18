const { contextBridge, shell, ipcRenderer } = require('electron');


contextBridge.exposeInMainWorld('electron', {
    openExternal: (url) => shell.openExternal(url)
});


contextBridge.exposeInMainWorld('electronAPI', {
    onProfilesLoaded: (callback) => ipcRenderer.on('profiles-loaded', callback),
    deleteProfile: (profileName) => ipcRenderer.send('delete-profile', profileName),
    createProfileDirectory: (profileName, callback) => ipcRenderer.invoke('create-profile-directory', profileName).then(callback),
    startPuppeteer: (profileName) => ipcRenderer.send('start-puppeteer', profileName)

});