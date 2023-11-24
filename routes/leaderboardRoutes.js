const express = require("express");
const router = express.Router();

router.get('/leaderboard', (req, res) => {
    res.render('leaderboard');
});

router.get('/', (req, res) => {
    res.render('leaderboard');
});

module.exports = router;