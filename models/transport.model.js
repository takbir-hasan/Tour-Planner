const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the transport schema
const transportSchema = new Schema({
  username: {type: String, require:true},
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  capacity: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  availableDates: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

module.exports = mongoose.model('Transport', transportSchema);
