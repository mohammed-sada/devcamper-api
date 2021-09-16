const express = require("express");

const {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp,
    httpGetBootcampsByRadius, } = require("../controllers/bootcamps.controller");

const bootcampsRouter = express.Router();

bootcampsRouter.route("/").get(httpGetBootcamps).post(httpCreateBootcamp)
bootcampsRouter.route("/").get(httpGetBootcamps).post(httpCreateBootcamp)
bootcampsRouter.route("/:id").get(httpGetBootcamp).put(httpUpdateBootcamp).delete(httpDeleteBootcamp);
bootcampsRouter.route("/radius/:zipcode/:distance").get(httpGetBootcampsByRadius)


module.exports = bootcampsRouter;