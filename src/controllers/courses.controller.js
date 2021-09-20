const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const { getBootcamp } = require("../models/bootcamps/bootcamps.model");

const {
    getBootcampCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../models/courses/courses.model");

const httpGetCourses = asyncHandler(async (req, res) => {
    const { bootcampId } = req.params;

    if (bootcampId) {
        const courses = await getBootcampCourses(bootcampId);
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }

    res.status(200).json(res.advancedResults);
});

const httpGetCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const course = await getCourse(id);
    if (!course) {
        return next(new ErrorResponse(`Course with id: ${id} is not found  `, 404));
    }
    res.status(200).json({ success: true, data: course });
});

const httpCreateCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;

    const bootcamp = await getBootcamp({ _id: req.params.bootcampId });

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id: ${id} is not found  `, 404));
    }

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to add a course to this bootcamp`, 403));
    }

    const course = await createCourse(req.body);

    res.status(201).json({ success: true, data: course });
});

const httpUpdateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let course = await getCourse(id);
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to update this course`, 403));
    }

    course = await updateCourse(id, req.body);
    if (!course) {
        return next(new ErrorResponse("Nothing was modified", 400));
    }
    res.status(200).json({ success: true });
});

const httpDeleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    let course = await getCourse(id);
    if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to delete this course`, 403));
    }

    course = await deleteCourse(id);
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