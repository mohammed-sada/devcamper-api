const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const { findBootcamp } = require("../models/bootcamps/bootcamps.model");

const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
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

const httpGetCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await getCourse(id);
    if (!course) {
        return next(new ErrorResponse(`Course with id: ${id} is not found  `, 404));
    }
    res.status(201).json({ success: true, data: course });
});

const httpCreateCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;

    const bootcamp = await findBootcamp({ _id: req.params.bootcampId });
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${id} is not found  `, 404));
    }

    const course = await createCourse(req.body);

    res.status(201).json({ success: true, data: course });
});

const httpUpdateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const course = await updateCourse(id, req.body);
    if (!course) {
        return next(new ErrorResponse("Nothing was modified", 400));
    }
    res.status(200).json({ success: true });
});
const httpDeleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const course = await deleteCourse(id);

    if (!course) {
        return next(new ErrorResponse("Nothing was deleted", 400));
    }
    res.status(200).json({ success: true });
});

module.exports = {
    httpGetCourses,
    httpGetCourse,
    httpCreateCourse,
    httpUpdateCourse,
    httpDeleteCourse
};