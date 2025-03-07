import { query } from "express"
import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId

let movies

export default class MoviesDAO{
    static async injectDB(conn){
        if(movies){
            return
        }
        try{
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('movies')
        }
        catch(e){
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }
    static async getMovies({
        filters = null,
        page = 0,
        moviesPerPage = 20,
    } = {}) {
        let query = {};
        if(filters){
            if("title" in filters){
                query = { $text: { $search: filters['title']}}
            }else if("rated" in filters){
                query = { "rated": { $eq: filters['rated']}}
            }
        }
        let cursor
        try{
                cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return {moviesList, totalNumMovies}
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList:[], totalNumMovies: 0}
        }
    }
    static async getRatings(){
        let ratings = []
        try{
            ratings = await movies.distinct("rated")
            return ratings
        }
        catch(e){
            console.error(`unable to get ratings, ${e}`)
            return ratings
        }
    }
    static async getMovieById(id){
        try{
            if (!ObjectId.isValid(id)){
                console.error(`Invalid ObjectId: ${id}`);
                return { error: "Invalid movie ID format" };
            }

            const movie = await movies.aggregate([
                {
                    $match: { _id: new ObjectId(id) }
                },
                {$lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()

            if (!movie){
                return { error: "Movie not found" }
            }

            return movie;
        }
        catch(e){
            console.error(`Error in getMovieById: ${e}`)
            return { error: e.message }
        }
    }
}