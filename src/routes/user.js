const express = require("express")
const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const userRouter = express.Router()

const SAFE_USER_FEILD = "firstName lastName age gender skills about photoURL"

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", SAFE_USER_FEILD)
        res.json({
            message: "Data fetched successfully",
            data: connectionRequest,
        })

    }
    catch (error) {
        res.status(400).send("ERROR: " + error.message)
    }
})

userRouter.get("/user/requests/connected", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepted" },
                { fromUserId: loggedInUser._id, status: "accepted" }

            ]
        }).populate("fromUserId", SAFE_USER_FEILD)
            .populate("toUserId", SAFE_USER_FEILD)
        const data = connectionRequest.map((row) => {
            if (row.fromUserId.toString() === loggedInUser._id) {
                return row.toUserId;
            }
            return row.fromUserId;
        })

        res.send({ data })



    } catch (error) {


        res.status(400).send("ERROR: " + error.message);
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * 10;
        limit = limit < 50 ? limit : 50;


        const loggedInUser = req.user
        const blockedUsersId = new Set();

        const connectionRequest = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id }
            ]
        }).select("fromUserId toUserId")

        connectionRequest.forEach((req) => {
            blockedUsersId.add(req.fromUserId.toString());
            blockedUsersId.add(req.toUserId.toString());
        })
        const users = await User.find({
            $and: [
                { _id: { $nin: Array.from(blockedUsersId) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(SAFE_USER_FEILD).skip(skip).limit(limit)


        res.send(users)

    }
    catch (error) {
        res.status(400).send("ERROR :" + error.message)
    }

})
module.exports = userRouter