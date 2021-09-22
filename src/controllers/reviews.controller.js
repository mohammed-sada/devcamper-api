const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    getBootcampReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview } = require("../models/reviews/reviews.model");
const { getBootcamp } = require('../models/bootcamps/bootcamps.model');


const httpGetReviews = asyncHandler(async (req, res, next) => {
    if (req.params.bootcampId) {
        const reviews = await getBootcampReviews(req.params.bootcampId);
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }
    res.status(200).json(res.advancedResults);
});

const httpGetReview = asyncHandler(async (req, res, next) => {
    const review = await getReview({
        _id: req.params.id
    });
    if (!review) {
        return next(new ErrorResponse(`Review is not found with id: ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        data: review
    });
});

const httpCreateReview = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await getBootcamp({
        _id: req.params.bootcampId
    });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp is not found with id: ${req.params.id}`, 404));
    }

    const review = await createReview(req.body);

    res.status(201).json({
        success: true,
        data: review
    });
});

const httpUpdateReview = asyncHandler(async (req, res, next) => {
    const review = await getReview({
        _id: req.params.id
    });
    if (!review) {
        return next(new ErrorResponse(`Review is not found with id: ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to update this review`, 403));
    }

    await updateReview(req.params.id, req.body);

    res.status(200).json({
        success: true,
    });
});

const httpDeleteReview = asyncHandler(async (req, res, next) => {
    const review = await getReview({
        _id: req.params.id
    });
    if (!review) {
        return next(new ErrorResponse(`Review is not found with id: ${req.params.id}`, 404));
    }

    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to delete this review`, 403));
    }

    await deleteReview(req.params.id);

    res.status(200).json({
        success: true,
    });
});



module.exports = {
    httpGetReviews,
    httpGetReview,
    httpCreateReview,
    httpUpdateReview,
    httpDeleteReview
};
