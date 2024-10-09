const mongoose=require("mongoose")

const connectDB= async()=>
{
    await mongoose.connect("mongodb+srv://sandeep614:ZOM8SEp8Xt9JuS4X@namastenode.lxw1p.mongodb.net/devTinder")
}

module.exports=connectDB