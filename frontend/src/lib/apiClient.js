import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    err.userMessage =
      err.response?.data?.message ||
      err.response?.data?.detail ||
      err.message ||
      "An unexpected error occurred.";
    return Promise.reject(err);
  }
);

export default apiClient;
