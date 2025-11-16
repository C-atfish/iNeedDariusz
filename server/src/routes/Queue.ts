import { Router } from "express";
import { QueueItemDB } from "../db/QueueItem";

export const QueueRouter = Router();

QueueRouter.get("/waiting", async (req, res) => {
  const waiting = await QueueItemDB.getWaitingQueue();
  res.json(waiting);
});

QueueRouter.post("/new", async (req, res) => {
  console.log("bruh");

  const body = req.body;
  console.log("should create new queue item with body");

  console.log(body);

  if (!body) {
    return res.status(400).json({ ok: false, error: "Missing form data" });
  }
  if (!body.name || !body.email) {
    return res.status(400).json({ ok: false, error: "Missing name or email" });
  }

  const item = await QueueItemDB.createNewQueueItem(body.email, body.name);

  return res.json({ ok: true, item });
});
