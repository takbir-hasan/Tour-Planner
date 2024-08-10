const express = require('express');
const router = express.Router();
const GuideBookingHistory = require('../models/guideBookingHistory');
const Guide = require('../models/guide.model');

router.post('/book', async (req, res) => {
  try {
    const { user, guideName, place, date, price, rating = 0, image, serviceProvider } = req.body;

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
      status: 'Booked', // Default status when a booking is made
      image,
      serviceProvider
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

router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedGuide = await Guide.findByIdAndDelete(id);

    if (!deletedGuide) {
      return res.status(404).json({ error: 'Guide not found' });
    }
    console.log("Guide Deleted");

    res.json({ message: 'Guide deleted successfully', guide: deletedGuide });
  } catch (error) {
    console.error('Error deleting guide:', error);
    res.status(500).json({ error: 'Failed to delete guide' });
  }
});

// Route to get all hotel booking histories
router.get('/history', async (req, res) => {
  console.log("History requested");
  try {
    const GuideHistories = await GuideBookingHistory.find();
    res.json(GuideHistories);
  } catch (err) {
    console.error('Error fetching Guide histories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
