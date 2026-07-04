import apiClient from "../../../lib/apiClient";
export const dashboardApi = {
  getSummary: () => apiClient.get("/dashboard").then((r) => r.data.data),
};
