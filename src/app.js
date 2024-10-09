const express = require("express")
const connectDB = require("./config/database")
const User = require("./models/user")
const app = express();

app.use(express.json())


app.post("/signup", async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        res.send("user data send successfully")


    }
    catch (err) {
        res.send("user data not send" + err.message)
    }
})



connectDB().
    then(() => {
        console.log("DB Connection successfully")
        app.listen(7777, () => {
            console.log("server connected ")
        })


    }).catch((err) => {
        console.log("Db connection failed")
    })















