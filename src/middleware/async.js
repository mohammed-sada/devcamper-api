const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next); // catch(err){next{err}}
};

module.exports = asyncHandler;