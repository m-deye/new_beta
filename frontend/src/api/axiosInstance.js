// src/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;

// Pour Django avec session (captcha, envoi message)
export const axiosSession = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
  withCredentials: true, // 🔐 essentiel pour le captcha
});
