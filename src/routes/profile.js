const express=require("express")
const profileRouter=express.Router()
const {userAuth}=require("../middleware/userAuth")
const {validateEditProfileData}=require("../utils/vadilation")

profileRouter.get("/profile/view",userAuth,async(req,res)=>
    {
        try
        {
            const user= req.user;
            res.send("User profile is,"+user)
    
        }
        catch(err)
        {
            res.status(404).send("something went wrong "+err.message)  
        }
    })

    profileRouter.post("/profile/edit",userAuth,async(req,res)=>
    {
        try
        {

            const userLoggedInData=req.user;
            if(!validateEditProfileData(req))
            {
                throw new Error("Invalid edit request")
            }
            const loggedInUser=req.user;
            Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key])
            loggedInUser.save();
            res.send({message:"Edited successfully",
                data:loggedInUser
            })

            
        }
        catch(error)
        {
            res.status(400).send("ERROR:"+error.message)
        }
    })
module.exports=profileRouter