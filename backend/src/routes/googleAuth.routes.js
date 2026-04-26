import { Router } from "express";
import passport from "passport";
import {googleCallBack} from "../controllers/googleAuth.controller.js";

const router = Router();

router.get("/google", passport.authenticate("google", {scope: ["profile", "email"],}));
router.get(
    "/google/callback", 
    passport.authenticate("google",
        //On failure → redirects to frontend /login
        //On success → calls googleCallBack
        {
        failureRedirect: "http://localhost:5173/login",
        session: false 
    }),googleCallBack);

export default router

//1st time- tour guide
//2nd tour- reciever