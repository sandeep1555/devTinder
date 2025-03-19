require('dotenv').config();
const express = require("express")
const authRouter = express.Router();
const { validateSignUpFeild } = require("../utils/vadilation");
const bcrypt = require("bcrypt")
const User = require("../models/user");
const ConnectionRequest = require('../models/connectionRequest');


authRouter.post("/signup", async (req, res) => {




    try {
        const { password, firstName, lastName, emailId, age, photoURL, } = req.body
        //validate the body
        validateSignUpFeild(req.body)

        //create hash
        const hashPassword = await bcrypt.hash(password, 10)

        const user = new User({
            firstName, lastName, emailId, password: hashPassword, age, photoURL: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s"
        })
        const savedUser = await user.save();
        const token = await savedUser.getJWT();

        res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), secure: process.env.NODE_ENV === "production", httpOnly: true, secure: true, sameSite: 'None' });


        res.json({ message: "User Added successfully!", data: savedUser ,token:token});


    }
    catch (err) {
        res.status(401).send(err.message)
    }
})

authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId });
        if (!user) {
            throw new Error("Invalid Credentials");
        }
        const isValidPassword = await user.verifyPassword(password);
        if (isValidPassword) {
            const token = await user.getJWT();
            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000), secure: process.env.NODE_ENV === "production", httpOnly: true, secure: true, sameSite: 'None' });
            // res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000),secure:process.env.NODE_ENV === "production",httpOnly: true, secure: true,sameSite: 'None'});

            const NumberOfRequests=await ConnectionRequest.countDocuments({
                toUserId: user._id,
                status: "interested",
            })
            const userObject = user.toObject();
            userObject.request_count = NumberOfRequests;
            
            res.send({
                message: "Login Successfully",
                token:token,
                data: userObject
            }
            );
        }
        else {
            throw new Error("Invalid Credentials");
        }

    }
    catch (err) {
        res.status(401).send(err.message);
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date(Date.now()), httpOnly: true, 
        secure: process.env.NODE_ENV === "production",sameSite: 'None' });
    res.send("logout successful");
})

module.exports = authRouter