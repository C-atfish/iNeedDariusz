import { Router } from "express";
import { ChatMessageDB } from "../db/ChatMessage";

export const ChatRouter = Router();

ChatRouter.get("/messages", async (req, res) => {
  const messages = await ChatMessageDB.getMessages();
  res.json(messages);
});
