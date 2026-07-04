import apiClient from "../../../lib/apiClient";
export const customersApi = {
  list:   (p) => apiClient.get("/customers", { params: p }).then((r) => r.data),
  get:    (id) => apiClient.get(`/customers/${id}`).then((r) => r.data.data),
  create: (d)  => apiClient.post("/customers", d).then((r) => r.data.data),
  delete: (id) => apiClient.delete(`/customers/${id}`),
};