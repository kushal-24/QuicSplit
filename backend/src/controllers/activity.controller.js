import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import { ActivityLog } from "../models/activityLog.model.js";
import { User } from "../models/user.model.js";

const getUserActivities = asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Find logs where user is in relatedUsers and created after lastClearedLogsAt
    const query = {
        relatedUsers: user._id
    };
    
    if (user.lastClearedLogsAt) {
        query.createdAt = { $gt: user.lastClearedLogsAt };
    }

    const logs = await ActivityLog.find(query)
        .populate("group", "grpName thumbnail")
        .sort({ createdAt: -1 })
        .limit(50); // Fetch latest 50 logs

    const formattedLogs = logs.map(log => {
        const obj = log.toObject();
        if (obj.description) {
            // Replace any decimal amounts like ₹277.09999999999997 with rounded values like ₹277
            obj.description = obj.description.replace(/₹(\d+\.\d+)/g, (match, p1) => '₹' + Math.round(parseFloat(p1)));
        }
        return obj;
    });

    return res.status(200).json(
        new apiResponse(formattedLogs, 200, "Activity logs fetched successfully")
    );
});

const clearUserActivities = asyncHandler(async (req, res) => {
    const user = req.user;
    
    // Update the lastClearedLogsAt timestamp to current time
    user.lastClearedLogsAt = new Date();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(
        new apiResponse(null, 200, "Activity logs cleared successfully")
    );
});

export {
    getUserActivities,
    clearUserActivities
};
