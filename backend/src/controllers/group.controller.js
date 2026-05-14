import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import {Group} from "../models/group.model.js";
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { getGroupBalances } from "./getBalances.controller.js";
import { Expense } from "../models/expense.model.js";
import { logActivity } from "../utils/activityLogger.js";
import { User } from "../models/user.model.js";
import { Invitation } from "../models/invitation.model.js";

//ADD AND REMOVE MEMBERS

const addMember = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { a } = req.body; // inviteeId
    const userId = req.user._id;

    const group = await Group.findById(groupId)
    if (!group) {
        throw new apiError(403, "Group was not found");
    }

    const isAlreadyMember = group.members?.some((memberId) => memberId.toString() === a.toString());
    if (isAlreadyMember) {
        throw new apiError(403, "this user is already a member of the board");
    }

    // Check if invitation already exists
    const existingInvitation = await Invitation.findOne({
        group: groupId,
        invitee: a,
        status: "PENDING"
    });

    if (existingInvitation) {
        throw new apiError(400, "Invitation already sent to this user");
    }

    // Create invitation instead of adding directly
    await Invitation.create({
        group: groupId,
        inviter: userId,
        invitee: a,
        status: "PENDING"
    });

    const addedUser = await User.findById(a);

    await logActivity({
        groupId: group._id,
        action: "MEMBER_INVITED",
        description: `${addedUser?.fullName || 'A user'} was invited to the group.`,
        relatedUsers: [...group.members, a]
    });

    return res
        .status(200)
        .json(
            new apiResponse(
                null,
                200,
                "Invitation sent successfully"
            )
        )
})

const removeMember = asyncHandler(async (req, res) => {
    const { groupId } = req.params;
    const { a } = req.body; // userId to remove
  
    const group = await Group.findById(groupId);
  
    if (!group) {
      throw new apiError(404, "Group not found");
    }

    // Ownership check
    if (group.ownerId.toString() !== req.user._id.toString()) {
      throw new apiError(403, "Only the owner can remove members");
    }

    // Prevent owner from removing themselves
    if (a.toString() === group.ownerId.toString()) {
      throw new apiError(403, "Owner cannot be removed from the group");
    }

    const isMember = group.members?.some((memberId) => memberId.toString() === a.toString());
  
    if (!isMember) {
      throw new apiError(403, "User is not a member of this group");
    }
  
    group.members = group.members.filter(
      (memberId) => memberId.toString() !== a.toString()
    );
  
    await group.save();

    const removedUser = await User.findById(a);

    // Let the removed user know, and let the remaining group members know
    await logActivity({
        groupId: group._id,
        action: "MEMBER_REMOVED",
        description: `${removedUser?.fullName || 'A user'} was removed from the group.`,
        relatedUsers: [...group.members, a]
    });
  
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

  const thumbnailLocalPath = req.file?.path;
  let img = null;
  if (thumbnailLocalPath) {
    const response = await uploadOnCloudinary(thumbnailLocalPath);
    img = response?.secure_url;
  }

  if (!grpName) {
    throw new apiError(400, "Group name is required");
  }

  let membersList = [];
  try {
    membersList = typeof members === 'string' ? JSON.parse(members) : (members || []);
  } catch (error) {
    membersList = [];
  }

  // Create group with only the owner first
  const group = await Group.create({
    grpName,
    ownerId: userId,
    members: [userId], // Only owner is a direct member initially
    thumbnail: img
  });

  // Create invitations for all other intended members
  const invitations = membersList
    .filter(m => m.toString() !== userId.toString())
    .map(inviteeId => ({
      group: group._id,
      inviter: userId,
      invitee: inviteeId,
      status: "PENDING"
    }));

  if (invitations.length > 0) {
    await Invitation.insertMany(invitations);
  }

  await logActivity({
      groupId: group._id,
      action: "GROUP_CREATED",
      description: `Group "${grpName}" was created.`,
      relatedUsers: [userId, ...membersList]
  });

  return res
    .status(201)
    .json(
      new apiResponse(
        group,
        201,
        "Group created successfully and invitations sent"
      )
    );
});

const editGroup = asyncHandler(async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  if (!group) {
    throw new apiError(404, "Group not found");
  }

  const thumbnail = req.file?.path;
  const { grpName, deleteThumbnail } = req.body;

  if(thumbnail){
    if(group.thumbnail){
      await deleteFromCloudinary(group.thumbnail);
      group.thumbnail="";
    }
    const response = await uploadOnCloudinary(thumbnail);
    group.thumbnail = response?.secure_url;
  } else if (deleteThumbnail === 'true' && group.thumbnail) {
    await deleteFromCloudinary(group.thumbnail);
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

  // Ownership check
  if (group.ownerId.toString() !== req.user._id.toString()) {
    throw new apiError(403, "Only the owner can delete the group");
  }

  // Cleanup thumbnail from Cloudinary if exists
  if (group.thumbnail) {
    await deleteFromCloudinary(group.thumbnail);
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
    .populate("members", "fullName avatar")
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
    members: group.members.slice(0, 4).map(m => ({
        _id: m._id,
        fullName: m.fullName,
        avatar: m.avatar
    })),
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