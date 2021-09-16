const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    getBootcampsCount,
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByRadius } = require("../models/bootcamps/bootcamps.model");


const httpGetBootcamps = asyncHandler(async (req, res, next) => {
    let query;

    // Copy req.query
    const reqQuery = { ...req.query };

    // Fields to exclude
    const removeFields = ["sort", "select", "page", "limit"];

    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);

    // $gt, $lte, $in, etc... => these are mongoose operators
    // \b => word boundry charachter for matching | g => global, so it will look further than just the first one it finds 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Return back to JS
    query = JSON.parse(queryStr);

    // Select fields
    let sortBy;
    if (req.query.sort) {
        sortBy = req.query.sort.split(",").join(" ");
    } else {
        sortBy = "-createdAt";
    }

    // Sort fields
    let select;
    if (req.query.select) {
        select = req.query.select.split(",").join(" ");
    }

    // Pagination
    const page = Math.abs(req.query.page || 1);
    const limit = Math.abs(req.query.limit || 1);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await getBootcampsCount();

    const pagination = {};

    if ((startIndex > 0 && startIndex < total)) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    // Excute the query
    const bootcamps = await getBootcamps(query, sortBy, select, startIndex, limit);
    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
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

const httpGetBootcampsByRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    const bootcamps = await getBootcampsByRadius(zipcode, distance);
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})

module.exports = {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp,
    httpGetBootcampsByRadius
}