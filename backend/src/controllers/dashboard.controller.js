import { Group } from "../models/group.model.js"
import { Expense } from "../models/expense.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import { getGroupBalances } from "./getBalances.controller.js"
import apiResponse from "../utils/apiResponse.js"


const getDashboardData = asyncHandler(async (req, res, next) => {
  const userId = req.user._id

  const groups = await Group.find({ members: userId }).populate("members", "fullName avatar")

  const groupsWithBalance = await Promise.all(groups.map(async (group) => {
    const { balances } = await getGroupBalances(group._id, userId)

    const myBalance = balances[userId.toString()] || 0

    const totalExpenses= await Expense.aggregate([
      {$match: {group: group._id}},
      {$group: {_id: null, total: {$sum: "$amount"}}}
    ])
    const totalSpent = totalExpenses[0]?.total || 0

    return {
      _id: group._id,
      name: group.grpName,
      thumbnail: group.thumbnail,
      memberCount: group.members.length,
      members: group.members.slice(0, 4).map(m => ({
          _id: m._id,
          fullName: m.fullName,
          avatar: m.avatar
      })),
      totalSpent,
      myBalance   // positive = owed money, negative = owes money
    }
  }))

  return res.status(200).json(new apiResponse(groupsWithBalance, 200, "Dashboard fetched"))
})

export {getDashboardData}