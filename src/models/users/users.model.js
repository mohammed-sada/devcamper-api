const User = require("./users.mongo");


async function getUser(filter, projection) {
    return await User.findOne(filter, projection);
}

async function registerUser(user) {
    return await User.create(user);
}

async function updateUser(id, details, run) {
    const user = await User.updateOne({ _id: id }, details, { runValidators: run });
    return user.modifiedCount === 1;
}

async function deleteUser(id) {
    const user = await User.deleteOne({
        _id: id
    });
    return user.deletedCount === 1;
}

module.exports = {
    getUser,
    registerUser,
    updateUser,
    deleteUser
};