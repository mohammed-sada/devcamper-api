const User = require("./users.mongo");

async function findUser(id) {
    return await User.findById(id);
}

async function registerUser(user) {
    return await User.create(user);
}

async function getUser(filter, projection) {
    return await User.findOne(filter, projection);
}

module.exports = {
    findUser,
    registerUser,
    getUser
};