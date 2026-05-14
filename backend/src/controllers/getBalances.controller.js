import {Expense} from "../models/expense.model.js";
import {Settlement} from "../models/settlement.model.js";
import {Group} from "../models/group.model.js";
import {User} from "../models/user.model.js";
import apiError from "../utils/apiError.js";


const getGroupBalances = async (groupId, userId) => {

  //Pehle check kia ko jo member hai abhi vo es grp ka member hai ki nai
  //saare expenses extract kiya with populating paidBy names and expense name as well
  //saare settlements extract kiya with populating from and to names
  //initialise a balances array 
  //iterate through expenses and add the share of each participant to the balances array to find out final owe aur to recieve
  //iterate through settlements and add the share of each participant to the 
  //balances array to find out final owe aur to recieve
  // now I just seperate out depters and creditors from baalnce array and tthen make transactions
  //in transactions, I check who has less money of the two depter and creditor and then settle that amount
  //this keeps going on until both depter and creditor are present 
  //finally I return the transactions


  const group = await Group.findById(groupId);
  if (!group) {
    throw new apiError(404, "Group not found");
  }

  const isMember = group.members.some(
    m => m.toString() === userId.toString()
  );

  if (!isMember) {
    throw new apiError(403, "Not a member of this group");
  }

  // Fetch data, expense has who paid the bill and was shared by whom
  const expenses = await Expense.find({ group: groupId })
  .populate("paidBy", "fullName")
  
  const settlements = await Settlement.find({ group: groupId });

  //. Initialize balances
  const balances = {};

  group.members.forEach(member => {
    balances[member.toString()] = 0;
  });

  //  Process expenses
  expenses.forEach(exp => {
    if (!exp.paidBy) return; // Skip if payer is missing
    const paidBy = exp.paidBy._id.toString();

    exp.participants.forEach(p => {
      if (!p.user) return; // Skip if participant user is missing
      const user = p.user.toString();
      const share = p.share;

      // Ensure the user exists in balances (might have left the group)
      if (balances[user] === undefined) balances[user] = 0;
      if (balances[paidBy] === undefined) balances[paidBy] = 0;

      if (user === paidBy) {
        balances[user] += (exp.amount - share);
      } else {
        balances[user] -= share;
      }
    });
  });

  //Process settlements
  settlements.forEach(s => {
    if (!s.from || !s.to) return;
    const from = s.from.toString();
    const to = s.to.toString();
    const amount = s.amount;

    if (balances[from] === undefined) balances[from] = 0;
    if (balances[to] === undefined) balances[to] = 0;

    balances[from] += amount;   // paid back → less debt
    balances[to] -= amount;     // received → reduce credit
  });

  //Convert balances → transactions
  const creditors = [];
  const debtors = [];

  for (let user in balances) {
    if (balances[user] > 0.01) { // Use a small epsilon for floating point issues
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
      from: debt.user,
      to: credit.user,
      amount: settleAmount
    });

    debt.amount -= settleAmount;
    credit.amount -= settleAmount;

    if (debt.amount < 0.01) i++;
    if (credit.amount < 0.01) j++;
  }

  const populatedTransactions = await Promise.all(
    transactions.map(async t => {
      const fromUser = await User.findById(t.from).select("fullName");
      const toUser = await User.findById(t.to).select("fullName");

      return {
        from: { _id: fromUser?._id || t.from, name: fromUser?.fullName || "Deleted User" },
        to: { _id: toUser?._id || t.to, name: toUser?.fullName || "Deleted User" },
        amount: t.amount
      };
    })
  );

  // Response
  return {
    balances,
    transactions: populatedTransactions,
    expenses
  }
};

export { getGroupBalances };