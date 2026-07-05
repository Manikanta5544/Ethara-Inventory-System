import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { formatCurrency } from "../../../lib/utils";
import { useCustomers } from "../../customers/hooks/useCustomers";
import { useProducts } from "../../products/hooks/useProducts";
import { orderSchema } from "../schemas/orderSchema";
import { useCreateOrder } from "../hooks/useOrders";

export function OrderForm({ onClose }) {
  const { data: custData } = useCustomers({ limit: 100 });
  const { data: prodData } = useProducts({ limit: 100 });
  const customers = custData?.data ?? [];
  const products  = prodData?.data ?? [];
  const createOrder = useCreateOrder({ onSuccess: onClose });

  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: { customer_id: "", items: [{ product_id: "", quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const watchedItems =  useWatch({
      control,
      name: "items",
      defaultValue: [{ product_id: "", quantity: 1 }],
  });

  const estimatedTotal = (watchedItems ?? []).reduce((sum, item) =>  {
    const p = products.find((p) => p.id === Number(item.product_id));
    return sum + (p ? p.price * (Number(item.quantity) || 0) : 0);
  }, 0);

  return (
    <form onSubmit={handleSubmit((d) => createOrder.mutate(d))} className="space-y-5" noValidate>
      <div>
        <label htmlFor="cust" className="label">Customer</label>
        <select id="cust" {...register("customer_id")} className="input">
          <option value="">Select a customer…</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name} — {c.email}</option>)}
        </select>
        {errors.customer_id && <p className="error-text" role="alert">{errors.customer_id.message}</p>}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">Order Items</label>
          <button type="button" className="btn-secondary text-xs py-1" onClick={() => append({ product_id: "", quantity: 1 })}>
            <Plus className="w-3 h-3" /> Add Item
          </button>
        </div>
        <div className="space-y-2">
          {fields.map((field, idx) => {
            const sel = products.find((p) => p.id === Number(watchedItems[idx]?.product_id));
            return (
              <div key={field.id} className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <select {...register(`items.${idx}.product_id`)} className="input">
                    <option value="">Select product…</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id} disabled={p.stock_quantity === 0}>
                        {p.name} ({p.sku}) — {formatCurrency(p.price)} · {p.stock_quantity} in stock
                      </option>
                    ))}
                  </select>
                  {errors.items?.[idx]?.product_id && <p className="error-text" role="alert">{errors.items[idx].product_id.message}</p>}
                </div>
                <div className="w-24">
                  <input {...register(`items.${idx}.quantity`)} type="number" min="1" max={sel?.stock_quantity} className="input text-center" placeholder="Qty" aria-label="Quantity" />
                  {errors.items?.[idx]?.quantity && <p className="error-text" role="alert">{errors.items[idx].quantity.message}</p>}
                </div>
                {fields.length > 1 && (
                  <button type="button" className="p-2 mt-0.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" onClick={() => remove(idx)} aria-label="Remove item">
                    <Minus className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {errors.items?.root && <p className="error-text" role="alert">{errors.items.root.message}</p>}
      </div>

      {estimatedTotal > 0 && (
        <div className="bg-primary-50 rounded-lg p-3 flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">Estimated Total</span>
          <span className="text-lg font-bold text-primary-700">{formatCurrency(estimatedTotal)}</span>
        </div>
      )}

      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={createOrder.isPending} aria-busy={createOrder.isPending}>
          {createOrder.isPending ? "Placing Order…" : "Place Order"}
        </button>
      </div>
    </form>
  );
}
