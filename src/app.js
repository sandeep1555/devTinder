const express=require("express")

const app=express();


app.listen(7777)

app.use("/hello",(req,res)=>
{
      res.send("hello world")
})

app.use("/info",(req,res)=>
{
    res.send("hi this is info page")
})