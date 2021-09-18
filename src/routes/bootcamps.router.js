const express = require("express");

const advancedResults = require("../middleware/advancedResults");
const Bootcamp = require("../models/bootcamps/bootcamps.mongo");

const {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp,
    httpGetBootcampsByRadius,
    httpUploadBootcampPhoto } = require("../controllers/bootcamps.controller");

// Include other resourse routers
const coursesRouter = require("./courses.router");


const bootcampsRouter = express.Router();

// Re-route into other resourse routers
bootcampsRouter.use("/:bootcampId/courses", coursesRouter);

bootcampsRouter.route("/").get(advancedResults(Bootcamp, "courses"), httpGetBootcamps).post(httpCreateBootcamp);
bootcampsRouter.route("/:id").get(httpGetBootcamp).put(httpUpdateBootcamp).delete(httpDeleteBootcamp);
bootcampsRouter.route("/radius/:zipcode/:distance").get(httpGetBootcampsByRadius);
bootcampsRouter.route("/:id/photo").put(httpUploadBootcampPhoto);

module.exports = bootcampsRouter;