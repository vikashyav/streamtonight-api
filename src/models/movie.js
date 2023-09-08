const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug_url: {
    type :String,
    required: true
  },
  adult: Boolean,
  backdrop_path: String,
  genre_ids: [Number],
  id: Number,
  original_language: String,
  original_title: String,
  overview: String,
  popularity: Number,
  poster_path: String,
  release_date: Date,
  video: Boolean,
  vote_average: Number,
  vote_count: Number,
  main_content: String,
});

export const Movie = mongoose.model('Movie', movieSchema);

