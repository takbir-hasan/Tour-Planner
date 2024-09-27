require("dotenv").config();
const express = require("express");
const crypto = require('crypto');
const nodemailer = require('nodemailer');
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

// Connect to MongoDB
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// middleware
app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.json());



app.use(express.static(path.join(__dirname, 'HomePage')));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/./HomePage/homepage.html");
})
app.use(express.static(path.join(__dirname, 'Hotel Booking')));
app.get("/hotelbooking", (req, res) => {
  res.sendFile(__dirname + "/./Hotel Booking/HotelBooking.html");
})
app.use(express.static(path.join(__dirname, 'Guide Booking')));
app.get("/guidebooking", (req, res) => {
  res.sendFile(__dirname + "/./Guide Booking/index.html");
})
app.use(express.static(path.join(__dirname, 'transport part')));
app.get("/transportbooking", (req, res) => {
  res.sendFile(__dirname + "/./transport part/index.html");
})
app.use(express.static(path.join(__dirname, 'Blogs')));
app.get("/blogs", (req, res) => {
  res.sendFile(__dirname + "/./Blogs/blog.html");
})
app.use(express.static(path.join(__dirname, 'Forget Password')));
app.get("/forgetPassword", (req, res) => {
  res.sendFile(__dirname + "/./Forget Password/forgetPassword.html");
})
app.use(express.static(path.join(__dirname, 'Reset password')));
app.get('/reset-password/:id/:token', (req, res) => {
  res.sendFile(__dirname + '/./Reset password/resetPassword.html');
});
app.use(express.static(path.join(__dirname, 'Login & Registration')));
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/./Login & Registration/LoginPage.html");
})
app.get("/registration", (req, res) => {
  res.sendFile(__dirname + "/./Login & Registration/RegisterPage.html");
})
app.get("/edituserprofile", (req, res) => {
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

// Route for handling forgot password request
const saltRounds = 10; // Number of salt rounds for bcrypt

app.post('/forgetPassword', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });
    // console.log('forget user', user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    // Hash the reset token using bcrypt
    const hashedResetToken = await bcrypt.hash(resetToken, saltRounds);
    // Store the hashed token and expiration time in the user model
    user.resetPasswordToken = hashedResetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    await user.save();

    // Send reset email with token
    const resetUrl = `http://localhost:3000/reset-password/${user._id}/${resetToken}`;

    const message = `
          <h1>You requested a password reset</h1>
          <p>Please click the following link to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a> 
      `;

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'searchbinary696@gmail.com',
        pass: 'xfxtxomunurvchmc'
      }
    });

    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: message
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Route to reset password
app.put('/reset-password/:id/:token', async (req, res) => {
  const { id, token } = req.params; // Extract token from the URL
  const { newPassword } = req.body; // Get new password from the request body

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Compare the provided token with the hashed token stored in the database
    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken);

    if (!isTokenValid || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    user.password = newPassword;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});


//signup
app.post('/upload', async (req, res) => {
  try {
  
    const existingUser = await User.findOne({
      $or: [
        { email: req.body.email },
        { username: req.body.username },
        { phoneNumber: req.body.phoneNumber }
      ]
    });

    if (existingUser) {
      let errorMessage = 'Account creation failed: ';
      if (existingUser.email === req.body.email) {
        errorMessage += 'Email already exists. ';
      }
      if (existingUser.username === req.body.username) {
        errorMessage += 'Username already exists. ';
      }
      if (existingUser.phoneNumber === req.body.phoneNumber) {
        errorMessage += 'Phone number already exists. ';
      }
      return res.status(401).json({ message: errorMessage });
    }
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
// Serve static files from the 'Review' directory
app.use(express.static(path.join(__dirname, 'Review')));

// Example route to serve 'page.html'
app.get('/api/review', (req, res) => {
  res.sendFile(path.join(__dirname, 'Review', 'page.html'));
});

// Example route to serve 'page.js'
app.get('/api/page.js', (req, res) => {
  res.set('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, 'Review', 'page.js'));
});



// login
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });


    if (user) {
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

app.get('/public/favicon.png', (req, res) => {
  res.sendFile(path.join(__dirname, '/./public/favicon.png'));
});

//userprofile
app.get('/api/users', async (req, res) => {
  const { username } = req.query;
  try {
    const users = await User.findOne({ username: username });
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
      const user = await User.findOne({ username });
      const rating = user.averageRating;

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
    }

    res.json({ success: true, message: 'Hotel created successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An error occurred' });
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
      const user = await User.findOne({ username });
      const rating = user.averageRating;

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
    }

    res.json({ success: true, message: 'Hotel created successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An error occurred' });
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
      const user = await User.findOne({ username });
      const rating = user.averageRating;

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
    }

    res.json({ success: true, message: 'Hotel created successfully' });

  } catch (error) {
    console.error('Error:', error);
    res.json({ success: false, message: 'An error occurred' });
  }
});


// Routes of Hotel Booking
const hotelBookingRoutes = require('./routes/HotelBooking');
app.use('/api/hotelBooking', hotelBookingRoutes);

//Hotel Booking History
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await HotelBookingHistory.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/bookings/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const bookings = await HotelBookingHistory.find({ user: username });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Cancel Booking Hotel from user
app.delete('/api/bookings/:username/:bookingId', async (req, res) => {
  try {
    const { username, bookingId } = req.params;

    const booking = await HotelBookingHistory.findOne({ user: username, _id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const hotelData = {
      username: booking.serviceProvider,
      name: booking.hotelName,
      location: booking.place,
      image: booking.image,
      price: booking.price,
      rating: booking.rating,
      description: booking.review,
      availableFrom: booking.checkInDate,
      availableTo: booking.checkOutDate,
      bookingId: booking._id
    };

    const newHotel = new Hotel(hotelData);
    await newHotel.save();

    const deletionResult = await HotelBookingHistory.deleteOne({ user: username, _id: bookingId });

    if (deletionResult.deletedCount === 1) {
      res.json({ message: 'Booking cancelled and added to hotel list successfully' });
    } else {
      console.error('Booking deletion failed');
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});
//Hotel Manager Info
app.get('/api/HotelManagerInfo/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const bookingHistory = await HotelBookingHistory.aggregate([
      {
        $match: { serviceProvider: username }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: 'username',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          hotelName: 1,
          checkOutDate: 1,
          'userInfo.fullname': 1,
          'userInfo.phoneNumber': 1
        }
      }
    ]);

    if (bookingHistory.length > 0) {
      res.json(bookingHistory);
    } else {
      res.status(404).json({ message: 'Booking history not found for this user' });
    }
  } catch (err) {
    console.error('Error fetching hotel booking history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

//Routes of Guide Booking
const guideBookingRoutes = require('./routes/GuideBooking');
app.use('/api/guideBooking', guideBookingRoutes);

//Guide Booking Histroy
app.get('/api/Guidebookings', async (req, res) => {
  try {
    const bookings = await guideBookingHistory.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/Guidebookings/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const bookings = await guideBookingHistory.find({ user: username });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Cancel Guide booking from user
app.delete('/api/Guidebookings/:username/:bookingId', async (req, res) => {
  try {
    const { username, bookingId } = req.params;

    const booking = await guideBookingHistory.findOne({ user: username, _id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const GuideData = {
      username: booking.serviceProvider,
      name: booking.guideName,
      location: booking.place,
      image: booking.image,
      price: booking.price,
      rating: booking.rating,
      description: booking.review,
      bookingId: booking._id,
      available: booking.date
    };

    const newGuide = new Guide(GuideData);
    await newGuide.save();

    const deletionResult = await guideBookingHistory.deleteOne({ user: username, _id: bookingId });

    if (deletionResult.deletedCount === 1) {
      res.json({ message: 'Booking cancelled and added to guide list successfully' });
    } else {
      console.error('Booking deletion failed');
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});
//Guide  Info
app.get('/api/GuideManagerInfo/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const bookingHistory = await guideBookingHistory.aggregate([
      {
        $match: { serviceProvider: username }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: 'username',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          guideName: 1,
          date: 1,
          'userInfo.fullname': 1,
          'userInfo.phoneNumber': 1
        }
      }
    ]);

    if (bookingHistory.length > 0) {
      res.json(bookingHistory);
    } else {
      res.status(404).json({ message: 'Booking history not found for this user' });
    }
  } catch (err) {
    console.error('Error fetching hotel booking history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


//Routes of transport
const transportBookingRoute = require('./routes/TransportBooking'); // Adjust the path as per your directory structure
const HotelBookingHistory = require("./models/hotelBookingHistory");
const guideBookingHistory = require("./models/guideBookingHistory");
const transportBookingHistory = require("./models/transportBookingHistory");
app.use('/api/transportBooking', transportBookingRoute);

//Transport Booking History
app.get('/api/Transportbookings', async (req, res) => {
  try {
    const bookings = await transportBookingHistory.find();
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.get('/api/Transportbookings/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const bookings = await transportBookingHistory.find({ user: username });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
//Cancel Transport booking from user
app.delete('/api/Transportbookings/:username/:bookingId', async (req, res) => {
  try {
    const { username, bookingId } = req.params;

    const booking = await transportBookingHistory.findOne({ user: username, _id: bookingId });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const TransportData = {
      username: booking.serviceProvider,
      name: booking.transportName,
      location: booking.place,
      image: booking.image,
      price: booking.price,
      rating: booking.rating,
      description: booking.review,
      bookingId: booking._id,
      available: booking.date,
      maxPassengers: booking.passengers
    };

    const newTransport = new Transport(TransportData);
    await newTransport.save();

    const deletionResult = await transportBookingHistory.deleteOne({ user: username, _id: bookingId });

    if (deletionResult.deletedCount === 1) {
      res.json({ message: 'Booking cancelled and added to transport list successfully' });
    } else {
      console.error('Booking deletion failed');
      res.status(500).json({ error: 'Failed to cancel booking' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
});
//TransportManagerInfo
app.get('/api/TransportManagerInfo/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const bookingHistory = await transportBookingHistory.aggregate([
      {
        $match: { serviceProvider: username }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: 'username',
          as: 'userInfo'
        }
      },
      {
        $unwind: '$userInfo'
      },
      {
        $project: {
          transportName: 1,
          date: 1,
          'userInfo.fullname': 1,
          'userInfo.phoneNumber': 1
        }
      }
    ]);

    if (bookingHistory.length > 0) {
      res.json(bookingHistory);
    } else {
      res.status(404).json({ message: 'Booking history not found for this user' });
    }
  } catch (err) {
    console.error('Error fetching hotel booking history:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// review update
app.post('/review', async (req, res) => {
  const { username, rating, review } = req.body;
  try {
    console.log('Searching for user:', username);
    const user = await User.findOne({ username }).select('-password');
    if (!user)
      return res.status(404).json({ error: 'User not found' });
    console.log(' Got the user:', username);

    if (rating) {
      const numericRating = parseFloat(rating); // Ensure rating is parsed as a number
      if (!isNaN(numericRating)) { // Check if rating is valid number
        user.totRating = user.totRating + numericRating;
        user.countRating = user.countRating + 1;
        user.averageRating = user.totRating / user.countRating;
      } else {
        return res.status(400).json({ error: 'Invalid rating format' });
      }

    }
    if (review)
      user.review.push(review);

    await user.save({ validateBeforeSave: false });

    res.status(200).json({ message: 'Review updated successfully', user });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});

// booking flag
app.post('/api/flag', async (req, res) => {
  const { id, service, rating, review } = req.body;
  try {
    if (service === 'hotel') {
      const hotel = await HotelBookingHistory.findById(id);
      if (hotel) {
        hotel.flag = 1;
        hotel.rating = rating;
        hotel.review = review;
        await hotel.save();
        console.log("Its working!!!!!!!!!");
      }
      else {
        return res.status(404).json({ error: 'Hotel not found' });
      }
    }
    else if (service === 'guide') {
      const guide = await guideBookingHistory.findById(id);
      if (guide) {
        guide.flag = 1;
        guide.rating = rating;
        guide.review = review;
        await guide.save();
        console.log("Its working!!!!!!!!!");
      }
      else {
        return res.status(404).json({ error: 'Guide not found' });
      }
    }
    else if (service === 'driver') {
      const transport = await transportBookingHistory.findById(id);
      if (transport) {
        transport.flag = 1;
        transport.rating = rating;
        transport.review = review;
        await transport.save();
        console.log("Its working!!!!!!!!!");
      }
      else {
        return res.status(404).json({ error: 'Driver not found' });
      }
    }
    else {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.status(200).json({ message: 'Flag updated successfully' });
  } catch (error) {
    console.error('Error updating data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }

});



//start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://www.localhost:${PORT}`));
