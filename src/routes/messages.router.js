const express = require('express');

const {
    httpGetConversationMessages,
    httpCreateMessage
} = require('../controllers/messages.controller');

const { protect } = require("../middleware/auth");

const messagesRouter = express.Router();

messagesRouter.get('/:conversation', protect, httpGetConversationMessages);
messagesRouter.post('/', protect, httpCreateMessage);

module.exports = messagesRouter;

