const bootcamps = require("./bootcamps.mongo");

async function findBootcamp(filter) {
    return await bootcamps.find(filter)
}

// async function existBootcamp(id) {
//     return await findBootcamp({
//         _id: id
//     })
// }

async function getBootcamps() {
    return await bootcamps.find({}, "-__v");
}

async function getBootcamp(id) {
    return await bootcamps.findById(id, "-__v");
}

async function createBootcamp(bootcamp) {
    return await bootcamps.create(bootcamp)

}

async function updateBootcamp(id, bootcamp) {
    const updatedBootcamp = await bootcamps.updateOne({
        _id: id
    }, bootcamp);

    return updatedBootcamp.matchedCount === 1 && updatedBootcamp.modifiedCount === 1;
}

async function deleteBootcamp(id) {
    const deletedBootcamp = await bootcamps.deleteOne({
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