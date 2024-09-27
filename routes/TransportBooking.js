const express = require('express');
const router = express.Router();
const TransportBookingHistory = require('../models/transportBookingHistory');
const Transport = require("../models/transport.model");
const User = require("../models/user.model");
const nodemailer = require('nodemailer');

// POST route to book transport
router.post('/book', async (req, res) => {
  //alert("came to route");
  try {
    const { user, transportName, place, date, passengers, price, rating = 0, image, serviceProvider } = req.body;

    // console.log('Booking Data Received:', req.body);

    // Validate data
    if (!user || !transportName || !place || !date || !passengers || !price || !serviceProvider) {
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
      image,
      serviceProvider
    });
    // Save booking
    const savedBooking = await newBooking.save();
    // console.log('Booking saved successfully:', savedBooking);

    const person = await User.findOne({
      username : serviceProvider
    })
    // console.log('person info: ',person);
    // email sent
    const message = `
           <h2>Booking Confirm</h2>
                <p><strong>${savedBooking.user}</strong>, booked you!</p>
                <p><strong>Date:</strong> ${savedBooking.date}</p>
                <p><strong>Place:</strong> ${savedBooking.place}</p>
                <p>We look forward to providing you with the best service!</p>
      `;


    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.Gmail,
        pass: process.env.Gmail_Password
      }
    });

    await transporter.sendMail({
      to: person.email,
      subject: 'Transport Booking Confirmation',
      html: message
    });

    res.status(201).json({ message: 'Transport booking successful', booking: savedBooking });
  } catch (error) {
    console.error('Error booking transport:', error);
    res.status(500).json({ error: 'Failed to book transport' });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTransport = await Transport.findByIdAndDelete(id);

    if (!deletedTransport) {
      return res.status(404).json({ error: 'Transport not found' });
    }
    console.log("Transport Deleted");

    res.json({ message: 'Transport deleted successfully', transport: deletedTransport });
  } catch (error) {
    console.error('Error deleting transport:', error);
    res.status(500).json({ error: 'Failed to delete transport' });
  }
});

// Route to get all hotel booking histories
router.get('/history', async (req, res) => {
  console.log("History requested");
  try {
    const TransportHistories = await TransportBookingHistory.find();
    res.json(TransportHistories);
  } catch (err) {
    console.error('Error fetching Transport histories:', err);
    res.status(500).json({ message: 'Server error' });
  }


});


module.exports = router;
