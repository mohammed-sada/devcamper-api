const express = require("express");

const {
    httpRegisterUser,
    httpLoginUser,
    httpLogoutUser,
    httpGetMe,
    httpForgotPassword,
    httpResetPassword,
    httpUpdateDetails,
    httpUpdatePassword } = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/register", httpRegisterUser);
authRouter.post("/login", httpLoginUser);
authRouter.get("/logout", httpLogoutUser);
authRouter.get("/me", protect, httpGetMe);
authRouter.get("/forgotpassword", httpForgotPassword);
authRouter.put("/resetpassword/:resettoken", httpResetPassword);
authRouter.put("/updatedetails", protect, httpUpdateDetails);
authRouter.put("/updatepassword", protect, httpUpdatePassword);

module.exports = authRouter;