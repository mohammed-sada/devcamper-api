const express = require("express");

const advancedResults = require("../middleware/advancedResults");
const Course = require("../models/courses/courses.mongo");

const {
    httpGetCourses,
    httpGetCourse,
    httpCreateCourse,
    httpUpdateCourse,
    httpDeleteCourse } = require("../controllers/courses.controller");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.route("/").get(advancedResults(Course, { path: "bootcamp", select: "name description" }), httpGetCourses)
    .post(httpCreateCourse);
coursesRouter.route("/:id").get(httpGetCourse).put(httpUpdateCourse).delete(httpDeleteCourse);


module.exports = coursesRouter;