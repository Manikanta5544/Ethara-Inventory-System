import { OrderTable } from "../features/orders/components/OrderTable";
import { PageHeader } from "../shared/components/layout/PageHeader";
export function OrdersPage() {
  return <div className="p-6 max-w-7xl"><PageHeader title="Orders" description="Place, track and manage orders." /><OrderTable /></div>;
}
