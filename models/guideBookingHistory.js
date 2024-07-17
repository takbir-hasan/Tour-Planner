const mongoose = require('mongoose');

const guideBookingHistorySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  guideName: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  review: {
    type: String,
    default: null  // Default value for review
  },
  status: {
    type: String,
    default: 'Booked'  // Default status when a booking is made
  },
  image: {
    type: String,
    default: null
  },
  serviceProvider: { 
    type: String, 
    required: true },
  flag: { 
    type: Number, 
    required: false,
    default:0 
     },
});

const guideBookingHistory = mongoose.model('guideBookingHistory', guideBookingHistorySchema);

module.exports = guideBookingHistory;
