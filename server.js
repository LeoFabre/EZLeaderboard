const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let leaderboard = [
    { player: 'Alice', score: 5000 },
    { player: 'Bob', score: 4500 },
    { player: 'Charlie', score: 4000 }
    // ... more entries
];

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(express.static('public')); // Serve static files from 'public' directory

// Render the leaderboard page
app.get('/leaderboard', (req, res) => {
    res.render('leaderboard');
});

// Render the dashboard page
app.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

io.on('connection', (socket) => {
    console.log('New client connected');

    // Send the current leaderboard to the newly connected client
    socket.emit('update-leaderboard', leaderboard);

    // Listen for an 'add-entry' message from this client
    socket.on('add-entry', (entry) => {
        leaderboard.push(entry);
        leaderboard.sort((a, b) => b.score - a.score); // Optional: sort the leaderboard by score
        io.emit('update-leaderboard', leaderboard); // Broadcast the updated leaderboard
    });

    // Listen for a 'delete-entry' message from this client
    socket.on('delete-entry', (index) => {
        if (index >= 0 && index < leaderboard.length) {
            leaderboard.splice(index, 1);
            io.emit('update-leaderboard', leaderboard); // Broadcast the updated leaderboard
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
        }
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3000, () => {
    console.log('Leaderboard Server is running on port 3000');
});
