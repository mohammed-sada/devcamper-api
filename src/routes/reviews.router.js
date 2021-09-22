const express = require("express");

const {
    httpGetReviews,
    httpGetReview,
    httpCreateReview,
    httpUpdateReview,
    httpDeleteReview } = require("../controllers/reviews.controller");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const Review = require("../models/reviews/reviews.mongo");

const reviewsRouter = express.Router({ mergeParams: true });

reviewsRouter.route("/")
    .get(advancedResults(Review, { path: "bootcamp", select: "name description" }), httpGetReviews)
    .post(protect, authorize("user", "admin"), httpCreateReview);

reviewsRouter.route("/:id")
    .get(httpGetReview)
    .put(protect, authorize("user", "admin"), httpUpdateReview)
    .delete(protect, authorize("user", "admin"), httpDeleteReview);


module.exports = reviewsRouter;