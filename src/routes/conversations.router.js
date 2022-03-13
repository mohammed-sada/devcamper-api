const express= require('express');

const {
    httpCreateConversation,
    httpGetUserConversations
} = require('../controllers/conversations.controller')

const { protect} = require("../middleware/auth");

const conversationsRouter = express.Router();

conversationsRouter.post('/',protect,httpCreateConversation);
conversationsRouter.get('/',protect,httpGetUserConversations);

module.exports = conversationsRouter;

