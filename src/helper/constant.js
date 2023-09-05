export default {
    MONGODB_CONNECTION_URL: process.env.MONGODB_CONNECTION_URL, //|| 'mongodb://localhost/day2movies',
    API_PREFIX:"v1",
    PORT: 5000,
    TMDB:{
        API_KEY: '10682f9f7e873f9fefa9c47949aca414',
        BASE_URL: 'https://api.themoviedb.org/3'
    }
}