import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import passport from "passport"
import "./config/passport.js"
import googleAuthRouter from "./routes/googleAuth.routes.js"



const app=express();

app.use(cors({
    origin: process.env.CORS_ORIGIN, //👉 “Allow this frontend to access my backend and allow cookies.”
    credentials: true,
}))

app.use("/api/v1/auth", googleAuthRouter)
app.use(passport.initialize());
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit:"16kb"}));
app.use(express.static("public"))
app.use(cookieParser());

import userRouter from "./routes/user.router.js"
import groupRouter from "./routes/group.router.js"
import chatRouter from "./routes/chat.router.js"


app.use('/api/v1/user', userRouter);
app.use('/api/v1/group', groupRouter);
app.use('/api/v1/group', chatRouter);

export {app}