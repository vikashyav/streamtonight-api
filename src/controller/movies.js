import axios from 'axios';
import constant from '../helper/constant';
import {Movie} from "../models/movie";
import expressAsyncHandler from 'express-async-handler';
import slugify from '../utils/slugify';
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
        page,
        results: data,
        total_pages: Math.ceil(total_results / limitNumber),
        total_results,
      });
    })
  })

    saveTmdbMovies= async (req, res, next)=>{
        const {  } = req.params;
        const {page, base_url, ...restQueryy }= req.query;
        // const apiKey = 'YOUR_TMDB_API_KEY'; // Replace with your TMDB API key
      // ?api_key=${apiKey}&page=${page}

    //   const bollywoodQuery= {
    //     certification_country: "IN",
    //     with_original_language: "hi",
    //     "release_date.gte": moment().subtract(1, 'year').startOf('year').format("YYYY-MM-DD") || "2023-01-01",
    //     "release_date.lte": moment().add(1, 'week').format("YYYY-MM-DD") || "2023-08-16",
    // }
        await axios.get(`${constant.TMDB.BASE_URL}/movie/popular`,{
            params: {
                api_key: constant.TMDB.API_KEY,
                page: page ? page : 1,
                ...restQueryy
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

              const slugifyUrl = `${slugify(`${(restData?.title || restData?.original_title)} ${constant.MOVIE_PAGE.SEO_MOVIE_URL}`)}`;
        
              // Define the update operation for each movie
              const updateOperation = {
                updateOne: {
                  filter: { tmdbId }, // Find movie by TMDB ID
                  update: {
                    $setOnInsert: { // Set values only if the document is inserted (i.e., movie is new)
                      tmdbId,
                      slug_url: slugifyUrl,
                      ...restData
                    },
                  },
                  upsert: true, // Create a new document if it doesn't exist
                },
              };
              updateOperations.push(updateOperation);
            }
            // Use Mongoose's updateMany to perform the bulk update/insert
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