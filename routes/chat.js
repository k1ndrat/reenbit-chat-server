import express from "express";
import { getChats } from "../controllers/chatController.js";

const router = express.Router();

router.get("/:userID", getChats);

export default router;
