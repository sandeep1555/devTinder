const express = require("express")
const connectDB = require("./config/database")

const { model } = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const authRouter=require("./routes/auth")
const profileRouter=require("./routes/profile")
const requestRouter=require("./routes/request")
const userRouter=require("./routes/user")
const cors=require("cors")

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))

app.use("/",authRouter)
app.use("/",profileRouter)
app.use("/",requestRouter)
app.use("/",userRouter)

connectDB().
    then(() => {
        console.log("DB Connection successfully")
        app.listen(7777, () => {
            console.log("server connected ")
        })


    }).catch((err) => {
        console.log("Db connection failed")
    })















