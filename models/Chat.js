import mongoose, { Types } from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    userID: {
      type: String,
      required: true,
    },
    bot_name: {
      type: String,
      required: true,
    },
    bot_surname: {
      type: String,
      required: true,
    },
    last_message: {
      type: Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
