const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, default: '' },
    genre: { type: [String], default: [] },
    language: { type: String, default: 'English' },
    duration: { type: Number, required: [true, 'Duration (minutes) is required'], min: 1 },
    rating: { type: Number, min: 0, max: 10, default: 0 },
    poster: { type: String, default: '' },
    releaseDate: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
