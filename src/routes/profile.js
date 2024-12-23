const express=require("express")
const profileRouter=express.Router()
const {userAuth}=require("../middleware/userAuth")
const {validateEditProfileData}=require("../utils/vadilation")

profileRouter.get("/profile/view",userAuth,async(req,res)=>
    {
        try
        {
            const user= req.user;
            res.send({message:"User profile is,",
                data:user})
    
        }
        catch(err)
        {
            res.status(404).send("something went wrong "+err.message)  
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

    
    
module.exports=profileRouter