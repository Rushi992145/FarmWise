import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import axios from "axios";  

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


//routes import

import userRouter from "./routes/user.routes.js"
import blogRouter from "./routes/blog.routes.js"

//routes declaration
app.use("/api/farmwise/users", userRouter)
app.use("/api/farmwise/blog", blogRouter)
app.get('/api/health', (req, res) => {
    res.status(200).json({ message: "Service is healthy!" });
});

app.get("/worldnews", async (req, res) => {
    try {
        const response = await axios.get(
            `https://api.apitube.io/v1/news/category/iab-qag/IAB19-31?limit=50&api_key=${process.env.NEWS_API}`
        );
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export { app };
