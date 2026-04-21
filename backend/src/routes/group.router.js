import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addMember, createGroup, deleteGroup, editGroup, getAllGroups, getGroup, getGroupMembers, removeMember } from "../controllers/group.controller.js";
import { chatWithAI, uploadAndProcessBill } from "../controllers/uploadnProcessBill.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router= new Router()

router.route("/:groupId/uploadbill").post(verifyJWT, upload.single("file"), uploadAndProcessBill);
router.route("/:groupId/sendchat").post(verifyJWT, chatWithAI);
router.route("/creategroup").post(verifyJWT, createGroup);
router.route("/:groupId/viewgroup").get(verifyJWT, getGroup);
router.route("/:groupId/updategroup").patch(verifyJWT, editGroup);
router.route("/:groupId/deletegroup").delete(verifyJWT, deleteGroup);
router.route("/getallgroups").get(verifyJWT, getAllGroups);



//add members to the group
router.route("/:groupId/addmember").post(verifyJWT, addMember);
router.route("/:groupId/removemember").post(verifyJWT, removeMember);
router.route("/:groupId/getgroupmembers").get(verifyJWT, getGroupMembers);

export default router;