import express from "express";
const app = express();
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cors from "cors";
import connectDB from "./config/dbConn.js";
import * as dotenv from "dotenv";
import { setupSocketServer } from "./config/setupSocket.js";
dotenv.config();

import messageRouter from "./routes/message.js";
import chatRouter from "./routes/chat.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors({ origin: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// ROUTES

app.use("/message", messageRouter);
app.use("/chat", chatRouter);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  const expressServer = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    setupSocketServer(expressServer);
  });
});

// sockets
// function setupSocketServer(server) {
//   const io = new Server(server, {
//     cors: {
//       origin: "*",
//     },
//   });

//   io.on("connection", (socket) => {
//     console.log(`User ${socket.id} connected`);

//     socket.on("join_chat", (data) => {
//       socket.join(data);
//       console.log(`User with ID: ${socket.id} joined chat: ${data}`);
//     });

//     socket.on("message", (data) => {
//       console.log(data);
//       socket
//         .to(data.chat)
//         .emit(
//           "receive_message",
//           `${socket.id.substring(0, 5)}: ${data.message}`
//         );
//     });
//   });
// }
