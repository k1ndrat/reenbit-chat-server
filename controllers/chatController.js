import Chat from "../models/Chat.js";

const defaultChats = [
  { bot_name: "Петро", bot_surname: "Моставчук" },
  { bot_name: "Міша", bot_surname: "Лебіга" },
  { bot_name: "Андрій", bot_surname: "Мацевко" },
];

const getChats = async (req, res) => {
  try {
    let chats = await Chat.aggregate([
      { $match: { userID: req.params.userID } },
      {
        $lookup: {
          from: "messages",
          localField: "last_message",
          foreignField: "_id",
          as: "last_message",
        },
      },
      { $unwind: { path: "$last_message", preserveNullAndEmptyArrays: true } },

      {
        $addFields: {
          sortField: {
            $cond: {
              if: { $gt: ["$last_message.createdAt", null] },
              then: "$last_message.createdAt",
              else: "$createdAt",
            },
          },
        },
      },
      { $sort: { sortField: -1 } },
    ]);

    if (chats.length === 0) {
      console.log("Adding chats");
      await Chat.insertMany(
        defaultChats.map((chat) => ({ ...chat, userID: req.params.userID }))
      );

      chats = await Chat.find({ userID: req.params.userID }).populate(
        "last_message"
      );
    }
    return res.status(200).json(chats);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createChat = async (req, res) => {
  const { userID, bot_name, bot_surname } = req.body;

  if (!userID || !bot_name || !bot_surname) {
    return res
      .status(400)
      .json({ message: "userID, bot_name, bot_surname are required" });
  }

  try {
    const chat = await Chat.create({ userID, bot_name, bot_surname });
    return res.status(201).json(chat);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateChat = async (req, res) => {
  const chatID = req.params.chatID;
  const { bot_name, bot_surname } = req.body;

  if (!bot_name && !bot_surname) {
    return res
      .status(400)
      .json({ message: "bot_name or bot_surname is required" });
  }

  try {
    await Chat.updateOne({ _id: chatID }, { bot_name, bot_surname });
    return res.status(204).json({ message: "Updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteChat = async (req, res) => {
  const chatID = req.params.chatID;

  const chat = await Chat.findById(chatID);

  if (!chat) {
    return res.status(404).json({ message: "Chat didn`t exist" });
  }

  try {
    await Chat.deleteOne({ _id: chatID });
    console.log("Deleted !!!!!!");
    return res.status(204).json({ message: "Deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export { getChats, createChat, updateChat, deleteChat };
