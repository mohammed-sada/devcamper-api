const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./async');
const { findUser } = require("../models/users/users.model");

exports.protect = asyncHandler((async (req, res, next) => {
    let token;
    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }
    // if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        return next(new ErrorResponse("https://youtu.be/RfiQYRn7fBg", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await findUser(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse("https://youtu.be/RfiQYRn7fBg", 401));
    }
}));

exports.authorize = (...roles) => (req, res, next) => {
    const { role } = req.user;

    if (!roles.includes(role)) {
        return next(new ErrorResponse(`User role '${role}' is unauthorized to access this route: https://youtu.be/RfiQYRn7fBg`, 403));
    }
    next();
};