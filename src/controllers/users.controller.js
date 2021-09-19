const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    registerUser,
    getUser } = require("../models/users/users.model");

const httpRegisterUser = asyncHandler(async (req, res) => {
    const user = await registerUser(req.body);

    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
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

    const token = user.getSignedJwtToken();
    res.status(200).json({ success: true, token });
});

module.exports = {
    httpRegisterUser,
    httpLoginUser
};
