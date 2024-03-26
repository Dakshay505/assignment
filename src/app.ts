import express from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser"
import dotenv from "dotenv";
import { errorMiddleware } from "./middleware/errorHandler";
import authRouter from "./routes/authRoutes";
import studentRouter from "./routes/studentRouter";

const app = express();
dotenv.config({path:path.join(__dirname, "..", "public/.env")})

const FRONTEND_URI1 = process.env.FRONTEND_URI1;
const FRONTEND_URI2 = process.env.FRONTEND_URI2;

if (!FRONTEND_URI1 || !FRONTEND_URI2) {
    throw new Error(
      "Missing FRONTEND_URI1 or FRONTEND_URI2 environment variables"
    );
}

// middlewares
app.use(express.json({limit:"10mb"}));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(path.join(__dirname, "..", "build")));
app.use(
    cors({
      credentials: true,
      origin: [FRONTEND_URI1, FRONTEND_URI2],
    })
);
app.use(cookieParser());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/student",studentRouter);


// adding build 
app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "..", "build", "index.html")
    );
});

app.use(errorMiddleware);

export default app;