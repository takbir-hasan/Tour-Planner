const mongoose = require('mongoose');

const hotelBookingHistorySchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  hotelName: {
    type: String,
    required: true
  },
  place: {
    type: String,
    required: true
  },
  checkInDate: {
    type: String,
    required: true
  },
  checkOutDate: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  rating: {
    type: String,
    required: true
  },
  review: {
    type: String,
    default: null
  },
  status: {
    type: String,
    default: 'Booked'
  }
});

const HotelBookingHistory = mongoose.model('HotelBookingHistory', hotelBookingHistorySchema);

module.exports = HotelBookingHistory;
