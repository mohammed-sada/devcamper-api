const express = require("express");

const {
    httpRegisterUser,
    httpLoginUser,
    httpGetMe,
    httpForgotPassword,
    httpResetPassword,
    httpUpdateDetails,
    httpUpdatePassword } = require("../controllers/users.controller");

const { protect } = require("../middleware/auth");

const usersRouter = express.Router();

usersRouter.post("/register", httpRegisterUser);
usersRouter.post("/login", httpLoginUser);
usersRouter.get("/me", protect, httpGetMe);
usersRouter.get("/forgotpassword", httpForgotPassword);
usersRouter.put("/resetpassword/:resettoken", httpResetPassword);
usersRouter.put("/updatedetails", protect, httpUpdateDetails);
usersRouter.put("/updatepassword", protect, httpUpdatePassword);

module.exports = usersRouter;