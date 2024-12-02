const express=require("express")
const authRouter=express.Router();
const {validateSignUpFeild}=require("../utils/vadilation");
const bcrypt=require("bcrypt")
const User = require("../models/user");


authRouter.post("/signup", async (req, res) => {

   
  

    try {
        const {password,firstName,lastName,emailId,age,photoURL,}=req.body
        //validate the body
        validateSignUpFeild(req.body)

        //create hash
        const hashPassword=await bcrypt.hash(password,10)

        const user = new User({
            firstName,lastName,emailId,password:hashPassword,age,photoURL
        })
        await user.save()
        res.send("user data send successfully")


    }
    catch (err) {
        res.status(401).send("ERROR : " + err.message)
    }
})

authRouter.post("/login",async(req,res)=>
{
    try
    {

       
        const {emailId,password}=req.body;

        const user=await User.findOne({emailId:emailId});
        if(!user)
        {
            throw new Error("Invalid Credentials");
        }
        const isValidPassword=await user.verifyPassword(password);
        if(isValidPassword)
        {
            const token=await user.getJWT();
            res.cookie("token",token,{});
            res.send("Login Successfully"); 
        }
        else{
            throw new Error("Invalid Credentials");
        }

    }
    catch(err)
    {
        res.status(401).send("ERROR : "+err.message);
    }
})

authRouter.post("/logout",async(req,res)=>
{
    res.cookie("token",null,{expires:new Date(Date.now())});
    res.send("logout successful");
})

module.exports=authRouter