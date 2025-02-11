const express = require("express");
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config();
const http=require("http");

const app = express();
const PORT = process.env.PORT
// Routers
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");
const messageRouter = require("./src/routes/messages");
const initailizeSocket = require("./src/utils/socket");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FE_ORIGIN,
    credentials: true,
    
}));

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", messageRouter);

// Status endpoint to check if DB is connected
let isDBConnected = false;

app.get("/status", (req, res) => {
    if (isDBConnected) {
        res.json({ status: "success", message: "Database is connected" });
    } else {
        res.status(500).json({ status: "error", message: "Database is not connected" });
    }
});


const server=http.createServer(app);


initailizeSocket(server)
// Database connection
connectDB()
    .then(() => {
        console.log("DB Connection successfully");
        isDBConnected = true; // Set the flag when the DB is connected
        server.listen(PORT, () => {
            console.log(`Server connected on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
        isDBConnected = false;
    });
