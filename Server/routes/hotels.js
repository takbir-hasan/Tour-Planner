const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel'); // Assuming this is where your Hotel model is defined

// Route to fetch all Hotels
router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        //console.log('hotels fetched:', hotels); // Log fetched hotels to console
        res.json(hotels);
    } catch (err) {
        console.error('Error fetching hotels:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
