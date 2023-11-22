// JavaScript for the dashboard page
const socket = io();

// Function to render the leaderboard
function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear existing entries

    // Iterate over the leaderboard data and create rows with edit and delete options
    leaderboardData.forEach((entry, index) => {
        const listItem = document.createElement('li');

        // Add player name and score inputs with unique IDs
        const nameInput = document.createElement('input');
        nameInput.value = entry.player;
        nameInput.id = `player-input-${index}`; // Set unique ID for player input

        const scoreInput = document.createElement('input');
        scoreInput.type = 'number';
        scoreInput.value = entry.score;
        scoreInput.id = `score-input-${index}`; // Set unique ID for score input

        // Add save button
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.onclick = () => saveEntry(index);

        // Add delete button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteEntry(index);

        listItem.appendChild(document.createTextNode(`Position ${index + 1}: `));
        listItem.appendChild(nameInput);
        listItem.appendChild(document.createTextNode(' - Score: '));
        listItem.appendChild(scoreInput);
        listItem.appendChild(saveButton);
        listItem.appendChild(deleteButton);

        leaderboardList.appendChild(listItem);
        console.log(`Setting up input with ID: player-input-${index}`);
    });

    // Add form to add a new entry
    const addForm = document.createElement('form');
    addForm.onsubmit = addNewEntry;

    const nameInput = document.createElement('input');
    nameInput.placeholder = 'Player name';
    const scoreInput = document.createElement('input');
    scoreInput.type = 'number';
    scoreInput.placeholder = 'Score';

    const addButton = document.createElement('button');
    addButton.type = 'submit';
    addButton.textContent = 'Add';

    addForm.appendChild(nameInput);
    addForm.appendChild(scoreInput);
    addForm.appendChild(addButton);

    leaderboardList.appendChild(addForm);
}

// Function to save an entry after editing
function saveEntry(index) {
    // Use the unique IDs to select the inputs
    const playerInput = document.getElementById(`player-input-${index}`);
    const scoreInput = document.getElementById(`score-input-${index}`);

    if (playerInput && scoreInput) {
        // If the elements are found, emit the update-entry event
        socket.emit('update-entry', {
            index: index,
            player: playerInput.value,
            score: parseInt(scoreInput.value, 10)
        });
    } else {
        console.error('Element not found for index:', index);
    }
}

// Function to delete an entry
function deleteEntry(index) {
    // Emit an event to delete the entry on the server
    socket.emit('delete-entry', index);
}

// Function to handle the new entry form submission
function addNewEntry(event) {
    event.preventDefault();
    const playerName = event.target[0].value;
    const score = parseInt(event.target[1].value, 10);

    // Emit an event to add the new entry to the server
    socket.emit('add-entry', { player: playerName, score: score });

    // Clear the form fields
    event.target[0].value = '';
    event.target[1].value = '';
}

// Listen for updates from the server to refresh the leaderboard
socket.on('update-leaderboard', (data) => {
    renderLeaderboard(data);
});

// Initial call to populate the leaderboard on page load
renderLeaderboard([]);
