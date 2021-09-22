const Review = require("./reviews.mongo");

async function getBootcampReviews(bootcampId) {
    return await Review.find({
        bootcamp: bootcampId
    });
}

async function getReview(filter) {
    return await Review.findOne(filter);
}

async function createReview(review) {
    return await Review.create(review);
}

async function updateReview(id, newReview) {
    const review = await Review.updateOne({
        _id: id
    }, newReview);

    return review.modifiedCount === 1;
}

async function deleteReview(id) {
    const review = Review.findOne({
        _id: id
    });

    return await review.remove;
}

module.exports = {
    getBootcampReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
};