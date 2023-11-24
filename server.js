const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const fs = require('fs');


function FillLeaderboardWithDummyData(){
    leaderboard = [
        { player: 'Alice', score: 5000 },
        { player: 'Bob', score: 4500 },
        { player: 'Charlie', score: 4000 },
        { player: 'Donald', score: 3600 },
        { player: 'Enzo', score: 3000 }
        // ... more entries
    ];
}

let leaderboard = [];

FillLeaderboardWithDummyData();

// Server routes setup
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Render the leaderboard page
app.get('/leaderboard', (req, res) => {
    res.render('leaderboard');
});
app.get('/', (req, res) => {
    res.render('leaderboard');
});

// Render the dashboard page
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

//event handling
io.on('connection', (socket) => {
    console.log('New client connected');

    // Send the current leaderboard to the newly connected client
    socket.emit('update-leaderboard', leaderboard);

    // Listen for an 'add-entry' message from this client
    socket.on('add-entry', (entry) => {
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score); // Optional: sort the leaderboard by score
        io.emit('update-leaderboard', leaderboard); // Broadcast the updated leaderboard
        saveLeaderboard(); // Call this after you modify the leaderboard array
    });

    // Listen for a 'delete-entry' message from this client
    socket.on('delete-entry', (index) => {
        if (index >= 0 && index < leaderboard.length) {
            leaderboard.splice(index, 1);
            io.emit('update-leaderboard', leaderboard); // Broadcast the updated leaderboard
            saveLeaderboard(); // Call this after you modify the leaderboard array
        }
    });

    // Server-side event listener for 'update-entry'
    socket.on('update-entry', (data) => {
        console.log('Received entry update request')
        const { index, player, score } = data;
        if (index >= 0 && index < leaderboard.length) {
            // Update the entry at the given index
            leaderboard[index] = { player, score };
            // Sort the leaderboard if needed
            leaderboard.sort((a, b) => b.score - a.score);
            // Emit the updated leaderboard to all clients
            io.emit('update-leaderboard', leaderboard);
            saveLeaderboard(); // Call this after you modify the leaderboard array

        }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// POST route to add a new entry
app.post('/AddEntry', (req, res) => {
    const { playername, score } = req.body;
    if (!playername || isNaN(parseFloat(score))) {
        return res.status(400).send('Invalid player name or score.');
    }

    // Create a new entry object
    const newEntry = { player: playername, score: parseFloat(score) };

    // Add to the leaderboard and sort
    leaderboard.push(newEntry);
    leaderboard.sort((a, b) => b.score - a.score);

    // Save the updated leaderboard to the JSON file
    saveLeaderboard();

    // Send back a response
    res.status(200).send('New entry added successfully.');
});

server.listen(3000, () => {
    console.log('Leaderboard Server is running on port 3000');
});

//region load/save to file
function loadLeaderboard() {
    try {
        const data = fs.readFileSync('./savedData.json', 'utf8');
        leaderboard = JSON.parse(data);
    } catch (err) {
        console.log('No existing data found, starting with an empty leaderboard');
        leaderboard = []; // If there's no file or a parsing error, start with an empty array
    }
}
function saveLeaderboard() {
    fs.writeFileSync('./savedData.json', JSON.stringify(leaderboard, null, 2), 'utf8');
}
// Load the leaderboard data from the file
loadLeaderboard();
//endregion

//region periodic backup in a backup folder

const backupInterval = 120000; // 2 minutes in milliseconds
function ensureBackupDirExists() {
    const backupsDir = './backups';
    if (!fs.existsSync(backupsDir)){
        fs.mkdirSync(backupsDir, { recursive: true });
    }
}

function backupLeaderboard() {
    const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons for filesystem compatibility
    const backupFilePath = `./backups/leaderboard-backup-${timestamp}.json`;
    fs.writeFileSync(backupFilePath, JSON.stringify(leaderboard, null, 2), 'utf8');
    console.log(`Backup saved at ${backupFilePath}`);
}

// Ensure backup directory exists on startup
ensureBackupDirExists();

// Set an interval to back up the leaderboard every 2 minutes
setInterval(() => {
    ensureBackupDirExists(); // Check if directory exists before backup
    backupLeaderboard();
}, backupInterval);
//endregion