const path = require("path");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

const {
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsByRadius,
    uploadBootcampPhoto } = require("../models/bootcamps/bootcamps.model");


const httpGetBootcamps = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

const httpGetBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;
    const bootcamp = await getBootcamp({
        _id: id
    });
    if (!bootcamp) {
        // Not found in DB, but the other one in the catch block is:  Not correctly formatted id
        return next(new ErrorResponse(`Bootcamp not found with id: ${id}`, 404)); // Pass the error to express
    }
    res.status(200).json({ success: true, data: bootcamp });
});

const httpCreateBootcamp = asyncHandler(async (req, res, next) => {
    req.body.user = req.user.id;

    const publishedBootcamp = await getBootcamp({
        user: req.user.id
    });

    if (publishedBootcamp && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} has already published a bootcamp`, 400));
    }

    const bootcamp = await createBootcamp(req.body);
    res.status(200).json({ success: true, data: bootcamp });
});

const httpUpdateBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    let bootcamp = await getBootcamp({
        _id: id
    });

    // Make sure user is bootcamp owner
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to update this bootcamp`, 403));
    }

    bootcamp = await updateBootcamp(id, req.body);
    if (!bootcamp) {
        return next(new ErrorResponse("Nothing was modified", 400));
    }
    res.status(200).json({ success: true });
});

const httpDeleteBootcamp = asyncHandler(async (req, res, next) => {
    const id = req.params.id;

    let bootcamp = await getBootcamp({
        _id: id
    });

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to delete this bootcamp`, 403));
    }

    bootcamp = await deleteBootcamp(id);
    if (!bootcamp) {
        return next(new ErrorResponse("Nothing was deleted", 400));
    }
    res.status(200).json({ success: true });
});

const httpGetBootcampsByRadius = asyncHandler(async (req, res) => {
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

    let bootcamp = await getBootcamp({
        _id: id
    });

    if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
        return next(new ErrorResponse(`The user with id: ${req.user.id} is unauthorized to update this bootcamp`, 403));
    }

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