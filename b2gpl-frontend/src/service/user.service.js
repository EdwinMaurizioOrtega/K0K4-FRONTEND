import axios from "axios";
import authHeader from "./auth-header";

const API_URL = "http://192.168.1.16:8080/api/test/";

const getPublicContent = async () => {
    return await axios.get("http://192.168.1.16:8080/api/post/published");
};

const getUserBoard = () => {
  return axios.get(API_URL + "user", { headers: authHeader() });
};

const getModeratorBoard = () => {
  return axios.get(API_URL + "mod", { headers: authHeader() });
};

const getAdminBoard = () => {
  return axios.get(API_URL + "admin", { headers: authHeader() });
};

const UserService = {
  getPublicContent,
  getUserBoard,
  getModeratorBoard,
  getAdminBoard,
};

export default UserService;
