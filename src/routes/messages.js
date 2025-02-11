const express = require("express")
const { userAuth } = require("../middleware/userAuth")

const messageRouter = express.Router()
const {Messages} = require("../models/messages")


messageRouter.get("/message/:receiverId", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const userId = user._id;
        const {receiverId} = req.params;
        let chat = await Messages.findOne({
            participants: { $all: [userId, receiverId] }
        }).populate({
            path: "messages.senderId",
            select: "firstName lastName photoURL"

        })
        if (!chat) {
            chat = new Messages({
                participants: [userId, receiverId],
                messages: [],
            })
        }
        await chat.save();
        res.status(200).json({ message: 'Message sent!', data: chat });
    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }

})

messageRouter.get("/message/:receiverId", userAuth, async (req, res) => {
    try {
        const user = req.user;
        const senderId = user._id;
        const receiverId = req.params.receiverId;
        const messages = await Messages.find({
            $or: [
                { receiverId: senderId, senderId: receiverId },
                { senderId: senderId, receiverId: receiverId },
            ],
        }).sort({ timeStamp: -1 }).limit(20).populate("senderId", "fistName lastName photoURL").populate("receiverId", "firstName lastName photoURL ");
        const sortedMessages = messages.reverse();
        res.status(200).json({ message: "all messages", data: sortedMessages })

    }
    catch (error) {
        res.status(400).json({ error: error.message })
    }
})


module.exports = messageRouter