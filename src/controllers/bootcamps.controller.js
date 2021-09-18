const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    findBootcamp,
    getBootcampsCount,
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByRadius,
    uploadBootcampPhoto } = require("../models/bootcamps/bootcamps.model");


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
        };
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        };
    }

    // Excute the query
    const bootcamps = await getBootcamps(query, sortBy, select, startIndex, limit);
    res.status(200).json({ success: true, count: bootcamps.length, pagination, data: bootcamps });
});

const httpGetBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const bootcamp = await getBootcamp(id);
    if (!bootcamp) {
        // Not found in DB, but the other one in the catch block is:  Not correctly formatted id
        return next(new ErrorResponse(`Bootcamp not found with id: ${id}`, 404)); // Pass the error to express

    }
    res.status(200).json({ success: true, data: bootcamp });
});

const httpCreateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await createBootcamp(req.body);
    res.status(200).json({ success: true, data: bootcamp });
});

const httpUpdateBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const bootcamp = await updateBootcamp(id, req.body);
    if (!bootcamp) {
        return next(new ErrorResponse("Nothing was modified", 400));
    }
    res.status(200).json({ success: true });
});

const httpDeleteBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const bootcamp = await deleteBootcamp(id);

    if (!bootcamp) {
        return next(new ErrorResponse("Nothing was deleted", 400));
    }
    res.status(200).json({ success: true });
});

const httpGetBootcampsByRadius = asyncHandler(async (req, res, next) => {
    const { zipcode, distance } = req.params;

    const bootcamps = await getBootcampsByRadius(zipcode, distance);
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
});

const httpUploadBootcampPhoto = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    const bootcamp = await findBootcamp(id);

    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp with id ${id} is not found`, 404));
    }

    const { file } = req.files;
    if (!file) {
        return next(new ErrorResponse(`Please upload a photo`, 400));
    }

    if (file.size > process.env.MAX_UPLOAD_SIZE) {
        return next(new ErrorResponse(`Please upload a file less than ${process.env.MAX_UPLOAD_SIZE / 1000000} MB`, 400));
    }

    if (!file.mimetype.startsWith("image")) {
        return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    file.name = `photo_${id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.UPLOAD_PATH}/${file.name}`, async (err) => {
        if (err) {
            return next(new ErrorResponse(`Problem uploading the file`, 500));
        }
        await uploadBootcampPhoto(id, file.name);
        return res.status(200).json({
            success: true,
            data: file.name
        });
    });
});
module.exports = {
    httpGetBootcamps,
    httpGetBootcamp,
    httpCreateBootcamp,
    httpUpdateBootcamp,
    httpDeleteBootcamp,
    httpGetBootcampsByRadius,
    httpUploadBootcampPhoto
};