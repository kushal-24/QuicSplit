import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Expense from "../models/expense.model.js";

export const getExpenses = tool(async ({ groupId }) => {
  const expenses = await Expense.find({ groupId });
  return JSON.stringify(expenses);
}, { //gemini ko samjhane ke liye what this tiool is doing and what does it need to perform this fucntion
  name: "getExpenses",
  description: "Fetch all expenses for a group from the database",
  schema: z.object({ groupId: z.string() })
});

export const modifyExpenseSplit = tool(async ({ expenseId, memberToRemove }) => {
  // your logic to update the split
}, {
  name: "modifyExpenseSplit",
  description: "Remove or adjust a member's share in a specific expense",
  schema: z.object({
    expenseId: z.string(),
    memberToRemove: z.string()
  })
});
