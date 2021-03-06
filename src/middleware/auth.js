const jwt = require("jsonwebtoken");
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('./async');

const { getUser } = require("../models/users/users.model");
const { getBootcamp } = require("../models/bootcamps/bootcamps.model");

exports.protect = asyncHandler((async (req, res, next) => {
    let token;

    const { authorization } = req.headers;

    if (authorization && authorization.startsWith("Bearer")) {
        token = authorization.split(" ")[1];
    }

    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }

    if (!token) {
        return next(new ErrorResponse("https://youtu.be/RfiQYRn7fBg", 401));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await getUser({
            _id: decoded.id
        });
        if (!user) {
            return next(new ErrorResponse("no user found", 404));
        }
        req.user = user;
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

exports.checkIfExist = (model) => asyncHandler(async (req, res, next) => {
    console.log('check 101');
    const id = req.params.id;

    let resource = await model.findById(id);

    if (!resource) {
        return next(new ErrorResponse(`resource with id ${id} is not found`, 404));
    }

    next();
});

exports.checkIfOwner = (model) => asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    let resource = await model.findById(id);

    if (resource.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to do actions on this resource`, 403));
    }
    next();
});