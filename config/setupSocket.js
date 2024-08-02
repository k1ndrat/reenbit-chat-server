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
      await postMessage({
        author: data.author,
        chatID: data.chatID,
        message: data.message,
      });

      const response = await fetch("https://api.quotable.io/random");
      const quote = await response.json();
      setTimeout(async () => {
        io.to(data.chatID).emit("receive_message", {
          author: data.bot,
          chatID: data.chatID,
          message: quote.content,
          createdAt: new Date(Date.now()).toISOString(),
        });

        io.to(data.author).emit("receive_notification", {
          author: data.bot,
          chatID: data.chatID,
          message: quote.content,
          createdAt: new Date(Date.now()).toISOString(),
        });

        await postMessage({
          author: data.bot,
          chatID: data.chatID,
          message: quote.content,
        });
      }, 3000);
    });
  });
}
