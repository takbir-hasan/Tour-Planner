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
  price: {
    type: Number,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  maxPassengers: {
    type: Number,
    required: true
  },
  availableDates: {
    type: [Date],
    required: true
  } 
});


module.exports = mongoose.model('Transport', transportSchema);
