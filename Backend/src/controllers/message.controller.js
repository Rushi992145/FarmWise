import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: process.env.CORS_ORIGIN,
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.use((socket, next) => {
        const userId = socket.handshake.auth.userId;
        const token = socket.handshake.auth.token;
        
        console.log('Socket connection attempt:', {
            userId,
            hasToken: !!token,
            cookies: socket.request.cookies
        });
        
        if (!userId || !token) {
            console.error('Authentication failed: missing userId or token');
            return next(new Error("Authentication error"));
        }
        
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            console.log('Token decoded:', decodedToken);
            
            if (decodedToken._id !== userId) {
                console.error('Authentication failed: userId mismatch');
                return next(new Error("Invalid user ID"));
            }
            
            socket.userId = userId;
            console.log('Socket authenticated successfully for user:', userId);
            next();
        } catch (error) {
            console.error("Socket authentication error:", error);
            if (error.name === 'TokenExpiredError') {
                return next(new Error("Token expired"));
            }
            return next(new Error("Invalid token"));
        }
    });

    io.on("connection", (socket) => {
        console.log("User connected:", socket.userId);

        socket.on("sendMessage", async (data) => {
            try {
                const { message, threadId, replyTo, image } = data;
                const newMessage = await Message.create({ 
                    user: socket.userId, 
                    message, 
                    threadId, 
                    replyTo,
                    image 
                });
                
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate("user", "username profilePic")
                    .populate({
                        path: "replyTo",
                        populate: {
                            path: "user",
                            select: "username"
                        }
                    });
                
                io.emit("receiveMessage", populatedMessage);
            } catch (error) {
                console.error("Error sending message: ", error);
                socket.emit("error", { message: "Failed to send message" });
            }
        });

        socket.on("userTyping", (userId) => {
            socket.broadcast.emit("userTyping", userId);
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.userId);
        });
    });
};

export const sendMessage = asyncHandler(async (req, res) => {
    const { message, threadId, replyTo } = req.body;
    const userId = req.user._id;

    let imageUrl;
    if (req.files && req.files.image) {
        const imageLocalPath = req.files.image[0].path;
        const uploadedImage = await uploadOnCloudinary(imageLocalPath);
        if (uploadedImage) {
            imageUrl = uploadedImage.url;
        }
    }

    const newMessage = await Message.create({ 
        user: userId, 
        message, 
        threadId, 
        replyTo,
        image: imageUrl 
    });

    const populatedMessage = await Message.findById(newMessage._id)
        .populate("user", "username profilePic")
        .populate({
            path: "replyTo",
            populate: {
                path: "user",
                select: "username"
            }
        });

    io.emit("receiveMessage", populatedMessage);

    return res.status(201).json(
        new ApiResponse(201, populatedMessage, "Message sent successfully")
    );
});

export const getMessages = asyncHandler(async (req, res) => {
    const { threadId } = req.query;
    const filter = threadId ? { threadId } : {};
    
    const messages = await Message.find(filter)
        .populate("user", "username profilePic")
        .populate({
            path: "replyTo",
            populate: {
                path: "user",
                select: "username"
            }
        })
        .sort({ createdAt: 1 });

    return res.status(200).json(
        new ApiResponse(200, messages, "Messages retrieved successfully")
    );
});
