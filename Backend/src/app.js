import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));


app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blog.routes.js"

//routes declaration
app.use("/api/farmwise/users",userRouter)
app.use("/api/farmwise/blog",blogRouter)
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: "Service is healthy!" });
});

export {app};
