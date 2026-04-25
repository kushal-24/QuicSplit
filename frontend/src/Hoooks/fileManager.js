import api from "../Api/axios";
import { uploadBill } from "../Api/group.api";

export const useGroupFileUpload=()=>{
  
  const upload=async(groupId, file, message)=>{
    const fd=  new FormData();
    fd.append("file", file);
    if (message) {
      fd.append("prompt", message); // Using "prompt" as it's a common name for AI instructions
    }

    const res= await uploadBill(groupId, fd);

    return res.data;
  }

  const remove= async(fileId)=>{
    const res= api.delete(`/group/file/${fileId}/deletefile`)

    return res.data;
  }

  return { upload, remove };
}