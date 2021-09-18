const Course = require("./courses.mongo");

async function getCourses(id, select) {
    if (id) {
        return await Course.find({
            bootcamp: id
        }).populate({
            path: "bootcamp",
            select
        });
    } else {
        return await Course.find({}).populate({
            path: "bootcamp",
            select
        });
    }
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
    console.log(newCourse);
    return newCourse.modifiedCount === 1;
}

async function deleteCourse(id) {
    const course = await Course.deleteOne({
        _id: id
    });

    return course.deletedCount === 1;
}

module.exports = {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
};