import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { productsApi } from "../api/productsApi";

export const PRODUCTS_KEY = ["products"];

export const useProducts = (params) =>
  useQuery({ queryKey: [...PRODUCTS_KEY, params], queryFn: () => productsApi.list(params) });

export const useProduct = (id) =>
  useQuery({ queryKey: [...PRODUCTS_KEY, id], queryFn: () => productsApi.get(id), enabled: !!id });

export const useCreateProduct = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: PRODUCTS_KEY }); qc.invalidateQueries({ queryKey: ["dashboard"] }); toast.success("Product created."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage),
  });
};

export const useUpdateProduct = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => productsApi.update(id, data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: PRODUCTS_KEY }); toast.success("Product updated."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage),
  });
};

export const useDeleteProduct = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: productsApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: PRODUCTS_KEY }); qc.invalidateQueries({ queryKey: ["dashboard"] }); toast.success("Product deleted."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage),
  });
};
