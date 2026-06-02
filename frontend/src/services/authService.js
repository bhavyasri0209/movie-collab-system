import API from "./api";

export const loginUser = async (data) => {
  return await API.post("/login", data);
};

export const registerUser = async (data) => {
  return await API.post("/register", data);
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};