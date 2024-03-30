document.getElementById('addProfile').addEventListener('click', () => {
    const profileName = document.getElementById('profileName').value;
    if (profileName) {
        const profileList = document.getElementById('profileList');
        const li = document.createElement('li');
        li.textContent = profileName;

        // Create a button to start the profile
        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start';
        
        // Attach the click event listener to this button
        startBtn.addEventListener('click', () => {
            const message = document.createElement('p');
            message.textContent = `Profile '${profileName}' started!`;
            document.body.appendChild(message); // Append the message to the body
        });

        li.appendChild(startBtn);
        profileList.appendChild(li);

        // Clear the input after adding the profile
        document.getElementById('profileName').value = '';
    }
});
