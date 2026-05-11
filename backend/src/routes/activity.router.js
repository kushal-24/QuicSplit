import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserActivities, clearUserActivities } from "../controllers/activity.controller.js";

const router = Router();

router.use(verifyJWT); // Ensure all routes require authentication

router.route("/").get(getUserActivities);
router.route("/clear").post(clearUserActivities);

export default router;
