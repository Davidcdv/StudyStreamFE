import axios from "axios";

// Get the API URL from the environment variables
const apiUrl = import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: apiUrl, // Use the API URL from the environment variable
  withCredentials: true, // Include credentials for secure cookies, if needed
});
