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



module.exports = {
    getCourses,
};