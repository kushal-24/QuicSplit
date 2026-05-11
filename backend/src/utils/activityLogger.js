import { ActivityLog } from "../models/activityLog.model.js";

/**
 * Utility to log an activity event
 * @param {Object} params
 * @param {string} params.groupId - The ID of the group where the activity occurred
 * @param {string} params.action - The action type (e.g. EXPENSE_CREATED)
 * @param {string} params.description - A human-readable description of the activity
 * @param {Array<string>} params.relatedUsers - Array of user IDs who should see this activity
 */
export const logActivity = async ({ groupId, action, description, relatedUsers }) => {
    try {
        if (!relatedUsers || relatedUsers.length === 0) return;
        
        await ActivityLog.create({
            group: groupId,
            action,
            description,
            relatedUsers
        });
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
