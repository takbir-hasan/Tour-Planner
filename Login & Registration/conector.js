const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin01:admin01@database.ibr7v7c.mongodb.net/?retryWrites=true&w=majority&appName=Database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Define a schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true, unique: true }
});

// Create a model
const User = mongoose.model('User', userSchema);
// const Driver = mongoose.model('Driver', userDSchema);
// const Manager = mongoose.model('Manager', userMSchema);
// const Guide = mongoose.model('Guide', userGSchema);

// Create and save a new user
const createUser = async () => {
  const user = new User({
    name: 'Khan Doe',
    age: 30,
    email: 'khan.doe@example.com'
  });

  try {
    const savedUser = await user.save();
    console.log('User saved:', savedUser);
  } catch (err) {
    console.error('Error saving user', err);
  }
};

// Call the createUser function
createUser();
