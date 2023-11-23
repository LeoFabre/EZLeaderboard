// JavaScript for the leaderboard page
const socket = io();

socket.on('update-leaderboard', (data) => {
    // Code to update the leaderboard on the page
    renderLeaderboard(data)
});

function renderLeaderboard(leaderboardData) {
    const leaderboardList = document.getElementById('leaderboard');
    leaderboardList.innerHTML = ''; // Clear existing entries

    // Iterate over the leaderboard data and create list items with Tailwind CSS classes
    leaderboardData.forEach((entry, index) => {
        const listItem = document.createElement('li');
        let bgClass = 'bg-gray-800'; // Default background
        let textSizeClass = 'text-base'; // Default text size
        let sizesAndMargins = "mr-10 ml-10"

        // Assign special classes for the top three entries
        if (index === 0) { // First place
            bgClass = 'bg-gradient-to-br from-yellow-300 to-amber-500';
            textSizeClass = 'text-xl font-bold';
            sizesAndMargins = "py-5";
        } else if (index === 1) { // Second place
            bgClass = 'bg-gradient-to-br from-gray-300 to-gray-600';
            textSizeClass = 'text-lg font-bold';
            sizesAndMargins = "mr-3 ml-3 py-4"
        } else if (index === 2) { // Third place
            bgClass = 'bg-gradient-to-br from-orange-400 to-red-600';
            textSizeClass = 'text-lg font-bold';
            sizesAndMargins = "mr-6 ml-6 py-3"
        }

        // Update the listItem class with the special classes for top three
        listItem.className = `flex justify-between items-center ${bgClass} px-4 py-2 shadow rounded-lg mt-2 ${sizesAndMargins}`;

        const playerText = document.createElement('span');
        playerText.textContent = `Position ${index + 1}: ${entry.player}`;
        // Apply the text size class
        playerText.className = `flex-1 ${textSizeClass}`;

        const scoreSpan = document.createElement('span');
        const scoreValue = parseFloat(entry.score).toFixed(2);
        scoreSpan.textContent = `Score: ${scoreValue}`;
        // Apply the bold and text size class to the score as well
        scoreSpan.className = `font-bold ${textSizeClass}`;

        listItem.appendChild(playerText);
        listItem.appendChild(scoreSpan);

        leaderboardList.appendChild(listItem);
    });
}
