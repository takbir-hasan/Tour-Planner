const express = require('express');
const router = express.Router();
const guidesData = require('../data/guidesData'); // Assuming this file exists

// Route to fetch all guides
router.get('/', (req, res) => {
    res.json(guidesData);
});

module.exports = router;
