import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import {Group} from "../models/group.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { getGroupBalances } from "./getBalances.controller.js";
import { Expense } from "../models/expense.model.js";

//ADD AND REMOVE MEMBERS

const addMember= asyncHandler(async(req,res)=>{
    const {groupId}= req.params;
    const{a}=req.body;
    const group= await Group.findById(groupId)
    if(!group){
        throw new apiError(403,"Group was not found");
    }

    const isAlreadyMember = group.members?.some((memberId) => memberId.toString() === a.toString());
    if (isAlreadyMember) {
        throw new apiError(403, "this user is already a member of the board");
    }

    group.members.push(a);

    await group.save();

    return res
    .status(200)
    .json( 
        new apiResponse(
            group,
            200,
            "member added successfully"
        )
    )
})

const removeMember = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { a } = req.body;
  
    const group = await Group.findById(groupId);
  
    if (!group) {
      throw new apiError(404, "Group not found");
    }

    const isMember = group.members?.some((memberId) => memberId.toString() === a.toString());
  
    if (!isMember) {
      throw new apiError(403, "User is not a member of this group");
    }
  
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== a.toString()
    );
  
    await group.save();
  
    return res.status(200).json(
      new apiResponse(
        group,
        200,
        "Member removed successfully"
      )
    );
});

const createGroup = asyncHandler(async (req, res) => {
  const { grpName } = req.body;
  const userId = req.user._id;

  // If using multer → file upload
  const thumbnail = req.file?.path || ""; 
  let img=null;
  if(!thumbnail) img= await uploadOnCloudinary(thumbnail);

  if (!grpName) {
    throw new apiError(400, "Group name is required");
  }

  const group = await Group.create({
    grpName,
    ownerId: userId,
    members: [userId],
    thumbnail: img
  });

  return res
  .status(201)
  .json(
    new apiResponse(
      group, 
      201, 
      "Group created successfully")
  );
});

const editGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const { grpName } = req.body;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, "Group not found");
  }

  // Update name if provided
  if (grpName) {
    group.grpName = grpName;
  }

  // Handle thumbnail update
  const newthumbnail= req.file?.path||"";
  let newimg=null;

  if(newthumbnail) newimg= await uploadOnCloudinary(newthumbnail);

  await group.save();

  return res.status(200).json(
    new apiResponse(group, 200, "Group updated successfully")
  );
});

const deleteGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);

  if (!group) {
    throw new apiError(404, "Group not found");
  }

  await Group.findByIdAndDelete(groupId);

  return res.status(200).json(
    new apiResponse(null, 200, "Group deleted successfully")
  );
});

const getGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId)
    .populate("members", "fullName")
    .populate("ownerId", "fullName");

  if (!group) {
    throw new apiError(404, "Group not found");
  }

  const isMember = group.members.some(
    (m) => m._id.toString() === userId.toString()
  );

  if (!isMember) {
    throw new apiError(403, "Not a member of this group");
  }

  const { balances, transactions, expenses } = await getGroupBalances(groupId, userId);

  const totalExpenses= await Expense.aggregate([
        {$match: {group: group._id}},
        {$group: {_id: null, total: {$sum: "$amount"}}}
      ])
      const totalSpent = totalExpenses[0]?.total || 0
      console.log("TOTAL SPENT", totalSpent);

  return res.status(200).json(
    new apiResponse(
      {
        group: {
          _id: group._id,
          grpName: group.grpName,
          thumbnail: group.thumbnail,
          owner: group.ownerId,
          members: group.members
        },
        balances,
        transactions,
        totalSpent,
        expenses
      },
      200,
      "Group fetched successfully"
    )
  );
});

const getAllGroups = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const groups = await Group.find({members: userId})
    .populate("ownerId", "fullName")
    .select("grpName thumbnail members ownerId");

  if (!groups || groups.length === 0) {
    return res.status(200).json(
      new apiResponse([], 200, "No groups found")
    );
  }

  const formattedGroups = groups.map(group => ({
    _id: group._id,
    grpName: group.grpName,
    thumbnail: group.thumbnail,
    membersCount: group.members.length,
    owner: group.ownerId
  }));

  return res.status(200).json(
    new apiResponse(
      formattedGroups,
      200,
      "Groups fetched successfully"
    )
  );
});

const getGroupMembers = asyncHandler(async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user._id;

  const group = await Group.findById(groupId).populate("members", "fullName email");

  if (!group) {
    throw new apiError(404, "Group not found");
  }

  const isMember = group.members.some(
    (m) => m._id.toString() === userId.toString()
  );

  if (!isMember) {
    throw new apiError(403, "Not a member of this group");
  }

  return res.status(200).json(
    new apiResponse(
      group.members,
      200,
      "Group members fetched successfully"
    )
  );
});

export {
  addMember,
  removeMember,
  deleteGroup,
  editGroup,
  createGroup,
  getGroup,
  getAllGroups,
  getGroupMembers
}