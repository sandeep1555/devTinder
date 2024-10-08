const express=require("express")

const app=express();

const {adminAuth}=require("./middleware/auth")

const {userAuth}=require("./middleware/userAuth")

app.use("/admin",adminAuth)


app.get("/admin/user",(req,res)=>
    {
        console.log("admin/user")
        res.send("this is admin user")
    })


app.get("/admin/user/id",(req,res)=>
    {
        console.log("admin/user/id")
        res.send("this is admin user id")
    })












app.listen(7777)




