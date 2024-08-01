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
