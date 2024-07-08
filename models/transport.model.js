const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the transport schema
const transportSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  availableDates: {
    type: [Date],
    required: true
  },
  location: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});


module.exports = mongoose.model('Transport', transportSchema);
