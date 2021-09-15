const express = require("express");

const {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp } = require("../controllers/bootcamps.controller");

const bootcampsRouter = express.Router();

bootcampsRouter.route("/").get(httpGetBootcamps).post(httpCreateBootcamp)
bootcampsRouter.route("/:id").get(httpGetBootcamp).put(httpUpdateBootcamp).delete(httpDeleteBootcamp);


module.exports = bootcampsRouter;