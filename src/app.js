require('dotenv').config({ path: "src/.env" });
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

// Routers
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FE_ORIGIN,
    credentials: true
}));

// Routes
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// Status endpoint to check if DB is connected
let isDBConnected = false;

app.get("/status", (req, res) => {
    if (isDBConnected) {
        res.json({ status: "success", message: "Database is connected" });
    } else {
        res.status(500).json({ status: "error", message: "Database is not connected" });
    }
});

// Database connection
connectDB()
    .then(() => {
        console.log("DB Connection successfully");
        isDBConnected = true; // Set the flag when the DB is connected
        app.listen(process.env.PORT, () => {
            console.log(`Server connected on port ${process.env.PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
        isDBConnected = false;
    });
