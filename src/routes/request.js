const express = require("express");
const { userAuth } = require("../middleware/userAuth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express.Router();


requestRouter.post("/request/send/:status/:userid", userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.userid;
        const toUserDetails = await User.findById(toUserId);
        const status = req.params.status;


        const existedStatus = ["ignored", "interested"];
        if (!existedStatus.includes(status)) {
    
            return res
                .status(400)
                .json({ message: "Invalid status type: " + status });
        }

        if (!toUserDetails) {
            return res.status(404).json({ message: "User not found!" });
        }

        const validateConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });


        if (validateConnectionRequest) {
            return res
                .status(400)
                .send({ message: "Connection Request Already Exists!!" });
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId, toUserId, status
        });

        const data = await connectionRequest.save();
    

        res.json({
            message:
                req.user.firstName + " is " + status + " in " + toUserDetails.firstName,
            data,
        });

    } catch (error) {
        res.status(400).send("ERROR: " + error.message);
    }
});


requestRouter.post("/request/review/:status/:requestId", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { status, requestId } = req.params;
        const existedStatus = ["accepted", "rejected"];
        if (!existedStatus.includes(status)) {
            return res.status(400).send("Invalid status Request")
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id: requestId,
            toUserId: loggedInUser._id,
            status: "interested",

        })
        if (!connectionRequest) {
            throw new Error("Connection request not found");
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save()
        res.json({
            message: "Connection accepted successfully",
            data: data
        })
    }
    catch (error) {
        res.status(400).send("ERROR :" + error.message);
    }

})


module.exports = requestRouter