const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: String, required: true },
    image: { type: String, required: true }, // Assuming image is stored as base64 string
    availableDates: { type: String, required: true },
    pricePerDay: { type: String, required: true }
});

module.exports = mongoose.model('Guide', guideSchema);
