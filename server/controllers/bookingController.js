const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const asyncHandler = require('../middleware/asyncHandler');

const MAX_SEATS = 8;

const validSeat = (seat, rows, cols) => {
  const m = /^([A-Z])(\d{1,2})$/.exec(seat);
  if (!m) return false;
  const r = m[1].charCodeAt(0) - 65;
  const c = Number(m[2]);
  return r < rows && c >= 1 && c <= cols;
};

exports.createBooking = asyncHandler(async (req, res) => {
  const { showtimeId, seats } = req.body;
  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    return res.status(400).json({ message: 'Choose at least one seat' });
  }
  const uniqueSeats = [...new Set(seats.map(String))];
  if (uniqueSeats.length > MAX_SEATS) {
    return res.status(400).json({ message: `You can book at most ${MAX_SEATS} seats at a time` });
  }

  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
  if (showtime.startTime < new Date()) {
    return res.status(400).json({ message: 'This show has already started' });
  }
  if (!uniqueSeats.every((s) => validSeat(s, showtime.rows, showtime.cols))) {
    return res.status(400).json({ message: 'One or more seats are invalid' });
  }

  // Atomic check-and-reserve: matches only if none of the seats are taken yet,
  // so two people clicking the same seat at once can never both succeed.
  const reserved = await Showtime.findOneAndUpdate(
    { _id: showtimeId, bookedSeats: { $nin: uniqueSeats } },
    { $push: { bookedSeats: { $each: uniqueSeats } } },
    { new: true }
  );
  if (!reserved) {
    return res
      .status(409)
      .json({ message: 'Some of these seats were just booked by someone else. Pick different seats.' });
  }

  try {
    const booking = await Booking.create({
      user: req.user._id,
      movie: showtime.movie,
      showtime: showtime._id,
      seats: uniqueSeats,
      totalAmount: uniqueSeats.length * showtime.price,
    });
    res.status(201).json(booking);
  } catch (err) {
    // roll back the reservation if saving the booking failed
    await Showtime.updateOne({ _id: showtimeId }, { $pull: { bookedSeats: { $in: uniqueSeats } } });
    throw err;
  }
});

exports.myBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('movie', 'title poster language duration')
    .populate('showtime', 'screen startTime price')
    .sort({ createdAt: -1 });
  res.json(bookings);
});

exports.cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
  if (!booking) return res.status(404).json({ message: 'Booking not found' });
  if (booking.status === 'cancelled') return res.status(400).json({ message: 'Booking is already cancelled' });

  const showtime = await Showtime.findById(booking.showtime);
  if (showtime && showtime.startTime < new Date()) {
    return res.status(400).json({ message: 'Past shows cannot be cancelled' });
  }
  if (showtime) {
    await Showtime.updateOne({ _id: showtime._id }, { $pull: { bookedSeats: { $in: booking.seats } } });
  }
  booking.status = 'cancelled';
  await booking.save();
  res.json(booking);
});
