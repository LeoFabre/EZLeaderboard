// JavaScript for the dashboard page
const socket = io();

// Function to render the leaderboard
function renderEditableLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear existing entries

    // Iterate over the leaderboard data and create rows with edit and delete options
    leaderboardData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'flex flex-col md:flex-row justify-between items-center bg-white px-4 py-2 shadow rounded-lg'; // Vertical on mobile, horizontal on md screens and up

        // Add position label
        const positionLabel = document.createElement('span');
        positionLabel.className = 'font-bold';
        positionLabel.textContent = `${index + 1}:`;

        // Add player name and score inputs with unique IDs and Tailwind CSS classes
        const nameInput = document.createElement('input');
        nameInput.value = entry.player;
        nameInput.id = `player-input-${index}`;
        nameInput.className = 'border-2 border-gray-200 rounded px-4 py-2 flex-1 my-1 md:my-0 md:mr-2'; // Add margin on mobile

        const scoreInput = document.createElement('input');
        scoreInput.type = 'number';
        scoreInput.value = parseFloat(entry.score).toFixed(2); // Format the value to two decimal places
        scoreInput.step = "0.01"; // Allows decimal values up to two places
        scoreInput.id = `score-input-${index}`;
        scoreInput.className = 'border-2 border-gray-200 rounded px-4 py-2 flex-1 my-1 md:my-0 md:mr-2'; // Add margin on mobile

        // Add save and delete buttons with Tailwind CSS classes
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'flex space-x-2 my-1 md:my-0';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.className = 'bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded';
        saveButton.onclick = () => saveEntry(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded';
        deleteButton.onclick = () => deleteEntry(index);

        buttonGroup.appendChild(saveButton);
        buttonGroup.appendChild(deleteButton);

        // Append all elements to the listItem
        listItem.appendChild(positionLabel);
        listItem.appendChild(nameInput);
        listItem.appendChild(scoreInput);
        listItem.appendChild(buttonGroup);

        leaderboardList.appendChild(listItem);
    });
}

// Function to save an entry after editing
function saveEntry(index) {
    // Use the unique IDs to select the inputs
    const playerInput = document.getElementById(`player-input-${index}`);
    const scoreInput = document.getElementById(`score-input-${index}`);

    if (playerInput && scoreInput) {
        socket.emit('update-entry', {
            index: index,
            player: playerInput.value,
            score: parseFloat(scoreInput.value) // Parse the input as a float
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

    const playerNameInput = document.getElementById('new-player-name');
    const playerScoreInput = document.getElementById('new-player-score');

    const playerName = playerNameInput.value.trim();
    const playerScore = playerScoreInput.value.trim();

    // Check if the player name or score is blank
    if (!playerName || !playerScore || isNaN(playerScore)) {
        alert('Please enter a valid player name and score.');
        return; // Do not proceed if validation fails
    }

    // Proceed to emit the event to add the new entry to the server
    socket.emit('add-entry', { player: playerName, score: parseFloat(playerScore) });

    // Clear the form fields
    playerNameInput.value = '';
    playerScoreInput.value = '';
}

// Listen for updates from the server to refresh the leaderboard
socket.on('update-leaderboard', (data) => {
    renderEditableLeaderboard(data);
});

// Attach event listener to the 'add new entry' form
document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('new-entry-form');
    form.addEventListener('submit', addNewEntry);
});
// Initial call to populate the leaderboard on page load
renderEditableLeaderboard([]);
