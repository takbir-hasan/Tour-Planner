const express = require('express');
const router = express.Router();
const transportsData = require('../data/transportsData'); // Ensure this path is correct

// Route to fetch all transports
router.get('/', (req, res) => {
    res.json(transportsData);
});

module.exports = router;
