function addProfileToList(profileName) {
    const profileList = document.getElementById('profileList');
    const li = document.createElement('li');
    const profileText = document.createElement('span'); 
    profileText.textContent = profileName;
    li.appendChild(profileText);

    const buttonContainer = document.createElement('div'); 

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.addEventListener('click', () => {
        window.electronAPI.startPuppeteer(profileName);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        li.remove(); 
        window.electronAPI.deleteProfile(profileName); 
    });

    const renameBtn = document.createElement('button');
    renameBtn.textContent = 'Rename';
    renameBtn.addEventListener('click', async () => {
        const newName = prompt(`Enter new name for profile '${profileName}':`, profileName);
        if (newName && newName.trim() !== profileName) {
            const result = await window.electronAPI.renameProfile(profileName, newName.trim());
            if (result.success) {
                profileText.textContent = newName;
                profileName = newName;
                showNotification(`Profile renamed to '${newName}'!`, 'success');
            } else {
                showNotification(`Failed to rename profile: ${result.error}`, 'error');
            }
        }
    });

    buttonContainer.appendChild(startBtn); 
    buttonContainer.appendChild(deleteBtn); 
    buttonContainer.appendChild(renameBtn); 
    li.appendChild(buttonContainer); 
    profileList.appendChild(li); 
}


document.getElementById('addProfile').addEventListener('click', () => {
    const profileNameInput = document.getElementById('profileName');
    const profileName = profileNameInput.value.trim();

    if (profileName) {
        window.electronAPI.createProfileDirectory(profileName, (exists) => {
            if (exists) {
                showNotification(`Profile '${profileName}' already exists!`, 'error');
                profileNameInput.focus();
            } else {
                addProfileToList(profileName);
                profileNameInput.value = '';
                profileNameInput.focus();
                showNotification(`Profile '${profileName}' has been created!`, 'success');
            }
        });
    } else {
        showNotification('Please enter a profile name.', 'error');
        profileNameInput.focus();
    }
});

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = type; 
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000);
}



document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.onProfilesLoaded((event, profiles) => {
        profiles.forEach(profile => {
            addProfileToList(profile); 
        });
    });
});
