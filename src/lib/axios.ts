import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL
export const axiosInstance = axios.create({
    baseURL: apiUrl || "http://localhost:5000/api",
})