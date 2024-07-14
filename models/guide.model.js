const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    username: {type: String, require: true},
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true }, // Assuming image is stored as base64 string
    available: { type: String, required: true },
    
});

module.exports = mongoose.model('Guide', guideSchema);
