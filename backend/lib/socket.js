import {Server} from "socket.io";
import http from "http";
import express from "express";

const app=express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
    origin: ["http://localhost:5173", "http://0.0.0.0:5173","http://192.168.1.65:5173"] ,

    }
})
export function getReceiverSocketId(userId){
    return userSocketMap[userId]
        
}
//for storing online users in userid:socketId format
const userSocketMap={}
io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if(userId){
     userSocketMap[userId]=socket.id
     }
     //broadcasting the users with keys(userid as we said we keep format userid: socket id previously getting only socket id)
     io.emit("getOnlineUsers", Object.keys(userSocketMap))
    console.log("user connected",socket.id);
    socket.on("disconnect", () => {
        console.log("user disconnected",socket.id);
        delete(userSocketMap[userId])
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
    })
})

export {io,server,app}