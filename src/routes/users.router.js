const express = require("express");

const {
    httpGetUsers,
    httpGetUser,
    httpCreateUser,
    httpUpdateUser,
    httpDeleteUser } = require("../controllers/users.controller");


const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");

const User = require("../models/users/users.mongo");

const usersRouter = express.Router();

usersRouter.use(protect, authorize("admin"));

usersRouter.route("/")
    .get(advancedResults(User), httpGetUsers)
    .post(httpCreateUser);

usersRouter.route("/:id")
    .get(httpGetUser)
    .put(httpUpdateUser)
    .delete(httpDeleteUser);



module.exports = usersRouter;