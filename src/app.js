const express=require("express")

const app=express();





app.get("/user",(req,res)=>
{
    throw new Error("adfvfjvfd")
    res.send("user data")
})


app.use("/",(err,req,res,next)=>
{
    if(err)
    {
        res.status(501).send("something went wrong")
    }
})








app.listen(7777)




