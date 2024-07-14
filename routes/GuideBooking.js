const express = require('express');
const router = express.Router();
const GuideBookingHistory = require('../models/guideBookingHistory');

router.post('/book', async (req, res) => {
  try {
    const { user, guideName, place, date, price, rating = 0 } = req.body;

    console.log('Booking Data Received:', req.body);

    // Validate data
    if (!user || !guideName || !place || !date || !price ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create booking object
    const newBooking = new GuideBookingHistory({
      user,
      guideName,
      place,
      date,
      price,
      rating,
      review: null, // Initialize review as null or handle it as needed
      status: 'Booked' // Default status when a booking is made
    });

    // Save booking
    const savedBooking = await newBooking.save();
    console.log('Booking saved successfully:', savedBooking);

    res.status(201).json({ message: 'Guide booking successful', booking: savedBooking });
  } catch (error) {
    console.error('Error booking guide:', error);
    res.status(500).json({ error: 'Failed to book guide' });
  }
});

module.exports = router;
