const mongoose = require("mongoose")


const messagesSchema = new mongoose.Schema(
    {
        senderId:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            require: true
        },
        text:
        {
            type: String,
            require: true
        }
    },{timestamps:true})


 const chatSchema=new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        require:true
    }],
    messages:[messagesSchema]
 })  
 
 
const Messages = mongoose.model("Messages", chatSchema)

module.exports = {Messages}