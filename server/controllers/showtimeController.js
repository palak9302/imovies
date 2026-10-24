const Showtime = require('../models/Showtime');
const Movie = require('../models/Movie');
const asyncHandler = require('../middleware/asyncHandler');

// Upcoming showtimes for a movie
exports.getByMovie = asyncHandler(async (req, res) => {
  const showtimes = await Showtime.find({
    movie: req.params.movieId,
    startTime: { $gte: new Date() },
  }).sort({ startTime: 1 });
  res.json(showtimes);
});

// One showtime (the seat map polls this for real-time availability)
exports.getOne = asyncHandler(async (req, res) => {
  const showtime = await Showtime.findById(req.params.id).populate('movie');
  if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
  res.json(showtime);
});

exports.createShowtime = asyncHandler(async (req, res) => {
  const { movie, screen, startTime, price, rows, cols } = req.body;
  if (!(await Movie.exists({ _id: movie }))) return res.status(404).json({ message: 'Movie not found' });
  const showtime = await Showtime.create({ movie, screen, startTime, price, rows, cols });
  res.status(201).json(showtime);
});

exports.deleteShowtime = asyncHandler(async (req, res) => {
  const showtime = await Showtime.findByIdAndDelete(req.params.id);
  if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
  res.json({ message: 'Showtime deleted' });
});
