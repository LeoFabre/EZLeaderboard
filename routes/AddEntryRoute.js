// AddEntryRoute.js
module.exports = function(leaderboard, io) {
    const express = require("express");
    const loadSave = require("../utils/LoadSave");
    const router = express.Router();

    router.post('/', (req, res) => { // <-- Note the change here to '/'
        const { playername, score } = req.body;
        if (!playername || isNaN(parseFloat(score))) {
            return res.status(400).send('Invalid player name or score.');
        }

        // Create a new entry object
        const newEntry = { player: playername, score: parseFloat(score) };

        // Add to the leaderboard and sort
        leaderboard.push(newEntry);
        leaderboard.sort((a, b) => a.score - b.score);

        // Save the updated leaderboard to the JSON file
        loadSave.saveLeaderboard(leaderboard);

        io.emit('update-leaderboard', leaderboard);
        // Send back a response
        res.status(200).send('New entry added successfully.');
    });

    return router;
};
