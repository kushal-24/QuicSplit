import { tool } from "@langchain/core/tools";
import { z } from "zod";
import Expense from "../models/expense.model.js";
import Settlement from "../models/settlement.model.js";
import Group from "../models/group.model.js"

const getExpenses = tool(async ({ groupId }) => {
  const expenses = await Expense.find({ groupId });
  return JSON.stringify(expenses);
}, { //gemini ko samjhane ke liye what this tiool is doing and what does it need to perform this fucntion
  name: "getExpenses",
  description: "Fetch all expenses for a group from the database",
  schema: z.object({ groupId: z.string() })
});

const createExpense = tool(async ({ groupId, amt, paidBy, ppl }) => {
  const participants = []
  const len = ppl.length;
  const share = amt / len;
  for (const p of ppl) {
    participants.push({ user: p, share });
  }

  const exp = await Expense.create({
    group: groupId,
    paidBy: paidBy,
    amount: amt,
    pariticipants: participants
  })

  return `Expense of ₹${amt} created, split among ${ppl.join(", ")}`;
},
  {
    name: "createExpense",
    description: "Create an expense whenever a bill is scanned ",
    schema: z.object({ groupId: z.string() })
  })

const getGroupBalances = tool(async (groupId) => {
  const group = await Group.findById(groupId);

  const expenses = await Expense.find({ group: groupId });
  const settlements = await Settlement.find({ group: groupId });

  const balances = {};
  group.members.array.forEach(member => {
    balances[member.toString()] = 0;
  });

  expenses.forEach(exp => {
    const paidBy = exp.paidBy.toString();

    exp.participants.forEach(p => {
      const user = p.user.toString();
      const share = p.share;

      if (user === paidBy) {
        balances[user] += (exp.amount - share); //usne hi pay kia hai toh uska '+' me rakho
      } else {
        balances[user] -= share;
      }
    })
  })
  
  settlements.forEach(s=>{
    const from= s.from.toString();
    const to=s.to.toString();
    const amount= s.amount;

    balances[from] +=amount;
    balances[to] -=amount;
  })

  //Convert balances → transactions
  const creditors = [];
  const debtors = [];

  for (let user in balances) {
    if (balances[user] > 0) {
      creditors.push({ user, amount: balances[user] });
    } else if (balances[user] < 0) {
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
      from: debt.user,
      to: credit.user,
      amount: settleAmount
    });

    debt.amount -= settleAmount;
    credit.amount -= settleAmount;

    if (debt.amount === 0) i++;
    if (credit.amount === 0) j++;
  }

})

