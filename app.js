require('dotenv').config({ path: "src/.env" });
const express = require("express");
const connectDB = require("./src/config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
const PORT=process.env.PORT || 7777
// Routers
const authRouter = require("./src/routes/auth");
const profileRouter = require("./src/routes/profile");
const requestRouter = require("./src/routes/request");
const userRouter = require("./src/routes/user");

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
        app.listen(PORT, () => {
            console.log(`Server connected on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("DB connection failed", err);
        isDBConnected = false;
    });
