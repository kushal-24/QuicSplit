import api from "../Api/axios";
import { uploadBill } from "../Api/group.api";

export const useGroupFileUpload=()=>{
  
  const upload=async(groupId, file)=>{
    const fd=  new FormData();
    fd.append("file", file);

    const res= await uploadBill(groupId, fd);

    return res.data;
  }

  const remove= async(fileId)=>{
    const res= api.delete(`/group/file/${fileId}/deletefile`)

    return res.data;
  }

  return { upload, remove };
}