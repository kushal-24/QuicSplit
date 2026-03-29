import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {Expense} from "../models/expense.model.js";
import {Settlement} from "../models/settlement.model.js";
import {Group} from "../models/group.model.js"
import { User } from "../models/user.model.js";
import fuzzy from "fuzzysort"

const getExpensesTool = tool(async ({ groupId }) => {
  const expenses = await Expense.find({ groupId: groupId });
  return JSON.stringify(expenses);
}, { //gemini ko samjhane ke liye what this tiool is doing and what does it need to perform this fucntion
  name: "getExpenses",
  description: "Fetch all expenses for a group from the database",
  schema: z.object({ groupId: z.string() })
});

const createExpenseTool = tool(async ({ groupId, amt, paidBy, ppl, name }) => {
  const len = ppl.length;
  const sharedAmt= amt/len;

  const paidByResult = fuzzy.go(paidBy, groupUsers, { key: "fullName" });
  const paidByUser = paidByResult[0]?.obj;
  if (!paidByUser) return `${paidBy} is not a member of this group`;

  const group= await Group.findById(groupId);
  const groupUsers = await User.find({ _id: { $in: group.members } }).select("fullName _id");

  const participants=[];
  for(const p of ppl){
    const nameResult= fuzzy.go(p, groupUsers, {key: "fullName"});
    const matched = nameResult[0]?.obj;

    if (!matched) {
      return `${name} is not a member of this group`;
    }
    participants.push({user: matched._id, share: sharedAmt })
  }
  const exp = await Expense.create({
    group: groupId,
    paidBy: paidBy,
    amount: amt,
    name: name,
    participants: participants
  })

  return `Expense of ₹${amt} created, split among ${ppl.join(", ")}`;
},
  {
    name: "createExpense",
    description: "Create an expense whenever a bill is scanned ",
    schema: z.object({
      groupId: z.string(),
      amt: z.number(),
      paidBy: z.string(),
      ppl: z.array(z.string()),
      name: z.string()
    })
})

const calculateGroupBalancesTool = tool(async ({groupId}) => {
  const group = await Group.findById(groupId);

  const expenses = await Expense.find({ group: groupId });
  const settlements = await Settlement.find({ group: groupId });

  const balances = {};
  group.members.forEach(member => {
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
  return JSON.stringify({balances, transactions});
},
{
  name: "getAccountBalancesNSettle",
  description: `calculate what are the balances of every participant in the expenses of the grp, and calculates net 
  credit to be recieved or dept to be paid back`,
  schema: z.object({ groupId: z.string() })
})

const reduceXinYTool= tool(async({groupId, amt, name1, name2})=>{
  const group= await Group.findById(groupId);
  const users = await User.find({ _id: { $in: group.members } }).select("fullName _id");
  //esse we get all the members of that group in the variable USERS

  const fromResult = fuzzy.go(name1, users, { key: "fullName" });
  const toResult = fuzzy.go(name2, users, { key: "fullName" });
  
  const y = fromResult[0]?.obj;
  const z = toResult[0]?.obj;

  if(!y || !z){
    return "No user has been found"
  }

  await  Settlement.create({
    group: groupId,
    from: y._id,
    to: z._id,
    amount: amt,
    note: "",
    status: "completed"
  });
  await calculateGroupBalancesTool(groupId);
  //groupId, amt, name1, name2
},{
  name: "transaction_n_settlement",
  description: "Create a settlement whenever we have to perform a transaction and then call the calculateGroupBalances() tool",
  schema: z.object({ 
    groupId: z.string(),
    amt: z.number(),
    name1: z.string(),
    name2: z.string()
  })
})

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

export {
  getExpensesTool,
  createExpenseTool,
  calculateGroupBalancesTool,
  reduceXinYTool,
  deleteExpenseTool,
}


