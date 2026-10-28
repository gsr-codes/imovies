const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
{
user: {
type: mongoose.Schema.Types.ObjectId,
ref: 'User',
required: true,
},


movie: {
  type: String,
  required: true,
  trim: true,
},

theatre: {
  type: String,
  required: true,
  trim: true,
},

location: {
  type: String,
  required: true,
  trim: true,
},

showtime: {
  type: String,
  required: true,
  trim: true,
},

showDate: {
  type: Date,
  required: true,
},

seats: {
  type: [String],
  required: true,
  validate: {
    validator: function (seats) {
      return seats.length > 0 && new Set(seats).size === seats.length;
    },
    message: 'Select at least one unique seat.',
  },
},


},
{
timestamps: true,
}
);

module.exports = mongoose.model('Booking', bookingSchema);
