import { ArrowLeft, Package, User, XCircle } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ConfirmDialog } from "../shared/components/ui/ConfirmDialog";
import { TableSkeleton } from "../shared/components/ui/Skeleton";
import { OrderStatusBadge } from "../features/orders/components/OrderStatusBadge";
import { useCancelOrder, useOrder } from "../features/orders/hooks/useOrders";
import { formatCurrency, formatDate } from "../lib/utils";

export function OrderDetailPage() {
  const { id } = useParams();
  const [showCancel, setShowCancel] = useState(false);
  const { data: order, isLoading } = useOrder(id);
  const cancelMut = useCancelOrder({ onSuccess: () => setShowCancel(false) });

  if (isLoading) return <div className="p-6"><TableSkeleton /></div>;
  if (!order) return (
    <div className="p-6">
      <p className="text-gray-500">Order not found.</p>
      <Link to="/orders" className="text-primary-600 hover:underline text-sm mt-2 inline-block">← Back to orders</Link>
    </div>
  );

  return (
    <div className="p-6 max-w-3xl">
      <Link to="/orders" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-6">
        <ArrowLeft className="w-4 h-4" /> Back to Orders
      </Link>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Order #{String(order.id).padStart(4, "0")}</h1>
          <p className="text-sm text-gray-500 mt-0.5">Placed on {formatDate(order.created_at)}</p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          {order.status !== "CANCELLED" && (
            <button className="btn-secondary text-xs" onClick={() => setShowCancel(true)}>
              <XCircle className="w-3.5 h-3.5" /> Cancel Order
            </button>
          )}
        </div>
      </div>
          
      {/* Customer Information */}
      <div className="card p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Customer</h2>
        </div>
        <p className="text-sm font-medium text-gray-900">{order.customer?.name}</p>
        <p className="text-sm text-gray-500">{order.customer?.email}</p>
        <p className="text-sm text-gray-500">{order.customer?.phone}</p>
      </div>

      <div className="card mb-4">
        <div className="flex items-center gap-2 p-4 border-b border-gray-100">
          <Package className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-semibold text-gray-700">Order Items</h2>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Product", "SKU", "Qty", "Unit Price", "Subtotal"].map((h) => (
                <th key={h} className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-2">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {order.items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-3 font-medium text-gray-900">{item.product?.name ?? `Product #${item.product_id}`}</td>
                <td className="px-4 py-3"><code className="text-xs bg-gray-100 px-2 py-0.5 rounded">{item.product?.sku ?? "—"}</code></td>
                <td className="px-4 py-3 text-gray-700">{item.quantity}</td>
                <td className="px-4 py-3 text-gray-700">{formatCurrency(item.price_at_purchase)}</td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(item.price_at_purchase * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-end items-center gap-3 px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
          <span className="text-sm font-medium text-gray-600">Order Total</span>
          <span className="text-lg font-bold text-gray-900">{formatCurrency(order.total_amount)}</span>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showCancel}
        title="Cancel Order"
        message="This will cancel the order and restore all product inventory."
        confirmLabel="Cancel Order"
        variant="warning"
        isLoading={cancelMut.isPending}
        onConfirm={() => cancelMut.mutate(order.id)}
        onCancel={() => setShowCancel(false)}
      />
    </div>
  );
}
