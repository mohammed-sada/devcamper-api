const Course = require("./courses.mongo");

async function getBootcampCourses(id) {
    return await Course.find({
        bootcamp: id
    }).populate({
        path: "bootcamp",
        select: "name description"
    });
}

async function getCourse(id) {
    return await Course.findById(id);
}


async function createCourse(course) {
    return await Course.create(course);
}

async function updateCourse(id, course) {
    const newCourse = await Course.updateOne({
        _id: id
    }, course);
    return newCourse.modifiedCount === 1;
}

async function deleteCourse(id) {
    const course = await Course.findById(id);
    return await course.remove();

    // return course.deletedCount === 1;
}

module.exports = {
    getBootcampCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};