import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

const postMessage = async (body) => {
  const { author, chatID, message } = body;

  if (!author || !chatID || !message) {
    console.error({ message: "author, chatID, message are required" });

    return res
      .status(400)
      .json({ message: "author, chatID, message are required" });
  }

  try {
    // store the new episode
    const createdMessage = await Message.create({
      author,
      chatID,
      message,
    });

    await Chat.updateOne({ _id: chatID }, { last_message: createdMessage._id });

    // res.status(201).json({ success: "New message was added successfully" });
    console.log({ success: "New message was added successfully" });
  } catch (error) {
    // res.status(500).json({ message: error.message });
    console.error({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  const chatID = req.params.chatID;

  try {
    const messages = await Message.find({ chatID: chatID });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
    // console.error(error.message);
  }
};

export { postMessage, getMessages };
