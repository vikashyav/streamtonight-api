import express from "express";
import moviesController from "../controller/movies"

const router = express.Router();

router.get('/', moviesController.getMoviesList);
router.post('/save-new-movies', moviesController.saveTmdbMovies);
router.get("/get-tmdb-movies", moviesController.getTmdbMovies);

export default router;
