require('dotenv').config();
const mongoose = require("mongoose")
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@namastenode.lxw1p.mongodb.net/devTinder")
}

module.exports = connectDB