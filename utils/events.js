const loadSave = require("./LoadSave");

function OnReceivedAddEntry(entry, leaderboard, io) {
    if (!entry.player || isNaN(parseFloat(entry.score))) {
        console.error('Invalid entry data');
        return;
    }

    leaderboard.push(entry);
    leaderboard.sort((a, b) => b.score - a.score);
    io.emit('update-leaderboard', leaderboard);
    try {
        loadSave.saveLeaderboard(leaderboard);
    } catch (err) {
        console.error('Failed to save leaderboard:', err);
    }
}

function OnReceivedDeleteEntry(index, leaderboard, io) {
    if (index >= 0 && index < leaderboard.length) {
        leaderboard.splice(index, 1);
        io.emit('update-leaderboard', leaderboard);
        try {
            loadSave.saveLeaderboard(leaderboard);
        } catch (err) {
            console.error('Failed to save leaderboard:', err);
        }
    } else {
        console.error('Invalid index for delete:', index);
    }
}

function OnReceivedUpdateEntry(data, leaderboard, io) {
    const { index, player, score } = data;
    if (index >= 0 && index < leaderboard.length && player && !isNaN(parseFloat(score))) {
        leaderboard[index] = { player, score };
        leaderboard.sort((a, b) => b.score - a.score);
        io.emit('update-leaderboard', leaderboard);
        try {
            loadSave.saveLeaderboard(leaderboard);
        } catch (err) {
            console.error('Failed to save leaderboard:', err);
        }
    } else {
        console.error('Invalid data for update:', data);
    }
}

function OnNewClientConnected(socket, leaderboard, io) {
    console.log('New Client connected');

    socket.emit('update-leaderboard', leaderboard);

    socket.on('add-entry', (entry) => OnReceivedAddEntry(entry, leaderboard, io));
    socket.on('delete-entry', (index) => OnReceivedDeleteEntry(index, leaderboard, io));
    socket.on('update-entry', (data) => OnReceivedUpdateEntry(data, leaderboard, io));

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
}

module.exports = { OnNewClientConnected };
