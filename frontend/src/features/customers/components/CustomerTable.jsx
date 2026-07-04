import { Plus, Trash2, Users } from "lucide-react";
import { useState } from "react";
import { TableSkeleton } from "../../../shared/components/ui/Skeleton";
import { EmptyState } from "../../../shared/components/ui/EmptyState";
import { ConfirmDialog } from "../../../shared/components/ui/ConfirmDialog";
import { Modal } from "../../../shared/components/ui/Modal";
import { Pagination } from "../../../shared/components/ui/Pagination";
import { useCustomers, useDeleteCustomer } from "../hooks/useCustomers";
import { CustomerForm } from "./CustomerForm";

export function CustomerTable() {
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const { data, isLoading } = useCustomers({ page, limit: 20 });
  const deleteMut = useDeleteCustomer({ onSuccess: () => setDeleteId(null) });
  const customers = data?.data ?? [];

  return (
    <div className="card">
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <p className="text-sm text-gray-500">{data?.total ?? 0} customer{data?.total !== 1 ? "s" : ""}</p>
        <button className="btn-primary" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" /> Add Customer</button>
      </div>
      {isLoading ? <TableSkeleton cols={4} /> : customers.length === 0 ? (
        <EmptyState icon={Users} title="No customers yet" description="Add your first customer to start creating orders."
          action={<button className="btn-primary" onClick={() => setShowAdd(true)}><Plus className="w-4 h-4" />Add Customer</button>} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-gray-100">{["Name","Email","Phone","Joined","Actions"].map((h)=>(<th key={h} scope="col" className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-4 py-3">{h}</th>))}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                    <td className="px-4 py-3 text-gray-600">{c.email}</td>
                    <td className="px-4 py-3 text-gray-600">{c.phone}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(c.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors" onClick={() => setDeleteId(c.id)} aria-label={`Delete ${c.name}`}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} pages={data?.pages ?? 1} total={data?.total ?? 0} limit={20} onPageChange={setPage} />
        </>
      )}
      <Modal isOpen={showAdd} title="Add Customer" onClose={() => setShowAdd(false)}>
        <CustomerForm onClose={() => setShowAdd(false)} />
      </Modal>
      <ConfirmDialog isOpen={!!deleteId} title="Delete Customer" message="Remove this customer permanently? Customers with existing orders cannot be deleted." confirmLabel="Delete" variant="danger" isLoading={deleteMut.isPending} onConfirm={() => deleteMut.mutate(deleteId)} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
