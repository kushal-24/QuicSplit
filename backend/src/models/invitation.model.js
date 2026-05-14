import mongoose, { Schema } from "mongoose";

const invitationSchema = new Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    inviter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    invitee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["PENDING", "ACCEPTED", "REJECTED"],
        default: "PENDING"
    }
}, { timestamps: true });

export const Invitation = mongoose.model("Invitation", invitationSchema);
