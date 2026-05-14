import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addMember, createGroup, deleteGroup, editGroup, getAllGroups, getGroup, getGroupMembers, removeMember } from "../controllers/group.controller.js";
import { chatWithAI, createSettlement, uploadAndProcessBill } from "../controllers/uploadnProcessBill.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { acceptInvitation, getPendingInvitations, rejectInvitation } from "../controllers/invitation.controller.js";

const router= new Router()

router.route("/:groupId/uploadbill").post(verifyJWT, upload.single("file"), uploadAndProcessBill);
router.route("/:groupId/sendchat").post(verifyJWT, chatWithAI);
router.route("/creategroup").post(verifyJWT, upload.single("thumbnail"), createGroup);
router.route("/:groupId/viewgroup").get(verifyJWT, getGroup);
router.route("/:groupId/updategroup").patch(verifyJWT, upload.single("thumbnail"), editGroup);
router.route("/:groupId/deletegroup").delete(verifyJWT, deleteGroup);
router.route("/getallgroups").get(verifyJWT, getAllGroups);
router.route("/:groupId/createsettlement").post(verifyJWT, createSettlement);


//add members to the group
router.route("/:groupId/addmember").post(verifyJWT, addMember);
router.route("/:groupId/removemember").post(verifyJWT, removeMember);
router.route("/:groupId/getgroupmembers").get(verifyJWT, getGroupMembers);

// Invitations
router.route("/invitations/pending").get(verifyJWT, getPendingInvitations);
router.route("/invitations/:invitationId/accept").post(verifyJWT, acceptInvitation);
router.route("/invitations/:invitationId/reject").post(verifyJWT, rejectInvitation);

export default router;