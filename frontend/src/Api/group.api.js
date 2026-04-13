import api from "./axios.js";

export const getGroup= async(groupId)=>{
    return api.get(`/group/${groupId}/viewgroup`);
}

export const getAllGroups=async()=>{
    return api.get(`/group/getallgroups`);
}

