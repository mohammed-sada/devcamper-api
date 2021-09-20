const Bootcamp = require("./bootcamps.mongo");
const geocoder = require("../../utils/geocoder");


async function getBootcamp(id) {
    return await Bootcamp.findById(id, "-__v").populate("courses");
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

async function uploadBootcampPhoto(id, photoName) {
    await Bootcamp.updateOne({
        _id: id
    }, { photo: photoName });
}

module.exports = {
    findBootcamp,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByRadius,
    uploadBootcampPhoto
};