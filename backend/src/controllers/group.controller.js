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
  const { grpName, members } = req.body;
  const userId = req.user._id;

  // thumbnail is uploaded via multer (upload.single("thumbnail"))
  const thumbnailLocalPath = req.file?.path;
  let img = null;
  if (thumbnailLocalPath) {
    const response = await uploadOnCloudinary(thumbnailLocalPath);
    img = response?.url;
  }

  if (!grpName) {
    throw new apiError(400, "Group name is required");
  }

  // members might come as a JSON string if sent via FormData
  let membersList = [];
  try {
    membersList = typeof members === 'string' ? JSON.parse(members) : (members || []);
  } catch (error) {
    membersList = [];
  }

  // Ensure owner is in the members list and unique using creationn of a set
  const allMembers = Array.from(
    new Set([userId.toString(), ...membersList.map(m => m.toString())]));

  const group = await Group.create({
    grpName,
    ownerId: userId,
    members: allMembers,
    thumbnail: img
  });

  return res
    .status(201)
    .json(
      new apiResponse(
        group,
        201,
        "Group created successfully"
      )
    );
});

const editGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    throw new apiError(404, "Group not found");
  }

  //ownerId check
  if(group.ownerId.toString() !== req.user._id.toString()){
    throw new apiError(403, "You are not the owner of this group");
  }

  const thumbnail = req.file?.path;
  const { grpName, deleteThumbnail } = req.body;

  if(thumbnail){
    if(group.thumbnail){
      await deleteFileFromCloudinary(group.thumbnail);
      group.thumbnail="";
    }
    const response = await uploadOnCloudinary(thumbnail);
    group.thumbnail = response?.url;
  } else if (deleteThumbnail === 'true' && group.thumbnail) {
    await deleteFileFromCloudinary(group.thumbnail);
    group.thumbnail = "";
  }

  // Update name if provided
  if (grpName) {
    group.grpName = grpName;
  }

  await group.save({validateBeforeSave: false});

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