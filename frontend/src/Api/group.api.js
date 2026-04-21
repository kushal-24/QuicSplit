import api from "./axios.js";

export const getGroup= async(groupId)=>{
    return api.get(`/group/${groupId}/viewgroup`);
}

export const getAllGroups=async()=>{
    return api.get(`/group/getallgroups`);
}

export const uploadBill= async(groupId,formData)=>{
    return api.post(`/group/${groupId}/uploadbill`, formData);
}

export const chatWithAi= async (groupId, messages)=>{    
    return api.post(`/group/${groupId}/sendchat`, {messages});
}
