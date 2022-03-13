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

    const course = await createCourse(req.body);
    res.status(201).json({ success: true, data: course });
});

const httpUpdateCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    await updateCourse(id, req.body);
    res.status(200).json({ success: true });
});

const httpDeleteCourse = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    await deleteCourse(id);
    res.status(200).json({ success: true });
});

module.exports = {
    httpGetCourses,
    httpGetCourse,
    httpCreateCourse,
    httpUpdateCourse,
    httpDeleteCourse
};