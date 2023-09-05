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
  // overview: String,
  // original_language: String,
  // language: String,
  // releaseDate: String,
  // runtime: Number,
  // genres: [String],
  // posterPath: String,
  // backdropPath: String,
  // popularity: Number,
  // voteAverage: Number,
  // voteCount: Number,
  // Add more fields as needed to store relevant movie data from TMDB
});

export const Movie = mongoose.model('Movie', movieSchema);

