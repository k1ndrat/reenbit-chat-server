import express from "express";
import {
  createChat,
  deleteChat,
  getChats,
  updateChat,
} from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userID", getChats);
router.post("/", createChat);
router.put("/:chatID", updateChat);
router.delete("/:chatID", deleteChat);

export default router;
