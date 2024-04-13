document.getElementById('addProfile').addEventListener('click', () => {
    const profileName = document.getElementById('profileName').value;
    if (profileName) {
        window.electronAPI.createProfileDirectory(profileName, (exists) => {
            if (exists) {
                alert(`${profileName} already exists!`);
            } else {
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

                li.appendChild(startBtn);
                profileList.appendChild(li);

                document.getElementById('profileName').value = ''; // Clear the input
            }
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.onProfilesLoaded((event, profiles) => {
        const profileList = document.getElementById('profileList');
        profiles.forEach(profile => {
            const li = document.createElement('li');
            li.textContent = profile;

            // Create a "Start" button for each profile loaded
            const startBtn = document.createElement('button');
            startBtn.textContent = 'Start';

            // Create a "Delete" button for each profile loaded
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';


            // Attach the click event listener to this button
            startBtn.addEventListener('click', () => {
                const message = document.createElement('p');
                message.textContent = `Profile '${profile}' started!`;
                document.body.appendChild(message); // Append the message to the body
            });

            // Attach the click event listener to the "Delete" button
            deleteBtn.addEventListener('click', () => {
                const message = document.createElement('p');
                message.textContent = `Profile '${profile}' deleted!`;
                document.body.appendChild(message); // Append the message to the body
                li.remove(); // Remove the list item from the DOM
                window.electronAPI.deleteProfile(profile); // Request the main process to delete the folder
            });

            li.appendChild(startBtn); // Append the "Start" button to the list item
            li.appendChild(deleteBtn);
            profileList.appendChild(li); // Append the list item to the profile list
        });
    });
});
