const express = require('express');
const router = express.Router();
const HotelBookingHistory = require('../models/hotelBookingHistory');
const Hotel = require('../models/hotels.model');
const User = require("../models/user.model");
const nodemailer = require('nodemailer');


router.post('/book', async (req, res) => {
  try {
    const { user, hotelName, place, checkInDate, checkOutDate, price, rating = 0, image, serviceProvider } = req.body;

    // console.log('Booking Data Received:', req.body);

    // Validate data
    /* if(!user) console.log("user problem");
    if(!hotelName) console.log("hotel problem");
    if(!place) console.log("place problem");
    if(!date) console.log("date problem");
    if(!price) console.log("price problem"); */
    if (!user || !hotelName || !place || !checkInDate|| !checkOutDate|| !price || !serviceProvider ) {
      console.log("problem is here");
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create booking object
    const newBooking = new HotelBookingHistory({
      user,
      hotelName,
      place,
      checkInDate,
      checkOutDate,
      price,
      rating,
      review: null, // Initialize review as null or handle it as needed
      status: 'Booked', // Assuming 'Booked' as the default status
      image,
      serviceProvider
    });

    // Save booking
    const savedBooking = await newBooking.save();
    // console.log('Booking saved successfully:', savedBooking);
    const person = await User.findOne({username:
      serviceProvider
    })
    // email sent
    const message = `
           <h2>Your Booking Confirmation</h2>
                <p>Thank you for booking your Hotel with us!</p>
                <p><strong>Transport Name:</strong> ${savedBooking.user}</p>
                <p><strong>Location:</strong> ${savedBooking.hotelName}</p>
                <p><strong>Date:</strong> ${savedBooking.checkInDate}</p>
                <p><strong>Date:</strong> ${savedBooking.checkOutDate}</p>
                <p><strong>Place:</strong> ${savedBooking.place}</p>
                <p>We look forward to providing you with the best service!</p>
      `;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'searchbinary696@gmail.com',
        pass: 'xfxtxomunurvchmc'
      }
    });

    await transporter.sendMail({
      to: person.email,
      subject: 'Hotel Booking Confirmation ',
      html: message
    });


    res.status(201).json({ message: 'Hotel booking successful', booking: savedBooking });
  } catch (error) {
    console.error('Error booking hotel:', error);
    res.status(500).json({ error: 'Failed to book hotel' });
  }
});
router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
      return res.status(404).json({ error: 'Hotel not found' });
    }
    console.log("Hotel Deleted");

    res.json({ message: 'Hotel deleted successfully', hotel: deletedHotel });
  } catch (error) {
    console.error('Error deletHotel:', error);
    res.status(500).json({ error: 'Failed to delete hotel' });
  }
});

// Route to get all hotel booking histories
router.get('/history', async (req, res) => {
  console.log("History requested");
  try {
    const HotelHistories = await HotelBookingHistory.find();
    res.json(HotelHistories);
  } catch (err) {
    console.error('Error fetching hotel histories:', err);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;
