const express=require("express")

const app=express();


app.listen(7777)


app.use("/test",(req,res)=>
    {
        res.send("namaste nodejs")
    })
app.get("/user",(req,res)=>
{
    res.send({fisrname:"Sandeep",lastname:"dasari"})
})
app.post("/user",(req,res)=>
{
    res.send("data send to database")
})

