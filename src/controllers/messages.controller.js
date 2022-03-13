const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/async');

const {
    getConversation
} = require('../models/conversations/conversations.model');

const {
    getConversationMessages,
    createMessage
} = require('../models/messages/messages.model');

const httpGetConversationMessages = asyncHandler(async (req, res, next) => {
    const conversation = await getConversation({ _id: req.params.conversation });
    if (!conversation) {
        return next(new ErrorResponse(`No conversation with this id: ${req.params.conversation}`, 404));
    }

    const allowed = conversation.members.find(member => member.toString() === req.user.id);
    if (!allowed) {
        return next(new ErrorResponse('This user in not allwed to access this conversation', 403));
    }

    const messages = await getConversationMessages(req.params.conversation);
    res.status(200).json(messages);
});

const httpCreateMessage = asyncHandler(async (req, res, next) => {
    const conversation = await getConversation({ _id: req.body.conversation });
    if (!conversation) {
        return next(new ErrorResponse(`No conversation with this id: ${req.body.conversation}`, 404));
    }

    const allowed = conversation.members.find(member => member.toString() === req.user.id);
    if (!allowed) {
        return next(new ErrorResponse('This user in not allwed to access this conversation', 403));
    }

    const message = await createMessage({
        conversation: req.body.conversation,
        sender: req.user.id,
        text: req.body.text
    });
    res.status(200).json(message);
});


module.exports = {
    httpGetConversationMessages,
    httpCreateMessage
};;;
