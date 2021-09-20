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
        return next(new ErrorResponse("Unauthorized to access this route", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await findUser(decoded.id);
        next();
    } catch (err) {
        return next(new ErrorResponse("Unauthorized to access this route", 401));
    }
}));