import api from "./axios.js";

export const getGroup= async({groupId})=>{
    return api.get(`/${groupId}/viewgroup`);
}

export const getAllGroups=async()=>{
    return api.get(`/getallgroups`);
}

export const getDashboardData=async()=>{
    return api.get(`/dashboard`);
}

