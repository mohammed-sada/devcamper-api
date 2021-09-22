const express = require("express");

const {
    httpGetCourses,
    httpGetCourse,
    httpCreateCourse,
    httpUpdateCourse,
    httpDeleteCourse } = require("../controllers/courses.controller");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const Course = require("../models/courses/courses.mongo");


const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.route("/")
    .get(advancedResults(Course, { path: "bootcamp", select: "name description" }), httpGetCourses)
    .post(protect, authorize("admin", "publisher"), httpCreateCourse);

coursesRouter.route("/:id")
    .get(httpGetCourse)
    .put(protect, authorize("admin", "publisher"), httpUpdateCourse)
    .delete(protect, authorize("admin", "publisher"), httpDeleteCourse);


module.exports = coursesRouter;