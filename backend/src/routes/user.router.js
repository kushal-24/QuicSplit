import { Router } from "express";
import { changeUserPass, createUser, deleteUser, getAllUsers, getUserDetails, refreshAccessToken, updateFullName, userLogin, userLogout } from "../controllers/user.controller";
import { verifyJWT } from "../middlewares/auth.middleware";

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

export default router;