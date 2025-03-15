import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Message } from "../models/message.model.js";
import { User } from "../models/user.model.js";
import { Server } from "socket.io";

let io;

export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("New user connected");

        socket.on("sendMessage", async (data) => {
            try {
                const { userId, message, threadId, replyTo } = data;
                const newMessage = await Message.create({ user: userId, message, threadId, replyTo });
                
                const populatedMessage = await Message.findById(newMessage._id)
                    .populate("user", "username profilePic")
                    .populate("replyTo", "message user");
                
                io.emit("receiveMessage", populatedMessage);
            } catch (error) {
                console.error("Error sending message: ", error);
            }
        });

        socket.on("disconnect", () => {
            console.log("User disconnected");
        });
    });
};

export const sendMessage = asyncHandler(async (req, res) => {
    const { message, threadId, replyTo } = req.body;
    const userId = req.user.id;

    const newMessage = await Message.create({ user: userId, message, threadId, replyTo });
    const populatedMessage = await Message.findById(newMessage._id)
        .populate("user", "username profilePic")
        .populate("replyTo", "message user");

    io.emit("receiveMessage", populatedMessage);

    return res.status(201).json(new ApiResponse(201, populatedMessage, "Message sent successfully"));
});

export const getMessages = asyncHandler(async (req, res) => {
    const { threadId } = req.query;
    const filter = threadId ? { threadId } : {};
    
    const messages = await Message.find(filter)
        .populate("user", "username profilePic")
        .populate("replyTo", "message user")
        .sort({ createdAt: 1 });

    return res.status(200).json(new ApiResponse(200, messages, "Messages retrieved successfully"));
});
