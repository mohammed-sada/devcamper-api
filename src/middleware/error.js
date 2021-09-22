const ErrorResponse = require("../utils/ErrorResponse");

function errorHandler(err, req, res, next) {
    // Log to console for dev
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        const message = `Resourse not found with id of: ${err.value}`; // value = id
        err = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = "This email already exist";
        err = new ErrorResponse(message, 400);
    }

    // Mongoose empty required fields validation
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map(value => value.message).reverse();
        err = new ErrorResponse(message, 400);
    }

    res.status(err.statusCode || 500).json({
        success: false, error: err.message || "Server Error"
    });
}

module.exports = errorHandler;