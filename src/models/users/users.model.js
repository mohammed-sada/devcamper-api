const User = require("./users.mongo");

async function registerUser(user) {
    return await User.create(user);
}

async function getUser(email) {
    return await User.findOne({
        email
    }, "+password");
}

module.exports = {
    registerUser,
    getUser
};