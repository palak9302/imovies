const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    screen: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    price: { type: Number, required: true, min: 0 },
    rows: { type: Number, default: 8, min: 1, max: 26 },
    cols: { type: Number, default: 10, min: 1, max: 30 },
    bookedSeats: { type: [String], default: [] },
  },
  { timestamps: true }
);

showtimeSchema.index({ movie: 1, startTime: 1 });

module.exports = mongoose.model('Showtime', showtimeSchema);
