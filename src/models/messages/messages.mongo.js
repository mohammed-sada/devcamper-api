const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Please provide a sender']
    },
    text: {
        type: String,
        required: [true, 'Please provide a text for the message']
    }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);