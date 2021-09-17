const express = require("express");

const { httpGetCourses } = require("../controllers/courses.controller");

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter.route("/").get(httpGetCourses);

module.exports = coursesRouter;