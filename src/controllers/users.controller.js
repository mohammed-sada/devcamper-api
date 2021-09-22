const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    getUser,
    registerUser,
    updateUser,
    deleteUser } = require("../models/users/users.model");

const httpGetUsers = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

const httpGetUser = asyncHandler(async (req, res, next) => {
    const user = await getUser({
        _id: req.params.id
    });

    if (!user) {
        return next(new ErrorResponse(`User with id ${req.params.id} is not found`, 404));
    }

    res.status(200).json({
        success: true,
        data: user
    });
});

const httpCreateUser = asyncHandler(async (req, res, next) => {
    const user = await registerUser(req.body);
    res.status(201).json({
        success: true,
        data: user
    });
});

const httpUpdateUser = asyncHandler(async (req, res, next) => {
    const { name, email, role } = req.body;

    const user = await updateUser(req.params.id, { name, email, role }, false);

    if (!user) {
        return next(new ErrorResponse(`User with id ${req.params.id} is not found`, 404));
    }
    res.status(200).json({
        success: true,
    });
});

const httpDeleteUser = asyncHandler(async (req, res, next) => {
    const user = await deleteUser(req.params.id);

    if (!user) {
        return next(new ErrorResponse(`User with id ${req.params.id} is not found`, 404));
    }
    res.status(200).json({
        success: true,
    });
});

module.exports = {
    httpGetUsers,
    httpGetUser,
    httpCreateUser,
    httpUpdateUser,
    httpDeleteUser
};

