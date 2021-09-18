const Bootcamp = require("./bootcamps.mongo");
const geocoder = require("../../utils/geocoder");

async function findBootcamp(filter) {
    return await Bootcamp.find(filter);
}

async function getBootcampsCount() {
    return await Bootcamp.countDocuments();
}

async function getBootcamps(query, sort, select, skip, limit) {
    return await Bootcamp.find(query).sort(sort).select(select).skip(skip).limit(limit).populate("courses");
}

async function getBootcamp(id) {
    return await Bootcamp.findById(id, "-__v");
}

async function createBootcamp(bootcamp) {
    return await Bootcamp.create(bootcamp);
}

async function updateBootcamp(id, bootcamp) {
    const newBootcamp = await Bootcamp.updateOne({
        _id: id
    }, bootcamp);

    return newBootcamp.modifiedCount === 1;
}

async function deleteBootcamp(id) {
    const bootcamp = await Bootcamp.deleteOne({
        _id: id
    });

    return bootcamp.deletedCount === 1;
}

async function getBootcampsByRadius(zipcode, distance) {
    // Get the lat/lng to form a point which will be the circle's center point
    const { longitude, latitude } = (await geocoder.geocode(zipcode))[0];

    // Calc radius using ridaians by => dividing the dist by the radius of Earth (mi)
    const radius = distance / 3963;

    return await Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
    });
}

module.exports = {
    findBootcamp,
    getBootcampsCount,
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByRadius
};