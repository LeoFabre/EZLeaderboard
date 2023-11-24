const fs = require('fs');

function loadLeaderboard() {
    try {
        const data = fs.readFileSync('./savedData.json', 'utf8');
        console.log('Found a save, loading data...')
        return JSON.parse(data);
    } catch (err) {
        console.log('No existing data found, starting with an empty leaderboard');
        return []; // If there's no file or a parsing error, start with an empty array
    }
}
function saveLeaderboard(leaderboard) {
    fs.writeFileSync('./savedData.json', JSON.stringify(leaderboard, null, 2), 'utf8');
}

module.exports = {
    loadLeaderboard,
    saveLeaderboard
};