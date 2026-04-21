import {Expense} from "../models/expense.model.js";
import {Settlement} from "../models/settlement.model.js";
import {Group} from "../models/group.model.js";
import {User} from "../models/user.model.js";
import apiError from "../utils/apiError.js";


const getGroupBalances = async (groupId, userId) => {

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
  .populate("expenseName")
  .populate("paidBy", "fullName")
  
  const settlements = await Settlement.find({ group: groupId });

  //. Initialize balances
  const balances = {};

  group.members.forEach(member => {
    balances[member.toString()] = 0;
  });

  //  Process expenses
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
    });
  });

  //Process settlements jisko mile hai usse dept kam karnaa
  settlements.forEach(s => {
    const from = s.from.toString();
    const to = s.to.toString();
    const amount = s.amount;

    balances[from] += amount;   // paid back → less debt
    balances[to] -= amount;     // received → reduce credit

  });

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

  const populatedTransactions = await Promise.all(
    transactions.map(async t => {
      const fromUser = await User.findById(t.from).select("fullName");
      const toUser = await User.findById(t.to).select("fullName");

      return {
        from: { _id: fromUser._id, name: fromUser.fullName },
        to: { _id: toUser._id, name: toUser.fullName },
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