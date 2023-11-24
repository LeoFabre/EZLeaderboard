const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const loadSave = require("./utils/LoadSave");
const events = require("./utils/events");
const bkp = require("./utils/backup")

//init leaderboard data
function FillLeaderboardWithDummyData(){
    global.leaderboard = [
        { player: 'Alice', score: 5000 },
        { player: 'Bob', score: 4500 },
        { player: 'Charlie', score: 4000 },
        { player: 'Donald', score: 3600 },
        { player: 'Enzo', score: 3000 }
        // ... more entries
    ];
}
// Instead of reassigning global.leaderboard, update it in place
global.leaderboard = [];
function updateLeaderboardWithData(loadedData) {
    // Clear the existing array
    global.leaderboard.length = 0;

    // Add the loaded data to the array
    loadedData.forEach(entry => global.leaderboard.push(entry));
}

const loadedData = loadSave.loadLeaderboard();
if (loadedData && Array.isArray(loadedData)) {
    updateLeaderboardWithData(loadedData);
} else {
    FillLeaderboardWithDummyData();
}

//setup routes
const leaderboardRoutes = require('./routes/leaderboardRoutes');
const dashboardRoute = require('./routes/dashboardRoute');
app.use(leaderboardRoutes);
app.use(dashboardRoute);

// Set up body parser middleware to handle URL-encoded and JSON bodies
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(express.json()); // For parsing application/json

const addEntryRoute = require('./routes/AddEntryRoute')(global.leaderboard, io);
app.use('/AddEntry', addEntryRoute);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

//event handling
io.on('connection', (socket) => events.OnNewClientConnected(socket, global.leaderboard, io));

server.listen(3000, () => {
    console.log('Leaderboard Server is running on port 3000');
});

const backupInterval = 120000; // 2 minutes in milliseconds
bkp.initBackup(backupInterval);

module.exports = {app, io, leaderboard};