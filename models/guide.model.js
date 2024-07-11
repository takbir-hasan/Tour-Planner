const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
    username: {type: String, require:true},
    name: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, required: true },
    image: { type: String, required: true },
    available: { type: Date, required: true },
    
});


module.exports = mongoose.model('Guide', guideSchema);