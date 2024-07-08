const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide'); // Assuming this is where your Guide model is defined

// Route to fetch all guides
router.get('/', async (req, res) => {
    try {
        const guides = await Guide.find();
        //console.log('Guides fetched:', guides); // Log fetched guides to console
        res.json(guides);
    } catch (err) {
        console.error('Error fetching guides:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
