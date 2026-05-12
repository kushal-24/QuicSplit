import mongoose from 'mongoose'
import { DB_NAME } from '../constants.js'
import dotenv from "dotenv";
dotenv.config(); // loads all variables from dotenv in process.env


const connectDB=async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Database is successfully connected`)
    } catch (err) {
        console.log(`connection has failed`);
        console.log("URI:", process.env.MONGODB_URI);
        console.log("connection error:", err);
        process.exit();
    }

}

export default connectDB