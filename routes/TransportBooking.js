const express = require('express');
const router = express.Router();
const TransportBookingHistory = require('../models/transportBookingHistory');

// POST route to book transport
router.post('/book', async (req, res) => {
  //alert("came to route");
  try {
    const { user, transportName, place, date, passengers, price, rating = 0, image } = req.body;

    console.log('Booking Data Received:', req.body);

    // Validate data
    if (!user || !transportName || !place || !date || !passengers || !price ) {
      console.log("problem is here");
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create booking object
    const newBooking = new TransportBookingHistory({
      user,
      transportName,
      place,
      date,
      passengers,
      price,
      rating,
      review: null, // Initialize review as null or handle it as needed
      status: 'Booked', // Default status when a booking is made
      image
    });

    // Save booking
    const savedBooking = await newBooking.save();
    console.log('Booking saved successfully:', savedBooking);

    res.status(201).json({ message: 'Transport booking successful', booking: savedBooking });
  } catch (error) {
    console.error('Error booking transport:', error);
    res.status(500).json({ error: 'Failed to book transport' });
  }
});

module.exports = router;
