import { Router } from "express";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import graph from "../ai/graphs.js";
import { getSystemPrompt } from "../ai/prompt.js";
import {Group} from "../models/group.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/:groupId/chat", verifyJWT, async (req, res) => {
  try {
    const { message, threadId } = req.body;
    const { groupId } = req.params;

    // fetch group to get member names for system prompt
    const group = await Group.findById(groupId).populate("members", "fullName");
    const memberNames = group.members.map(m => m.name);

    const result = await graph.invoke(
      {
        messages: [
          new SystemMessage(getSystemPrompt(groupId, memberNames)),
          new HumanMessage(message),
        ],
      },
      {
        configurable: { thread_id: threadId } // ← this is what maintains memory
      }
    );

    const reply = result.messages.at(-1).content;//what reply gemini gives at the very end of the whole convo ---> .at(-1).content
    res.json({ reply });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI layer failed" });
  }
});

export default router;