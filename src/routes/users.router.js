const express = require("express");

const {
    httpRegisterUser,
    httpLoginUser } = require("../controllers/users.controller");

const usersRouter = express.Router();

usersRouter.post("/register", httpRegisterUser);
usersRouter.post("/login", httpLoginUser);

module.exports = usersRouter;