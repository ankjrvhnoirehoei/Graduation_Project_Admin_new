import axios from "axios";

const api = axios.create({
  baseURL: "http://cirla.io.vn/",
});

api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem("accessToken");
    const refreshToken = sessionStorage.getItem("refreshToken");

    const headers = config.headers as Record<string, any>;

    if (headers && headers.token) {
      headers.Authorization = `Bearer ${refreshToken}`;
      delete headers.token;
    } else if (accessToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
