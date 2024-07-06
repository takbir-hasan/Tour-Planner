const express = require('express');
const router = express.Router();
const hotelsData = require('../data/hotelsData'); // Assuming this file exists and exports hotel data

// Route to fetch all hotels
router.get('/', (req, res) => {
    res.json(hotelsData);
});

module.exports = router;
