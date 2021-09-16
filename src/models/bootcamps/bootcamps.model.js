const Bootcamp = require("./bootcamps.mongo");
const geocoder = require("../../utils/geocoder");

// async function findBootcamp(filter) {
//     return await Bootcamp.find(filter)
// }

async function getBootcampsCount() {
    return await Bootcamp.countDocuments();
}

async function getBootcamps(query, sort, select, skip, limit) {
    return await Bootcamp.find(query).sort(sort).select(select).skip(skip).limit(limit);
}

async function getBootcamp(id) {
    return await Bootcamp.findById(id, "-__v");
}

async function createBootcamp(bootcamp) {
    return await Bootcamp.create(bootcamp);
}

async function updateBootcamp(id, bootcamp) {
    const updatedBootcamp = await Bootcamp.updateOne({
        _id: id
    }, bootcamp);

    return updatedBootcamp.matchedCount === 1 && updatedBootcamp.modifiedCount === 1;
}

async function deleteBootcamp(id) {
    const deletedBootcamp = await Bootcamp.deleteOne({
        _id: id
    })

    return deletedBootcamp.deletedCount === 1;
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
    getBootcampsCount,
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByRadius
}