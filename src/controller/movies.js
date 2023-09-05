import axios from 'axios';
import constant from '../helper/constant';
import {Movie} from "../models/movie";
import expressAsyncHandler from 'express-async-handler';
class moviesController{

  getMoviesList =expressAsyncHandler((req, res, next)=>{
    const { page, limit, genre } = req.query;
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    // Calculate the number of documents to skip based on the page and limit
    const skip = (pageNumber - 1) * limitNumber;

    let payload={};
    const genreIdsToFilter = genre ? genre.split(',').map(Number) : [];
    if (genreIdsToFilter.length > 0) {
      payload = {
        ...payload,
        genre_ids: { $in: genreIdsToFilter }
      }
    }
    Movie.countDocuments(payload).then( async (total_results)=>{
      const movies = await Movie.find(payload)
      .skip(skip)
      .limit(limitNumber);
      return {data: movies ,  total_results}
    }).then(({data,  total_results})=>{
      res.status(200).send({
        results: data,
        total_pages: Math.ceil(total_results / limitNumber),
        total_results,
      });
    })
  })
    saveTmdbMovies= async (req, res, next)=>{
        const {  } = req.params;
        const {page, base_url, ...restQueryy}= req.query;
        // const apiKey = 'YOUR_TMDB_API_KEY'; // Replace with your TMDB API key
      // ?api_key=${apiKey}&page=${page}

        await axios.get(`${constant.TMDB.BASE_URL}/movie/popular`,{
            params: {
                api_key: constant.TMDB.API_KEY,
                page: page ? page : 1,
            }
        })
        .then(async (response)=>{
            // Make a request to TMDB API to fetch a page of movies        
            const movies = response.data.results;
        
            // Create an array to store the update operations
            const updateOperations = [];
        
            for (const movieData of movies) {
              const {id, ...restData}= movieData;
              const tmdbId = movieData.id;
        
              // Define the update operation for each movie
              const updateOperation = {
                updateOne: {
                  filter: { tmdbId }, // Find movie by TMDB ID
                  update: {
                    $setOnInsert: { // Set values only if the document is inserted (i.e., movie is new)
                      tmdbId,
                      ...restData
                      // title: movieData.title,
                      // overview: movieData.overview,
                      // releaseDate: movieData.release_date,
                      // Add more fields as needed to map TMDB data
                    },
                  },
                  upsert: true, // Create a new document if it doesn't exist
                },
              };
        
              updateOperations.push(updateOperation);
            }
        
            // Use Mongoose's updateMany to perform the bulk update/insert
            // await Movie.default.
            await Movie.bulkWrite(updateOperations);
        
            res.status(200).json({ message: `New movies from page ${page} saved successfully` });
          }).catch(next);
       
      }

      getTmdbMovies = (req, res, next)=>{
        const {page, base_url, ...restQueryy}= req.query;

        axios.get(`${constant.TMDB.BASE_URL}/movie/popular`,{
          params: {
              api_key: constant.TMDB.API_KEY,
              page: page ? page : 1,
          }
      }).then((data)=>{
        // console.log("data.....", data.data);
        res.status(200).send(data.data)
      }).catch(next)
      }
}

export default new moviesController();