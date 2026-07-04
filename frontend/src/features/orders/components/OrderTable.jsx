import { Eye, Plus, ShoppingCart, Trash2, XCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../../lib/utils";
import { TableSkeleton } from "../../../shared/components/ui/Skeleton";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { Modal } from "../../../shared/components/ui/Modal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useCancelOrder, useDeleteOrder, useOrders } from "../hooks/useOrders";
import { OrderForm } from "./OrderForm";
import { OrderStatusBadge } from "./OrderStatusBadge";

export function OrderTable() {
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [cancelId, setCancelId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const { data, isLoading } = useOrders({ page, limit: 20 });
  const cancelMut = useCancelOrder({ onSuccess: () => setCancelId(null) });
  const deleteMut = useDeleteOrder({ onSuccess: () => setDeleteId(null) });
  const orders = data?.data ?? [];

  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">{data?.total ?? 0} order{data?.total !== 1 ? "s" : ""}</p>
        <button className="btn-primary" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" /> New Order</button>
      </div>

      {isLoading ? <TableSkeleton cols={6} /> : orders.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No orders yet" description="Create your first order once you have products and customers."
          action={<button className="btn-primary" onClick={() => setShowCreate(true)}><Plus className="w-4 h-4" />New Order</button>} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">{["Order","Customer","Items","Total","Status","Date","Actions"].map((h)=>(<th key={h} scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-600">#{String(o.id).padStart(4,"0")}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{o.customer?.name ?? `#${o.customer_id}`}</td>
                    <td className="px-4 py-3 text-gray-600">{o.items?.length ?? 0} item{o.items?.length !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-3 font-semibold">{formatCurrency(o.total_amount)}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link to={`/orders/${o.id}`} className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" aria-label="View order details"><Eye className="w-3.5 h-3.5" /></Link>
                        {o.status !== "CANCELLED" && <button className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors" onClick={() => setCancelId(o.id)} aria-label="Cancel order"><XCircle className="w-3.5 h-3.5" /></button>}
                        <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" onClick={() => setDeleteId(o.id)} aria-label="Delete order"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pages={data?.pages ?? 1} total={data?.total ?? 0} limit={20} onPageChange={setPage} />
        </>
      )}

      <Modal isOpen={showCreate} title="New Order" onClose={() => setShowCreate(false)} maxWidth="max-w-2xl">
        <OrderForm onClose={() => setShowCreate(false)} />
      </Modal>
      <ConfirmDialog isOpen={!!cancelId} title="Cancel Order" message="This cancels the order and restores all product inventory." confirmLabel="Cancel Order" variant="warning" isLoading={cancelMut.isPending} onConfirm={() => cancelMut.mutate(cancelId)} onCancel={() => setCancelId(null)} />
      <ConfirmDialog isOpen={!!deleteId} title="Delete Order" message="Permanently delete this order. Inventory is restored if not already cancelled." confirmLabel="Delete" variant="danger" isLoading={deleteMut.isPending} onConfirm={() => deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
