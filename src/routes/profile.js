const express = require("express")
const profileRouter = express.Router()
const { userAuth } = require("../middleware/userAuth")
const { validateEditProfileData } = require("../utils/vadilation")
const User = require("../models/user")
const ConnectionRequest = require("../models/connectionRequest")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user;

        const NumberOfRequests=await ConnectionRequest.countDocuments({
            toUserId: user._id,
            status: "interested",
        })
        const userObject = user.toObject();
        userObject.request_count = NumberOfRequests;
        res.send({
            message: "User profile is,",
            data: userObject
        })


    }
    catch (err) {
        res.status(404).send("something went wrong " + err.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        const userLoggedInData = req.user;

        // Optional validation for incoming edit requests
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }

        // Update only the allowed fields
        const allowedUpdates = ["firstName", "lastName", "age", "gender", "photoURL", "about", "skills"];
        const updates = Object.keys(req.body);

        const isValidUpdate = updates.every((key) => allowedUpdates.includes(key));
        if (!isValidUpdate) {
            return res.status(400).send({ message: "Invalid fields in request body" });
        }

        // Update user data
        updates.forEach((key) => (userLoggedInData[key] = req.body[key]));

        // Save the updated user and handle validation errors
        await userLoggedInData.save();

        res.send({
            message: "Edited successfully",
            data: userLoggedInData,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            // Mongoose validation error
            return res.status(400).send({ message: "Validation error", details: error.errors });
        }
        // General error
        res.status(400).send({ message: "Error editing profile", details: error.message });
    }
});



profileRouter.get("/profile/:userid", async (req, res) => {
    try {
        const { userid } = req.params;

        // Find user by ID
        const user = await User.findById(userid).select("-password");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }



        res.status(200).json({
            message: "profile is fetched",
            data: user
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});



module.exports = profileRouter