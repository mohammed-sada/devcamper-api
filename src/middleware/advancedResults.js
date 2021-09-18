
const advancedResults = (model, populate) => async (req, res, next) => {
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
    let sort;
    if (req.query.sort) {
        sort = req.query.sort.split(",").join(" ");
    } else {
        sort = "-createdAt";
    }

    // Sort fields
    let select;
    if (req.query.select) {
        select = req.query.select.split(",").join(" ");
    }

    // Pagination
    const page = Math.abs(req.query.page || 1);
    const limit = Math.abs(req.query.limit || 4);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

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
    let results = model.find(query).select(select).sort(sort).skip(startIndex).limit(limit);
    if (populate) {
        results = results.populate(populate);
    }

    // Excute the query
    results = await results;


    res.advancedResults = {
        success: true,
        count: results.length,
        data: results
    };
    next();

};

module.exports = advancedResults;

