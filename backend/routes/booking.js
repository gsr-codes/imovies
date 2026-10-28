const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Booking = require('../models/Booking');

const router = express.Router();

// Verify logged-in user
async function authenticateUser(req, res, next) {
try {
const authHeader = req.headers.authorization;


if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return res.status(401).json({
    success: false,
    message: 'Please log in to continue.',
  });
}

const token = authHeader.split(' ')[1];

const decoded = jwt.verify(token, process.env.JWT_SECRET);

if (!mongoose.isValidObjectId(decoded.userId)) {
  return res.status(401).json({
    success: false,
    message: 'Invalid authentication token.',
  });
}

req.userId = decoded.userId;
next();


} catch (error) {
return res.status(401).json({
success: false,
message: 'Invalid or expired login session. Please log in again.',
});
}
}

// Create a booking
router.post('/', authenticateUser, async (req, res) => {
try {
const { movie, theatre, location, showtime, showDate, seats } = req.body;


if (!movie || !theatre || !location || !showtime || !showDate || !Array.isArray(seats) || seats.length === 0) {
  return res.status(400).json({
    success: false,
    message: 'Please provide movie, theatre, location, showtime, date and seats.',
  });
}

if (!seats.every(seat => typeof seat === 'string' && seat.trim())) {
  return res.status(400).json({
    success: false,
    message: 'Invalid seat selection.',
  });
}

const normalizedSeats = seats.map(seat => seat.trim());

if (new Set(normalizedSeats).size !== normalizedSeats.length) {
  return res.status(400).json({
    success: false,
    message: 'The same seat cannot be selected more than once.',
  });
}

const parsedDate = new Date(showDate);

if (Number.isNaN(parsedDate.getTime())) {
  return res.status(400).json({
    success: false,
    message: 'Please provide a valid show date.',
  });
}

// Check whether any selected seat is already booked for this show.
const existingBooking = await Booking.findOne({
  movie,
  theatre,
  location,
  showtime,
  showDate: parsedDate,
  seats: { $in: normalizedSeats },
});

if (existingBooking) {
  return res.status(409).json({
    success: false,
    message: 'One or more selected seats are already booked. Please select different seats.',
  });
}

const booking = await Booking.create({
  user: req.userId,
  movie,
  theatre,
  location,
  showtime,
  showDate: parsedDate,
  seats: normalizedSeats,
});

return res.status(201).json({
  success: true,
  message: 'Booking created successfully!',
  booking,
});


} catch (error) {
console.error('Booking creation error:', error.message);


return res.status(500).json({
  success: false,
  message: 'Unable to create booking.',
});


}
});

// Get bookings for the logged-in user
router.get('/my-bookings', authenticateUser, async (req, res) => {
try {
const bookings = await Booking.find({
user: req.userId,
}).sort({ createdAt: -1 });


return res.json({
  success: true,
  bookings,
});


} catch (error) {
console.error('Fetch bookings error:', error.message);


return res.status(500).json({
  success: false,
  message: 'Unable to retrieve bookings.',
});


}
});
// Get booked seats for a particular show
router.get('/booked-seats', async (req, res) => {
  try {
    const { movie, theatre, location, showtime, showDate } = req.query;

    if (!movie || !theatre || !location || !showtime || !showDate) {
      return res.status(400).json({
        success: false,
        message: 'Please provide movie, theatre, location, showtime and date.',
      });
    }

    const parsedDate = new Date(showDate);

    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid show date.',
      });
    }

    const bookings = await Booking.find({
      movie,
      theatre,
      location,
      showtime,
      showDate: parsedDate,
    }).select('seats');

    const bookedSeats = bookings.flatMap(booking => booking.seats);

    return res.json({
      success: true,
      bookedSeats,
    });
  } catch (error) {
    console.error('Fetch booked seats error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve booked seats.',
    });
  }
});
module.exports = router;
