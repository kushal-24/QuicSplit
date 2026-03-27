import mongoose, { Schema } from "mongoose"

const groupSchema= new Schema({
    grpName:{
        type: String,
        required: true,

    },
    ownerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    members:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {timestamps: true})

export default Group= mongoose.model('Group', groupSchema);