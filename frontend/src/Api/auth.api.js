import api from "./axios.js";

export const loginApi = (data) => {
  return api.post("/user/login", data);
};

export const signupApi = (data) => {
  return api.post("/user/signup", data);
};

export const logoutApi = () => {
  return api.post("/user/logout");
};

export const getMeApi = () => {
  return api.get("/user/myprofile");
};

export const changePassApi=(password)=>{
  return api.post("/user/changepassword", password)
}

export const changeFullName=(name)=>{
  return api.post("/user/updatefullname",name );
}

export const getAllUsers=()=>{
  return api.get("/user/getallusers");
}

