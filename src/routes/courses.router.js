const express = require("express");

const {
    httpGetCourses,
    httpGetCourse,
    httpCreateCourse,
    httpUpdateCourse,
    httpDeleteCourse
} = require("../controllers/courses.controller");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.route("/").get(httpGetCourses).post(httpCreateCourse);
coursesRouter.route("/:id").get(httpGetCourse).put(httpUpdateCourse).delete(httpDeleteCourse);


module.exports = coursesRouter;