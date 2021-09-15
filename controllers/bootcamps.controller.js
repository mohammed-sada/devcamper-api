const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp } = require("../models/bootcamps/bootcamps.model");


const httpGetBootcamps = asyncHandler(async (req, res, next) => {
    const bootcamps = await getBootcamps();
    res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
})

const httpGetBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const bootcamp = await getBootcamp(id);
    if (!bootcamp) {
        // Not found in DB, but the other one in the catch block is:  Not correctly formatted id
        return next(new ErrorResponse(`Bootcamp not found with id: ${id}`, 404)); // Pass the error to express

    }
    res.status(200).json({ success: true, data: bootcamp });
})

const httpCreateBootcamp = asyncHandler(async (req, res, next) => {
    const createdBootcamp = await createBootcamp(req.body);
    res.status(200).json({ success: true, data: createdBootcamp });
})

const httpUpdateBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const updatedBootcamp = await updateBootcamp(id, req.body);
    if (!updatedBootcamp) {
        return next(new ErrorResponse("Nothing was modified", 400));
    }
    res.status(200).json({ success: true })
})

const httpDeleteBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const deletedBootcamp = await deleteBootcamp(id);

    if (!deletedBootcamp) {
        return next(new ErrorResponse("Nothing was deleted", 400));
    }
    res.status(200).json({ success: true, data: {} })
})

module.exports = {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp
}