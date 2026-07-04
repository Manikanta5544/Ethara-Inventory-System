import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { productSchema } from "../schemas/productSchema";
import { useCreateProduct, useUpdateProduct } from "../hooks/useProducts";

export function ProductForm({ product, onClose }) {
  const isEdit = !!product;
  const create = useCreateProduct({ onSuccess: onClose });
  const update = useUpdateProduct({ onSuccess: onClose });
  const isPending = create.isPending || update.isPending;

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: product
      ? { name: product.name, sku: product.sku, price: product.price, stock_quantity: product.stock_quantity }
      : { name: "", sku: "", price: "", stock_quantity: "" },
  });

  const onSubmit = (data) =>
    isEdit ? update.mutate({ id: product.id, data }) : create.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div>
        <label htmlFor="name" className="label">Product Name</label>
        <input id="name" {...register("name")} className="input" placeholder="Wireless Mouse" aria-invalid={!!errors.name} />
        {errors.name && <p className="error-text" role="alert">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="sku" className="label">SKU</label>
        <input id="sku" {...register("sku")} className="input" placeholder="WM-001" aria-invalid={!!errors.sku} />
        {errors.sku && <p className="error-text" role="alert">{errors.sku.message}</p>}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="price" className="label">Price (₹)</label>
          <input id="price" {...register("price")} type="number" step="0.01" className="input" placeholder="19.99" />
          {errors.price && <p className="error-text" role="alert">{errors.price.message}</p>}
        </div>
        <div>
          <label htmlFor="stock" className="label">Stock Qty</label>
          <input id="stock" {...register("stock_quantity")} type="number" className="input" placeholder="100" />
          {errors.stock_quantity && <p className="error-text" role="alert">{errors.stock_quantity.message}</p>}
        </div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
        <button type="submit" className="btn-primary" disabled={isPending} aria-busy={isPending}>
          {isPending ? "Saving…" : isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>
    </form>
  );
}
