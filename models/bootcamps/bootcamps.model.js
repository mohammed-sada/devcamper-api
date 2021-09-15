const Bootcamp = require("./bootcamps.mongo");

// async function findBootcamp(filter) {
//     return await Bootcamp.find(filter)
// }

async function getBootcamps() {
    return await Bootcamp.find({}, "-__v");
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

module.exports = {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp
}