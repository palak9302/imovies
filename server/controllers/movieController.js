const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const asyncHandler = require('../middleware/asyncHandler');

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const clean = (body) => {
  const data = { ...body };
  if (typeof data.genre === 'string') {
    data.genre = data.genre.split(',').map((g) => g.trim()).filter(Boolean);
  }
  return data;
};

exports.getMovies = asyncHandler(async (req, res) => {
  const { search, genre } = req.query;
  const filter = {};
  if (search) filter.title = { $regex: escapeRegex(String(search)), $options: 'i' };
  if (genre) filter.genre = String(genre);
  const movies = await Movie.find(filter).sort({ createdAt: -1 });
  res.json(movies);
});

exports.getMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
});

exports.createMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.create(clean(req.body));
  res.status(201).json(movie);
});

exports.updateMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(req.params.id, clean(req.body), {
    new: true,
    runValidators: true,
  });
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  res.json(movie);
});

exports.deleteMovie = asyncHandler(async (req, res) => {
  const movie = await Movie.findByIdAndDelete(req.params.id);
  if (!movie) return res.status(404).json({ message: 'Movie not found' });
  await Showtime.deleteMany({ movie: movie._id });
  res.json({ message: 'Movie and its showtimes deleted' });
});
