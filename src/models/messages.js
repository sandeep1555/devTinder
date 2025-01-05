const mongoose = require("mongoose")


const messagesSchema = new mongoose.Schema(
    {
        senderId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        receiverId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        content:
        {
            type: String,
            require: true
        },
        timeStamp:
        {
            type: Date,
            default: Date.now
        }
    })
const messages = mongoose.model("Messages", messagesSchema)

module.exports = messages