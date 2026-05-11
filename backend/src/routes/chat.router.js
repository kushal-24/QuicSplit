import { Router } from "express";
import { webcrypto } from "crypto"
globalThis.crypto = webcrypto
import { HumanMessage } from "@langchain/core/messages";
import graph from "../ai/graphs.js";
import { Group } from "../models/group.model.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = new Router();

router.post("/:groupId/chat", verifyJWT, async (req, res) => {
  try {
    const { message, threadId } = req.body;
    const { groupId } = req.params;

    // fetch group to get member names for system prompt
    const group = await Group.findById(groupId).populate("members", "fullName");
    const memberNames = group.members.map(m => m.fullName);

    const result = await graph.invoke(
      {
        messages: [
          new HumanMessage(message),
        ],
      },
      {
        configurable: {
          thread_id: threadId,
          groupId: groupId,
          memberNames: memberNames
        } // ← this is what maintains memoryyy
      }
    );

    const reply = result.messages.at(-1).content;//what reply gemini gives at the very end of the whole convo ---> .at(-1).content
    res.json({ reply });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "AI layer failed" });
  }
});

export default router;