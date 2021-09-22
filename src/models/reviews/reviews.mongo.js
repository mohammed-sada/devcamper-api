const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(({
    title: {
        type: String,
        required: [true, "Please add a title"]
    },
    text: {
        type: String,
        required: [true, "Please add a text for the review"]
    },
    rating: {
        type: Number,
        required: [true, "Please add a review"],
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must not be more than 10"]
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: "Bootcamp",
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    }
}));


ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: "$bootcamp",
                averageRating: { $avg: "$rating" }
            }
        }
    ]);

    try {
        await this.model("Bootcamp").updateOne({
            _id: bootcampId
        }, {
            averageRating: Math.round(obj[0].averageRating)
        });
    } catch (err) {
        console.error(err);
    }
};

// Prevent user from submitting more than one review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

ReviewSchema.post("save", async function () {
    await this.constructor.getAverageRating(this.bootcamp);
});

ReviewSchema.pre("remove", async function () {
    await this.constructor.getAverageRating(this.bootcamp);
});


module.exports = mongoose.model("Review", ReviewSchema);