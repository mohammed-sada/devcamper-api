const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    registerUser,
    getUser,
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

    const user = await getUser(email);
    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

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

module.exports = {
    httpRegisterUser,
    httpLoginUser,
    httpGetMe
};
