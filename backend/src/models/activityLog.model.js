import mongoose, { Schema } from "mongoose";

const activityLogSchema = new Schema({
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
        required: true
    },
    action: {
        type: String,
        enum: ["EXPENSE_CREATED", "EXPENSE_DELETED", "SETTLEMENT_CREATED", "MEMBER_ADDED", "MEMBER_REMOVED", "GROUP_CREATED", "MEMBER_INVITED", "INVITE_REJECTED"],
        required: true
    },
    description: {
        type: String,
        required: true
    },
    relatedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }]
}, { timestamps: true });

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
