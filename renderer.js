function addProfileToList(profileName) {
    const profileList = document.getElementById('profileList');
    const li = document.createElement('li');
    const profileText = document.createElement('span'); 
    profileText.textContent = profileName;
    li.textContent = profileName;

    const buttonContainer = document.createElement('div'); 

    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    startBtn.addEventListener('click', () => {
        const message = document.createElement('p');
        message.textContent = `Profile '${profileName}' started!`;
        document.body.appendChild(message);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        const message = document.createElement('p');
        message.textContent = `Profile '${profileName}' deleted!`;
        document.body.appendChild(message);
        li.remove(); 
        window.electronAPI.deleteProfile(profileName); 
    });

    buttonContainer .appendChild(startBtn); 
    buttonContainer .appendChild(deleteBtn); 
    li.appendChild(buttonContainer); 
    profileList.appendChild(li); 
}

document.getElementById('addProfile').addEventListener('click', () => {
    const profileNameInput = document.getElementById('profileName');
    const profileName = profileNameInput.value.trim(); 

    if (profileName) {
        window.electronAPI.createProfileDirectory(profileName, (exists) => {
            if (exists) {
                const message = document.createElement('p');
                message.textContent = `Profile '${profileName}' already exists!`;
                document.body.appendChild(message);
                profileNameInput.focus();
            } else {
                addProfileToList(profileName);
                profileNameInput.value = '';
                profileNameInput.focus(); 
            }
        });
    } else {
        alert("Please enter a profile name.");
        profileNameInput.focus(); 
    }
});


document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.onProfilesLoaded((event, profiles) => {
        profiles.forEach(profile => {
            addProfileToList(profile); 
        });
    });
});
