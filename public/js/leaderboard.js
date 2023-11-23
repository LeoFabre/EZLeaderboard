// JavaScript for the leaderboard page
const socket = io();

socket.on('update-leaderboard', (data) => {
    // Code to update the leaderboard on the page
    renderLeaderboard(data)
});

function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear existing entries
    leaderboardList.className = 'space-y-3'; // Add spacing between items

    // Iterate over the leaderboard data and create list items with Tailwind CSS classes
    leaderboardData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'flex justify-between items-center bg-white px-4 py-2 shadow rounded-lg'; // Style the list item

        const playerText = document.createTextNode(`Position ${index + 1}: ${entry.player} - `);
        listItem.appendChild(playerText);

        const scoreSpan = document.createElement('span');
        const scoreValue = parseFloat(entry.score).toFixed(2);
        scoreSpan.textContent = `Score: ${scoreValue}`;
        scoreSpan.className = 'font-bold'; // Style the score

        listItem.appendChild(playerText);
        listItem.appendChild(scoreSpan);

        leaderboardList.appendChild(listItem);
    });
}