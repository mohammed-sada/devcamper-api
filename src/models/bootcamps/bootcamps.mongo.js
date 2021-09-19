const mongoose = require("mongoose");
const slugify = require("slugify");
const Course = require("../courses/courses.mongo");
const geocoder = require("../../utils/geocoder");

const BootcampSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"],
        unique: true,
        trim: true,
        maxlength: [50, "Name can not be more than 50 characters"]
    },
    slug: String,
    description: {
        type: String,
        required: [true, "Please add a description"],
        maxlength: [500, "Description can not be more than 500 characters"]
    },
    website: {
        type: String,
        match: [
            /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
            "Please use a valid URL with HTTP or HTTPS"
        ]
    },
    phone: {
        type: String,
        maxlength: [20, "Phone number can not be longer than 20 characters"]
    },
    email: {
        type: String,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    address: {
        type: String,
        required: [true, "Please add an address"]
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number],
            index: "2dsphere"
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    careers: {
        // Array of strings
        type: [String],
        required: [true, "Please set the careers"],
        enum: [
            "Web Development",
            "Mobile Development",
            "UI/UX",
            "Data Science",
            "Business",
            "Other"
        ]
    },
    averageRating: {
        type: Number,
        min: [1, "Rating must be at least 1"],
        max: [10, "Rating must can not be more than 10"]
    },
    averageCost: Number,
    photo: {
        type: String,
        default: "no-photo.jpg"
    },
    housing: {
        type: Boolean,
        default: false
    },
    jobAssistance: {
        type: Boolean,
        default: false
    },
    jobGuarantee: {
        type: Boolean,
        default: false
    },
    acceptGi: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Create bootcamp slug from the name
BootcampSchema.pre("save", function (next) { // pre will run before we save the bootcamp to DB
    this.slug = slugify(this.name); // this refers to the current document being saved
    next();
});

// Geocode and create location field
BootcampSchema.pre("save", async function (next) {
    const {
        latitude,
        longitude,
        formattedAddress,
        streetName,
        city,
        zipcode,
        stateCode,
        countryCode
    } = (await geocoder.geocode(this.address))[0];

    this.location = {
        type: "Point",
        coordinates: [longitude, latitude],
        formattedAddress,
        street: streetName,
        city,
        state: stateCode,
        zipcode,
        country: countryCode
    };

    //  Do not save address in DB
    this.address = undefined;
    next();
});

// Cascade delete courses when a bootcamp is deleted
BootcampSchema.pre("deleteOne", async function (next) {
    const id = this.getQuery()["_id"];
    console.log(`Courses being removed from bootcamp ${id}`);
    await Course.deleteMany({ bootcamp: id });
    next();
});

// Reverse populate with virtuals
BootcampSchema.virtual("courses", {
    ref: "Course",
    localField: "_id",
    foreignField: "bootcamp",
    justOne: false // so we get an array
});

module.exports = mongoose.model("Bootcamp", BootcampSchema);