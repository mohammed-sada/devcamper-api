const express = require("express");

const {
    httpRegisterUser,
    httpLoginUser,
    httpGetMe } = require("../controllers/users.controller");

const { protect } = require("../middleware/auth");

const usersRouter = express.Router();

usersRouter.post("/register", httpRegisterUser);
usersRouter.post("/login", httpLoginUser);
usersRouter.get("/me", protect, httpGetMe);

module.exports = usersRouter;