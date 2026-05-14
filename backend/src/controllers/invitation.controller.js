import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { Invitation } from "../models/invitation.model.js";
import { Group } from "../models/group.model.js";
import { logActivity } from "../utils/activityLogger.js";

const getPendingInvitations = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const invitations = await Invitation.find({
        invitee: userId,
        status: "PENDING"
    }).populate("group", "grpName thumbnail").populate("inviter", "fullName");

    return res.status(200).json(
        new apiResponse(invitations, 200, "Pending invitations fetched successfully")
    );
});

const acceptInvitation = asyncHandler(async (req, res) => {
    const { invitationId } = req.params;
    const userId = req.user._id;

    const invitation = await Invitation.findById(invitationId).populate("group");

    if (!invitation) {
        throw new apiError(404, "Invitation not found");
    }

    if (invitation.invitee.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to accept this invitation");
    }

    if (invitation.status !== "PENDING") {
        throw new apiError(400, "Invitation is already " + invitation.status.toLowerCase());
    }

    const group = await Group.findById(invitation.group._id);
    if (!group) {
        throw new apiError(404, "Group not found");
    }

    // Add member to group if not already there
    if (!group.members.includes(userId)) {
        group.members.push(userId);
        await group.save();
    }

    invitation.status = "ACCEPTED";
    await invitation.save();

    await logActivity({
        groupId: group._id,
        action: "MEMBER_ADDED",
        description: `${req.user.fullName} accepted the invitation and joined the group.`,
        relatedUsers: group.members
    });

    return res.status(200).json(
        new apiResponse(group, 200, "Invitation accepted successfully")
    );
});

const rejectInvitation = asyncHandler(async (req, res) => {
    const { invitationId } = req.params;
    const userId = req.user._id;

    const invitation = await Invitation.findById(invitationId);

    if (!invitation) {
        throw new apiError(404, "Invitation not found");
    }

    if (invitation.invitee.toString() !== userId.toString()) {
        throw new apiError(403, "You are not authorized to reject this invitation");
    }

    invitation.status = "REJECTED";
    await invitation.save();

    // Log rejection (Optional, but user asked for activity log showing request accepted or rejected)
    await logActivity({
        groupId: invitation.group,
        action: "INVITE_REJECTED",
        description: `${req.user.fullName} rejected the invitation to join the group.`,
        relatedUsers: [invitation.inviter, invitation.invitee]
    });

    return res.status(200).json(
        new apiResponse(null, 200, "Invitation rejected successfully")
    );
});

export {
    getPendingInvitations,
    acceptInvitation,
    rejectInvitation
};
