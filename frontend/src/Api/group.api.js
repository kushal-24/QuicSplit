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

export const createSettlement= async(groupId, settlement)=>{
    return api.post(`/group/${groupId}/createsettlement`, settlement);
}

export const createGroupApi = (formData) => {
  return api.post("/group/creategroup", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const updateGroupApi = (groupId, formData) => {
  return api.patch(`/group/${groupId}/updategroup`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const addMemberApi = (groupId, memberId) => {
  return api.post(`/group/${groupId}/addmember`, { a: memberId });
};

export const removeMemberApi = (groupId, memberId) => {
  return api.post(`/group/${groupId}/removemember`, { a: memberId });
};

export const deleteGroupApi = (groupId) => {
  return api.delete(`/group/${groupId}/deletegroup`);
};

export const fetchActivityLogs = async () => {
    return api.get('/activity');
}

export const clearActivityLogs = async () => {
    return api.post('/activity/clear');
}

export const getPendingInvitationsApi = async () => {
    return api.get('/group/invitations/pending');
}

export const acceptInvitationApi = async (invitationId) => {
    return api.post(`/group/invitations/${invitationId}/accept`);
}

export const rejectInvitationApi = async (invitationId) => {
    return api.post(`/group/invitations/${invitationId}/reject`);
}
