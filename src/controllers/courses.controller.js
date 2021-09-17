const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    getCourses,
} = require("../models/courses/courses.model");

const httpGetCourses = asyncHandler(async (req, res) => {
    const { bootcampId } = req.params;
    const reqQuery = { ...req.query };

    const removeFields = ["select"];
    removeFields.forEach(param => delete reqQuery[param]);
    let select;
    if (req.query.select) {
        select = req.query.select.split(",").join(" ");
    }

    const courses = await getCourses(bootcampId, select);

    res.status(200).json({
        success: true,
        count: courses.length,
        data: courses
    });
});

module.exports = {
    httpGetCourses
};