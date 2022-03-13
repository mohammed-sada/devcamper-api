const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

const {
    getUser
} = require('../models/users/users.model');

const {
    getConversation,
    createConversation,
    getUserConversations
} = require('../models/conversations/conversations.model');

const httpCreateConversation = asyncHandler(async (req, res, next) => {
    const { receiverId } = req.body;
    const senderId = req.user.id;

    // check if receiver user exist
    const receiverUser = await getUser({
        _id: receiverId
    });

    if (!receiverUser) {
        return next(new ErrorResponse(`There is No user with this id: ${receiverId}`, 404));
    }

    const exist = await getConversation({
        members: { $all: [receiverId, req.user.id] }
    });
    if (exist) {
        return next(new ErrorResponse(`You already have a conversation with this user: ${receiverId}`, 400));
    }

    const conversation = await createConversation([senderId, receiverId]);
    res.status(201).json(conversation);
});

const httpGetUserConversations = asyncHandler(async (req, res, next) => {
    const conversations = await getUserConversations(req.user.id);
    res.status(200).json(conversations);
});

module.exports = {
    httpCreateConversation,
    httpGetUserConversations
};