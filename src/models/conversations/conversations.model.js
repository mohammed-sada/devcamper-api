const Conversation = require('./conversations.mongo');

async function getConversation(filter) {
    return await Conversation.findOne(filter);
}

async function createConversation(members) {
    return await Conversation.create({ members });
}

async function getUserConversations(userId) {
    return await Conversation.find({
        members: { $in: [userId] }
    });
}

module.exports = {
    getConversation,
    createConversation,
    getUserConversations
};