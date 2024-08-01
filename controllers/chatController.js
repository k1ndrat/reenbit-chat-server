import Chat from "../models/Chat.js";

const defaultChats = [
  { bot_name: "Петро", bot_surname: "Моставчук" },
  { bot_name: "Тіна", bot_surname: "Кароль" },
  { bot_name: "Пес", bot_surname: "Дюк" },
];

const getChats = async (req, res) => {
  try {
    let chats = await Chat.find({ userID: req.params.userID });

    if (chats.length === 0) {
      await Chat.insertMany(
        defaultChats.map((chat) => ({ ...chat, userID: req.params.userID }))
      );

      chats = await Chat.find({ userID: req.params.userID });
    }
    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getChats };
