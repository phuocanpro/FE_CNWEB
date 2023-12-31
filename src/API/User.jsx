import axios from "axios";
import axiosClient from "./axiosClient";

const User = {
  Get_All_User: () => {
    const url = "/api/User";
    return axiosClient.get(url);
  },

  Get_User: (id) => {
    const url = `/api/User/${id}`;
    return axiosClient.get(url);
  },

  Put_User: (data) => {
    const url = `/api/User`;
    return axiosClient.put(url, data);
  },

  Login: async (data) => {
    const url = "/api/login";
    // console.log('called')
    return axiosClient.post(url, data)
  },

  Get_Detail_User: (query) => {
    const url = `/api/login${query}`;
    return axiosClient.get(url);
  },

  Register: (data) => {
    const url = "/api/register";
    return axiosClient.post(url, data);
  },
};

export default User;
