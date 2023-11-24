const express = require("express");
const router = express.Router();

// Render the dashboard page
router.get('/dashboard', (req, res) => {
    res.render('dashboard');
});

module.exports = router;
