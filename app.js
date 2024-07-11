require("dotenv").config
const express = require("express");
const bcrypt = require('bcrypt')
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require('multer');
const path = require('path');
const { error } = require("console");
const app = express();
const dbURL = process.env.MongoDB;
const bodyParser = require("body-parser");
const User = require("./models/user.model");
// const Booking = require("./models/booking.model");

// Connect to MongoDB
mongoose.connect('mongodb+srv://admin01:admin01@database.ibr7v7c.mongodb.net/?retryWrites=true&w=majority&appName=Database', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

app.use(cors())
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));



app.use(express.static(path.join(__dirname, 'HomePage')));
app.get("/",(req,res)=>{
      res.sendFile(__dirname + "/./HomePage/homepage.html");
})
app.use(express.static(path.join(__dirname, 'Hotel Booking')));
app.get("/hotelbooking",(req,res)=>{
      res.sendFile(__dirname + "/./Hotel Booking/HotelBooking.html");
})
app.use(express.static(path.join(__dirname, 'Guide Booking')));
app.get("/guidebooking",(req,res)=>{
      res.sendFile(__dirname + "/./Guide Booking/index.html");
})
app.use(express.static(path.join(__dirname, 'transport part')));
app.get("/transportbooking",(req,res)=>{
      res.sendFile(__dirname + "/./transport part/index.html");
})
app.use(express.static(path.join(__dirname, 'Login & Registration')));
app.get("/login",(req,res)=>{
      res.sendFile(__dirname + "/./Login & Registration/LoginPage.html");
})
app.get("/registration",(req,res)=>{
      res.sendFile(__dirname + "/./Login & Registration/RegisterPage.html");
})
app.get("/edituserprofile",(req,res)=>{
      res.sendFile(__dirname + "/./Login & Registration/EditProfile.html");
})
app.use(express.static(path.join(__dirname, 'Profiles/TransportProfile/profile edit')));
app.get('/editdriverprofile', (req, res) => {
   res.sendFile(__dirname + "/./Profiles/TransportProfile/profile edit/ProfileEdit.html");
})
app.use(express.static(path.join(__dirname, 'Profiles/TransportProfile/service edit')));
app.get('/editdriverservice', (req, res) => {
   res.sendFile(__dirname + "/./Profiles/TransportProfile/service edit/ServiceEdit.html");
})
app.use(express.static(path.join(__dirname, 'Profiles/HotelManager')));
app.get('/editmanagerprofile', (req, res) => {
   res.sendFile(__dirname + "/./Profiles/HotelManager/EditHotelManagerProfile.html");
})
// app.get('/editguideprofile', (req, res) => {
//    res.sendFile(__dirname + "/./Profiles/HotelManager/EditHotelManagerProfile.html");
// })
app.use(express.static(path.join(__dirname, 'Profiles/HotelManager')));
app.get('/editmanagerservice', (req, res) => {
   res.sendFile(__dirname + "/./Profiles/HotelManager/EditHotelManagerService.html");
})
app.use(express.static(path.join(__dirname, 'Profiles/Guide/Edit Profile')));
app.get('/editguideprofile', (req, res) => {
  res.sendFile(__dirname + "/./Profiles/Guide/Edit Profile/EditProfile.html");
})
app.use(express.static(path.join(__dirname, 'Profiles/Guide/Edit Services')));
app.get('/editguideservice', (req, res) => {
  res.sendFile(__dirname + "/./Profiles/Guide/Edit Services/EditServices.html");
})


 
//signup
app.post('/upload', async (req, res) => {
  try {
    // console.log('Form submission received');
    // console.log('Body:', req.body);

    const user = new User({
      fullname: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      address: req.body.address,
      role: req.body.role,
      gender: req.body.gender,
      photo: req.body.photo, // Base64 photo
    });

    await user.save();
    res.json({ role: req.body.role });
   
  } catch (err) {
    console.error('Error saving user:', err);
    res.status(500).send(err);
  }
});

// Success route for different roles
app.get('/user-success', (req, res) => {
  res.sendFile(__dirname + "/./Login & Registration/UserProfile.html");
});
app.use(express.static(path.join(__dirname, 'Profiles/TransportProfile/driver profile')));
app.get('/transport-driver-success', (req, res) => {
  res.sendFile(__dirname + "/./Profiles/TransportProfile/driver profile/DriverProfile.html");
});
app.use(express.static(path.join(__dirname, 'Profiles/Guide/Profile')));
app.get('/guide-success', (req, res) => {
  res.sendFile(__dirname + "/./Profiles/Guide/Profile/profile.html");
});
app.use(express.static(path.join(__dirname, 'Profiles/HotelManager')));
app.get('/hotel-manager-success', (req, res) => {
  res.sendFile(__dirname + "/./Profiles/HotelManager/HotelManagerProfile.html");
});


// login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const user = await User.findOne({ username });


    if(user){
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          console.error('Error comparing passwords:', err);
        }
         else if (result) {
          console.log('Password matches!');
          res.json({ role: user.role });
          // Proceed with login
        } else {
          console.log('Password does not match.');
          // Handle failed login
          return res.status(401).json({ message: 'Incorrect username or password.' });
        }
      });
    }

     
  } catch (error) {
      res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// add hotels
const Hotel = require("./models/hotels.model");

app.get('/api/hotels', async (req, res) => {
  try {
      const hotels = await Hotel.find();
      res.json(hotels);
  } catch (err) {
      console.error('Error fetching hotels:', err);
      res.status(500).json({ message: 'Server error' });
  }
});

//add tranport
const Transport = require("./models/transport.model");

app.get('/api/transports', async (req, res) => {
  try {
      const tranports = await Transport.find();
      res.json(tranports);
  } catch (err) {
      console.error('Error fetching hotels:', err);
      res.status(500).json({ message: 'Server error' });
  }
});

// add guide
const Guide = require("./models/guide.model");
app.get('/api/guides', async (req, res) => {
  try {
      const guides = await Guide.find();
      res.json(guides);
  } catch (err) {
      console.error('Error fetching hotels:', err);
      res.status(500).json({ message: 'Server error' });
  }
});
//User Profile

//favicon
app.use(express.static(path.join(__dirname, '/')));

app.get('/favicon.png', (req, res) => {
    res.sendFile(path.join(__dirname, '/./favicon.png'));
});

//userprofile
app.get('/api/users',async(req,res)=>{
  const { username } = req.query;
  try {
    const users = await User.findOne({username:username});
    res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
      }
});
//update profile info
app.put('/api/users/:username', async (req, res) => {
  const { username } = req.params;
  const { fullname, email, phoneNumber, address, photo } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: username },
      { fullname, email, phoneNumber, address, photo },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser); 
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
});




//hotel service edit
app.post('/api/editHotelService', async (req, res) => {
  const { username, name, location, price, image, availableFrom, availableTo } = req.body;

  try {
    const hotel = await Hotel.findOne({ username });

    if (hotel) {
      const rating = hotel.rating;

      // Delete all existing records for the given username
      await Hotel.deleteMany({ username });

      // Create a new hotel record
      const newHotel = new Hotel({
        username,
        name,
        location,
        price,
        rating,
        image,
        availableFrom,
        availableTo
      });

      await newHotel.save();
    } else {
      // Create a new hotel record
      const newHotel = new Hotel({
        username,
        name,
        location,
        price,
        rating: 0,
        image,
        availableFrom,
        availableTo
      });

      await newHotel.save();
    }

    res.json({ success: true, message: 'Hotel created successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An error occurred' });
  }
});

app.get('/hmp',async(req,res)=>{
  const username = req.query.username;
  try {
    const user = await Hotel.findOne({ username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
      }
});
//transport service
app.post('/api/editdriverService', async (req, res) => {
  const { username, name, location, price, image, maxPassengers, available } = req.body;

  try {
    const driver = await Transport.findOne({ username });

    if (driver) {
      const rating = driver.rating;

      // Delete all existing records for the given username
      await Transport.deleteMany({ username });

      // Create a new hotel record
      const newDriver = new Transport({
        username,
        name,
        location,
        price,
        rating,
        image,
        maxPassengers,
        available
      });

      await newDriver.save();
    } else {
      // Create a new hotel record
      const newDriver = new Transport({
        username,
        name,
        location,
        price,
        rating: 0,
        image,
        maxPassengers,
        available
      });

      await newDriver.save();
    }

    res.json({ success: true, message: 'Hotel created successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An error occurred' });
  }
});

app.get('/alb',async(req,res)=>{
  const username = req.query.username;
  try {
    const user = await Transport.findOne({ username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
      }
});
// guide service edit
app.post('/api/editguideService', async (req, res) => {
  const { username, name, location, price, image, available } = req.body;

  try {
    const guide = await Guide.findOne({ username });

    if (guide) {
      const rating = guide.rating;

      // Delete all existing records for the given username
      await Guide.deleteMany({ username });

      // Create a new hotel record
      const newGuide = new Guide({
        username,
        name,
        location,
        price,
        rating,
        image,
        available
      });

      await newGuide.save();
    } else {
      // Create a new hotel record
      const newGuide = new Guide({
        username,
        name,
        location,
        price,
        rating: 0,
        image,
        available
      });

      await newGuide.save();
    }

    res.json({ success: true, message: 'Hotel created successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An error occurred' });
  }
});

app.get('/atb',async(req,res)=>{
  const username = req.query.username;
  try {
    const user = await Guide.findOne({ username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Server error' });
      }
});




//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://www.localhost:${PORT}`));
