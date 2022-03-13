const express = require("express");

const {
    httpGetCourses,
    httpGetCourse,
    httpCreateCourse,
    httpUpdateCourse,
    httpDeleteCourse } = require("../controllers/courses.controller");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize, checkIfExist, checkIfOwner } = require("../middleware/auth");

const Course = require("../models/courses/courses.mongo");
const Bootcamp = require("../models/bootcamps/bootcamps.mongo");


const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.route("/")
    .get(advancedResults(Course, { path: "bootcamp", select: "name description" }), httpGetCourses)
    .post(protect, authorize("admin", "publisher"), checkIfExist(Bootcamp), checkIfOwner(Bootcamp), httpCreateCourse);

coursesRouter.route("/:id")
    .get(httpGetCourse)
    .put(protect, authorize("admin", "publisher"), checkIfExist(Course), checkIfOwner(Course), httpUpdateCourse)
    .delete(protect, authorize("admin", "publisher"), checkIfExist(Course), checkIfOwner(Course), httpDeleteCourse);


module.exports = coursesRouter;