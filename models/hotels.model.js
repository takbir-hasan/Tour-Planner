// models/Hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: String, required: true },
    description: { type: String, required: true },
    availableFrom: { type: String, required: true },
    availableTo: { type: String, required: true },
    id: { type: String, required: true, unique: true }
});

module.exports = mongoose.model('Hotel', hotelSchema);
