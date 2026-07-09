import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import cookieParser from "cookie-parser";
dotenv.config();
connectDB();

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173", "http://localhost:5174"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);


app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Blog API is running successfully 🚀",
    });
});


app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
);
