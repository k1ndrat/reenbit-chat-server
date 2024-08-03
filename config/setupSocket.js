import { Server } from "socket.io";
import { postMessage } from "../controllers/messageController.js";

export function setupSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    },
    pingTimeout: 180000,
    pingInterval: 25000,
  });

  io.on("connection", (socket) => {
    console.log(`User connected`);

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
    });

    socket.on("subscribe_notification", (userID) => {
      socket.join(userID);
      console.log(`User with ID: ${userID} subscribed notifications`);
    });

    socket.on("join_chat", (data) => {
      socket.join(data);
      console.log(`User joined chat: ${data}`);
    });

    socket.on("message", async (data) => {
      const userMessage = await postMessage({
        author: data.author,
        chatID: data.chatID,
        message: data.message,
      });

      io.to(data.chatID).emit("receive_message", {
        ...data,
        _id: userMessage._id,
      });
      io.to(data.author).emit("receive_notification", {
        ...data,
        _id: userMessage._id,
      });

      const response = await fetch("https://api.quotable.io/random");
      const quote = await response.json();
      setTimeout(async () => {
        const postedMessage = await postMessage({
          author: data.bot_name + " " + data.bot_surname,
          chatID: data.chatID,
          message: quote.content,
        });

        io.to(data.chatID).emit("receive_message", {
          _id: postedMessage._id,
          author: data.bot_name + " " + data.bot_surname,
          bot_name: data.bot_name,
          bot_surname: data.bot_surname,
          chatID: data.chatID,
          message: quote.content,
          createdAt: new Date(Date.now()).toISOString(),
        });

        io.to(data.author).emit("receive_notification", {
          _id: postedMessage._id,
          author: data.bot_name + " " + data.bot_surname,
          bot_name: data.bot_name,
          bot_surname: data.bot_surname,
          chatID: data.chatID,
          message: quote.content,
          createdAt: new Date(Date.now()).toISOString(),
        });
      }, 3000);
    });
  });
}
