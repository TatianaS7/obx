import axios, { type InternalAxiosRequestConfig } from "axios";
import apiURL from "./api";

const apiClient = axios.create({
  baseURL: apiURL,
});

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("authToken");

  if (token && config.headers) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }

  return config;
});

export default apiClient;
