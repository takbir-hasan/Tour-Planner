// models/Hotel.js
const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    username: {type: String, require:true},
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    description: { type: String, required: false },
    availableFrom: { type: String, required: true },
    availableTo: { type: String, required: true },  
});

module.exports = mongoose.model('Hotel', hotelSchema);
