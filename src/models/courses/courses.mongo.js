const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, "Please add a title"],
    },
    description: {
        type: String,
        required: [true, "Please add a description"]
    },
    weeks: {
        type: String,
        required: [true, "Please add number of weeks"]
    },
    tuition: {
        type: Number,
        required: [true, "Please add a tuition cost"]
    },
    minimumSkill: {
        type: String,
        enum: ["beginner", "intermediate", "advanced", "all levels"],
        required: [true, "Please add a minimum skill"]
    },
    scholarshipAvailable: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
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
});

CourseSchema.statics.getAverageCost = async function (bootcampId) {
    const obj = await this.aggregate([ // [pipeline] => array of objects (stages)
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: "$bootcamp",
                averageCost: { $avg: "$tuition" }
            }
        }
    ]);

    try {
        await this.model("Bootcamp").updateOne({
            _id: bootcampId
        }, {
            averageCost: Math.ceil(obj[0].averageCost / 10) * 10
        });
    } catch (err) {
        console.error(err);
    }
};

// Call getAverageCost after save
CourseSchema.post("save", async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

// Call getAverageCost before delete
CourseSchema.pre("remove", async function () {
    await this.constructor.getAverageCost(this.bootcamp);
});

module.exports = mongoose.model("Course", CourseSchema);