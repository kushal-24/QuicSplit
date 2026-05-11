import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {Expense} from "../models/expense.model.js";
import {Settlement} from "../models/settlement.model.js";
import { Group } from "../models/group.model.js"
import { User } from "../models/user.model.js";
import fuzzy from "fuzzysort";
import { logActivity } from "../utils/activityLogger.js";

const getExpensesTool = tool(async ({ groupId }) => {
  const expenses = await Expense.find({ groupId: groupId });
  return JSON.stringify(expenses);
}, { //gemini ko samjhane ke liye what this tiool is doing and what does it need to perform this fucntion
  name: "getExpenses",
  description: "Fetch all expenses for a group from the database",
  schema: z.object({ groupId: z.string() })
});

const createExpenseTool = tool(async ({ groupId, amt, paidBy, ppl, name }) => {
  const group = await Group.findById(groupId);
  if (!group) return "Group not found";

  const groupUsers = await User.find({ _id: { $in: group.members } }).select("fullName _id");

  // Verify who paid
  const paidByResult = fuzzy.go(paidBy, groupUsers, { key: "fullName" });
  const paidByUser = paidByResult[0]?.obj;
  if (!paidByUser) return `${paidBy} is not a member of this group`;

  const sharedAmt = amt / ppl.length;
  const participants = [];

  for (const p of ppl) {
    const nameResult = fuzzy.go(p, groupUsers, { key: "fullName" });
    const matched = nameResult[0]?.obj;

    if (!matched) {
      return `Member "${p}" not found in this group.`;
    }
    participants.push({ user: matched._id, share: sharedAmt });
  }

  const exp = await Expense.create({
    group: groupId,
    paidBy: paidByUser._id,
    amount: amt,
    expenseName: name,
    participants: participants
  });

  await logActivity({
    groupId: groupId,
    action: "EXPENSE_CREATED",
    description: `Expense "${name}" of ₹${Math.round(amt)} was created via AI.`,
    relatedUsers: group.members
  });

  return `Expense "${name}" of ₹${Math.round(amt)} created successfully. Paid by ${paidByUser.fullName} and split among ${ppl.join(", ")}.`;
},
  {
    name: "createExpense",
    description: "Create an expense for a group. Provide the total amount, who paid, the participants, and a name for the expense.",
    schema: z.object({
      groupId: z.string(),
      amt: z.number().describe("Total amount of the expense"),
      paidBy: z.string().describe("Name of the person who paid the bill"),
      ppl: z.array(z.string()).describe("List of member names who shared this expense"),
      name: z.string().describe("What was this expense for? (e.g. 'Dinner', 'Tacos')")
    })
  });
//WORKING

const calculateGroupBalancesTool = tool(async ({ groupId }) => {
  const group = await Group.findById(groupId).populate("members", "fullName");
  if (!group) return "Group not found";

  const idToName = {};
  group.members.forEach(member => {
    idToName[member._id.toString()] = member.fullName;
  });

  const expenses = await Expense.find({ group: groupId });
  const settlements = await Settlement.find({ group: groupId });

  const balances = {};
  group.members.forEach(member => {
    balances[member._id.toString()] = 0;
  });

  expenses.forEach(exp => {
    const paidBy = exp.paidBy.toString();
    exp.participants.forEach(p => {
      const user = p.user.toString();
      const share = p.share;

      if (user === paidBy) {
        balances[user] += (exp.amount - share);
      } else {
        balances[user] -= share;
      }
    });
  });

  settlements.forEach(s => {
    const from = s.from.toString();
    const to = s.to.toString();
    const amount = s.amount;

    balances[from] += amount;
    balances[to] -= amount;
  });

  const creditors = [];
  const debtors = [];

  for (let user in balances) {
    if (balances[user] > 0.01) { // Ignore tiny rounding errors
      creditors.push({ user, amount: balances[user] });
    } else if (balances[user] < -0.01) {
      debtors.push({ user, amount: -balances[user] });
    }
  }

  const transactions = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debt = debtors[i];
    const credit = creditors[j];
    const settleAmount = Math.min(debt.amount, credit.amount);

    transactions.push({
      from: idToName[debt.user] || debt.user,
      to: idToName[credit.user] || credit.user,
      amount: settleAmount.toFixed(2)
    });

    debt.amount -= settleAmount;
    credit.amount -= settleAmount;

    if (debt.amount < 0.01) i++;
    if (credit.amount < 0.01) j++;
  }

  const humanReadableBalances = {};
  for (let id in balances) {
    humanReadableBalances[idToName[id] || id] = balances[id].toFixed(2); //format it to 2 decimal places (as a string).
  }

  return JSON.stringify({
    message: "Here are the net settlements needed to clear all debts:",
    suggestedTransactions: transactions,
    netBalances: humanReadableBalances
  });
}, {
  name: "getAccountBalancesNSettle",
  description: "Calculate what are the balances of every participant and suggest net transactions to settle up.",
  schema: z.object({ groupId: z.string() })
});
//WORKING

const recordSettlement = tool(async ({ groupId, amt, fromUser, toUser }) => {
  const group = await Group.findById(groupId);
  if (!group) return "Group not found";

  const users = await User.find({ _id: { $in: group.members } }).select("fullName _id");

  const fromResult = fuzzy.go(fromUser, users, { key: "fullName" });
  const toResult = fuzzy.go(toUser, users, { key: "fullName" });

  const sender = fromResult[0]?.obj;
  const receiver = toResult[0]?.obj;

  if (!sender || !receiver) {
    return `Could not find users. Make sure both ${fromUser} and ${toUser} are in the group.`;
  }

  await Settlement.create({
    group: groupId,
    from: sender._id,
    to: receiver._id,
    amount: amt,
    note: "Settled via AI chat",
    status: "completed"
  });

  await logActivity({
    groupId: groupId,
    action: "SETTLEMENT_CREATED",
    description: `${sender.fullName} paid ₹${Math.round(amt)} to ${receiver.fullName} via AI.`,
    relatedUsers: [sender._id, receiver._id]
  });

  // Re-calculate balances so the AI knows the new state
  const updatedBalances = await calculateGroupBalancesTool.invoke({ groupId });

  return `Successfully recorded payment: ${sender.fullName} paid ₹${amt} to ${receiver.fullName}. New status: ${updatedBalances}`;
}, {
  name: "recordSettlement",
  description: "Record a payment or settlement between two members of a group.",
  schema: z.object({
    groupId: z.string(),
    amt: z.number().describe("The amount being paid"),
    fromUser: z.string().describe("The name of the person paying money"),
    toUser: z.string().describe("The name of the person receiving money")
  })
});
//WORKING

const deleteExpenseTool = tool(async ({ groupId, expName }) => {

    const group = await Group.findById(groupId);
    if (!group) throw new Error("Group not found");

    const expenses = await Expense.find({ group: groupId }).select("expenseName _id");

    const expResult = fuzzy.go(expName, expenses, { key: "expenseName" });
    const tobedelexp = expResult[0]?.obj;

    if (!tobedelexp) {
      throw new Error("Expense not found");
    }

    await Expense.findByIdAndDelete(tobedelexp._id);

    await logActivity({
      groupId: groupId,
      action: "EXPENSE_DELETED",
      description: `Expense "${tobedelexp.expenseName}" was deleted via AI.`,
      relatedUsers: group.members
    });

    return `Expense "${tobedelexp.name}" deleted successfully`;
  },
  {
    name: "deleteExpense",
    description: "Delete an expense from a group using its name",
    schema: z.object({
      groupId: z.string(),
      expName: z.string(),
    })
  }
);
//WORKING

export {
  getExpensesTool,
  createExpenseTool,
  calculateGroupBalancesTool,
  recordSettlement,
  deleteExpenseTool,
}


