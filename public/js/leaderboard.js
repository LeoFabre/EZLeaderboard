// JavaScript for the leaderboard page
const socket = io();

socket.on('update-leaderboard', (data) => {
    // Code to update the leaderboard on the page
    renderLeaderboard(data)
});

function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear existing entries

    // Iterate over the leaderboard data and create list items
    leaderboardData.forEach(entry => {
        const listItem = document.createElement('li');
        listItem.textContent = `Position ${entry.position}: ${entry.player} - Score: ${entry.score}`;
        leaderboardList.appendChild(listItem);
    });
}