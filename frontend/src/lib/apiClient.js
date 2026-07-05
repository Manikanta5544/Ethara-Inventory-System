import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const data = error.response?.data;

    error.userMessage =
      data?.message ??
      data?.err_message ??
      data?.detail ??
      data?.details?.message ??
      error.message ??
      "An unexpected error occurred.";

    return Promise.reject(error);
  }
);

export default apiClient;
