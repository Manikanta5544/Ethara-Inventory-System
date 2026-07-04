import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ordersApi } from "../api/ordersApi";

export const ORDERS_KEY = ["orders"];

export const useOrders = (params) =>
  useQuery({ queryKey: [...ORDERS_KEY, params], queryFn: () => ordersApi.list(params) });

export const useOrder = (id) =>
  useQuery({ queryKey: [...ORDERS_KEY, id], queryFn: () => ordersApi.get(id), enabled: !!id });

const invalidate = (qc) => {
  qc.invalidateQueries({ queryKey: ORDERS_KEY });
  qc.invalidateQueries({ queryKey: ["products"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
};

export const useCreateOrder = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ordersApi.create,
    onSuccess: () => { invalidate(qc); toast.success("Order placed."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage) });
};

export const useCancelOrder = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ordersApi.cancel,
    onSuccess: () => { invalidate(qc); toast.success("Order cancelled. Inventory restored."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage) });
};

export const useDeleteOrder = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({ mutationFn: ordersApi.delete,
    onSuccess: () => { invalidate(qc); toast.success("Order deleted."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage) });
};
