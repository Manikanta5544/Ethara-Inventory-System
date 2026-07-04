import apiClient from "../../../lib/apiClient";

export const productsApi = {
  list:   (params) => apiClient.get("/products", { params }).then((r) => r.data),
  get:    (id)     => apiClient.get(`/products/${id}`).then((r) => r.data.data),
  create: (data)   => apiClient.post("/products", data).then((r) => r.data.data),
  update: (id, d)  => apiClient.put(`/products/${id}`, d).then((r) => r.data.data),
  delete: (id)     => apiClient.delete(`/products/${id}`),
};
