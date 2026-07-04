import apiClient from "../../../lib/apiClient";
export const ordersApi = {
  list:   (p)  => apiClient.get("/orders", { params: p }).then((r) => r.data),
  get:    (id) => apiClient.get(`/orders/${id}`).then((r) => r.data.data),
  create: (d)  => apiClient.post("/orders", d).then((r) => r.data.data),
  cancel: (id) => apiClient.post(`/orders/${id}/cancel`).then((r) => r.data.data),
  delete: (id) => apiClient.delete(`/orders/${id}`),
};
