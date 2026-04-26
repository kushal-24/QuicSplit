import asyncHandler from "../utils/asyncHandler.js"
import {User} from "../models/user.model.js"
import { generateAccessAndRefreshToken } from "./user.controller.js"

export const googleCallBack=asyncHandler(async(req,res,next)=>{
    const user = req.user;

    const{accessToken, refreshToken}= await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options= {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
    }

    return res
    .status(302)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("http://localhost:5173/dashboard");
})