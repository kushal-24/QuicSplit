import Group from "../../../frontend/src/pages/Group"
import { Expense } from "../models/expense.model"
import asyncHandler from "../utils/asyncHandler"
import { getGroupBalances } from "./getBalances.controller"


const getDashboardData = asyncHandler(async (req, res) => {
  const userId = req.user._id

  // find all groups user is part of
  const groups = await Group.find({ members: userId })

  const groupsWithBalance = await Promise.all(groups.map(async (group) => {
    // reuse your extracted function
    const { balances } = await getGroupBalances(group._id)

    // only extract THIS user's balance from the result
    const myBalance = balances[userId.toString()] || 0

    const totalExpenses= await Expense.aggregate([
      {$match: {groupId: group._id}},
      {$group: {_id: null, total: {$sum: "$amount"}}}
    ])
    const totalSpent = totalExpenses[0]?.total || 0

    return {
      _id: group._id,
      name: group.grpName,
      thumbnail: group.thumbnail,
      memberCount: group.members.length,
      totalSpent,
      myBalance   // positive = owed money, negative = owes money
    }
  }))

  return res.status(200).json(new apiResponse(groupsWithBalance, 200, "Dashboard fetched"))
})

export{getDashboardData}