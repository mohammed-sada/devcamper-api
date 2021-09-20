const express = require("express");

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

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
bootcampsRouter.use("/:bootcampId/courses", coursesRouter); // forwarding

bootcampsRouter.route("/")
    .get(advancedResults(Bootcamp, "courses"), httpGetBootcamps)
    .post(protect, authorize("admin", "publisher"), httpCreateBootcamp);

bootcampsRouter.route("/:id")
    .get(httpGetBootcamp)
    .put(protect, authorize("admin", "publisher"), httpUpdateBootcamp)
    .delete(protect, authorize("admin", "publisher"), httpDeleteBootcamp);

bootcampsRouter.route("/radius/:zipcode/:distance")
    .get(httpGetBootcampsByRadius);

bootcampsRouter.route("/:id/photo").
    put(protect, authorize("admin", "publisher"), httpUploadBootcampPhoto);

module.exports = bootcampsRouter;