import express from 'express'
import MoviesController from '../controllers/movies.controller.js'
import ReviewsController from "../controllers/reviews.controller.js"

const router = express.Router()
router.route('/').get(MoviesController.apiGetMovies)
router.route("/id/:id").get(MoviesController.apiGetMoviesById)
router.route("/ratings").get(MoviesController.apiGetRatings)

router
    .route("/review")
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview)
export default router