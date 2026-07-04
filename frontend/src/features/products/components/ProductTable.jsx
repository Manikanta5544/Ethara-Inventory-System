import { Edit2, Package, Plus, Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "../../../lib/utils";
import { TableSkeleton } from "../../../shared/components/ui/Skeleton";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { Modal } from "../../../shared/components/ui/Modal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useProducts, useDeleteProduct } from "../hooks/useProducts";
import { ProductForm } from "./ProductForm";

const LOW_STOCK_THRESHOLD = 10;

export function ProductTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [lowStock, setLowStock] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useProducts({ page, limit: 20, q: search || undefined, low_stock: lowStock || undefined });
  const deleteMut = useDeleteProduct({ onSuccess: () => setDeleteId(null) });

  const products = data?.data ?? [];
  const total    = data?.total ?? 0;
  const pages    = data?.pages ?? 1;

  return (
    <div className="card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between p-4 border-b border-gray-100 gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
            <input
              className="input pl-9"
              placeholder="Search name or SKU…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              aria-label="Search products"
            />
          </div>
          <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer select-none whitespace-nowrap">
            <input
              type="checkbox"
              checked={lowStock}
              onChange={(e) => { setLowStock(e.target.checked); setPage(1); }}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            Low stock only
          </label>
        </div>
        <button className="btn-primary" onClick={() => setShowAdd(true)}>
          <Plus className="w-4 h-4" aria-hidden="true" /> Add Product
        </button>
      </div>

      {isLoading ? (
        <TableSkeleton />
      ) : products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products found"
          description={search || lowStock ? "Try adjusting your filters." : "Add your first product to get started."}
          action={!search && !lowStock && (
            <button className="btn-primary" onClick={() => setShowAdd(true)}>
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Name", "SKU", "Price", "Stock", "Updated", "Actions"].map((h) => (
                    <th key={h} scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{p.sku}</code></td>
                    <td className="px-4 py-3 text-gray-700">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-3">
                      <span className={p.stock_quantity <= LOW_STOCK_THRESHOLD ? "badge-red" : "badge-green"}>
                        {p.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(p.updated_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400" onClick={() => setEditProduct(p)} aria-label={`Edit ${p.name}`}>
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-400" onClick={() => setDeleteId(p.id)} aria-label={`Delete ${p.name}`}>
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pages={pages} total={total} limit={20} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={showAdd} title="Add Product" onClose={() => setShowAdd(false)}>
        <ProductForm onClose={() => setShowAdd(false)} />
      </Modal>
      <Modal isOpen={!!editProduct} title="Edit Product" onClose={() => setEditProduct(null)}>
        <ProductForm product={editProduct} onClose={() => setEditProduct(null)} />
      </Modal>
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Product"
        message="This permanently deletes the product. This action cannot be undone."
        confirmLabel="Delete"
        variant="danger"
        isLoading={deleteMut.isPending}
        onConfirm={() => deleteMut.mutate(deleteId)}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
