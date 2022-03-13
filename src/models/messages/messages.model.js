const Message = require('../messages/messages.mongo');

async function getConversationMessages(conversationId) {
    return await Message.find({
        conversation: conversationId
    });
}

async function createMessage(message) {
    return await Message.create(message);
}

module.exports = {
    getConversationMessages,
    createMessage
};