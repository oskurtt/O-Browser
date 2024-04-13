function addProfileToList(profileName) {
    const profileList = document.getElementById('profileList');
    const li = document.createElement('li');
    li.textContent = profileName;

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
        li.remove(); // Remove the list item from the DOM
        window.electronAPI.deleteProfile(profileName); // Request the main process to delete the folder
    });

    li.appendChild(startBtn); // Append the "Start" button to the list item
    li.appendChild(deleteBtn); // Append the "Delete" button to the list item
    profileList.appendChild(li); // Append the list item to the profile list
}

document.getElementById('addProfile').addEventListener('click', () => {
    const profileNameInput = document.getElementById('profileName');
    const profileName = profileNameInput.value.trim(); // Use trim to ensure no leading/trailing whitespace

    if (profileName) {
        window.electronAPI.createProfileDirectory(profileName, (exists) => {
            if (exists) {
                const message = document.createElement('p');
                message.textContent = `Profile '${profileName}' already exists!`;
                document.body.appendChild(message);
                profileNameInput.focus(); // Refocus on the input field
            } else {
                addProfileToList(profileName); // Use the reusable function
                profileNameInput.value = ''; // Clear the input
                profileNameInput.focus(); // Immediately refocus on the input field
            }
        });
    } else {
        alert("Please enter a profile name.");
        profileNameInput.focus(); // Refocus on the input field if no name was entered
    }
});


document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.onProfilesLoaded((event, profiles) => {
        profiles.forEach(profile => {
            addProfileToList(profile); // Use the reusable function for each loaded profile
        });
    });
});
