const crypto = require("crypto");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");

const {
    registerUser,
    getUser,
    updateUser
} = require("../models/users/users.model");

const httpRegisterUser = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);

    sendTokenResponse(user, 200, res);
});

const httpLoginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse("Please provide email and password", 400));
    }

    const user = await getUser({ email }, "+password");
    if (!user) {
        return next(new ErrorResponse("https://youtu.be/RfiQYRn7fBg", 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("https://youtu.be/RfiQYRn7fBg", 401));
    }

    sendTokenResponse(user, 200, res);
});


const httpGetMe = asyncHandler(async (req, res, next) => {
    // const user = await findUser(req.user.id);
    // if (!user) {
    //     return next(new ErrorResponse("User not found", 400));
    // }

    res.status(200).json({
        successs: true,
        data: req.user
    });
});

const httpForgotPassword = asyncHandler(async (req, res, next) => {
    const user = await getUser({ email: req.body.email });
    if (!user) {
        return next(new ErrorResponse("There is no user with this email", 404));
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/resetpassword/${resetToken}`;
    const message = `You are recieving this message because you (or someone else) have requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} `;

    try {
        sendEmail({
            email: user.email,
            subject: "Reset password token",
            message
        });
        res.status(200).json({
            success: true,
            data: "Email sent"
        });
    } catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new ErrorResponse("Email could not be sent", 500));
    }
});

const httpResetPassword = asyncHandler(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.resettoken).digest("hex");

    const user = await getUser({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorResponse("Invalid token", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);

});

const httpUpdateDetails = asyncHandler(async (req, res, next) => {
    const { name, email } = req.body;

    const user = await updateUser(req.user.id, { name, email });

    if (!user) {
        return next(new ErrorResponse("Nothing was modified", 400));
    }

    res.status(200).json({
        success: true
    });
});

const httpUpdatePassword = asyncHandler(async (req, res, next) => {
    const user = await getUser({
        _id: req.user.id
    }, "+password");
    const isMatch = await user.matchPassword(req.body.currentPassword);

    if (!isMatch) {
        return next(new ErrorResponse("Password is incorrect", 400));
    }

    user.password = req.body.newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response 
const sendTokenResponse = function (user, statusCode, res) {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production"
    };

    res
        .status(statusCode)
        .cookie("token", token, options)
        .json({
            success: true,
            token
        });

};

module.exports = {
    httpRegisterUser,
    httpLoginUser,
    httpGetMe,
    httpForgotPassword,
    httpResetPassword,
    httpUpdateDetails,
    httpUpdatePassword
};
