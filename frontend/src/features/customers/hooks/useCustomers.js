import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { customersApi } from "../api/customersApi";

export const CUSTOMERS_KEY = ["customers"];

export const useCustomers = (params) =>
  useQuery({ queryKey: [...CUSTOMERS_KEY, params], queryFn: () => customersApi.list(params) });

export const useCreateCustomer = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => { qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }); qc.invalidateQueries({ queryKey: ["dashboard"] }); toast.success("Customer created."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage),
  });
};

export const useDeleteCustomer = (opts = {}) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => { qc.invalidateQueries({ queryKey: CUSTOMERS_KEY }); qc.invalidateQueries({ queryKey: ["dashboard"] }); toast.success("Customer deleted."); opts.onSuccess?.(); },
    onError: (e) => toast.error(e.userMessage),
  });
};