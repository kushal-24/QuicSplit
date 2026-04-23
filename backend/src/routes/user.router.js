import { Router } from "express";
import { changeUserPass, createUser, deleteUser, getAllUsers, getUserDetails, refreshAccessToken, updateFullName, userLogin, userLogout, updateAvatar, deleteAvatar } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getDashboardData } from "../controllers/dashboard.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router= new Router();

router.route("/signup").post(createUser);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJWT, userLogout);
router.route("/changepassword").post(verifyJWT, changeUserPass);
router.route("/updatefullname").post(verifyJWT, updateFullName);
router.route("/myprofile").get(verifyJWT, getUserDetails);
router.route("/refreshtoken").post(refreshAccessToken);
router.route("/deleteaccount").delete(verifyJWT, deleteUser);
router.get("/getallusers", verifyJWT, getAllUsers);

router.route("/updateavatar").post(verifyJWT, upload.single("avatar"), updateAvatar);
router.route("/deleteavatar").delete(verifyJWT, deleteAvatar);

//After login: MAIN PAGE: has all groups
router.route("/dashboard").get(verifyJWT, getDashboardData)

export default router;