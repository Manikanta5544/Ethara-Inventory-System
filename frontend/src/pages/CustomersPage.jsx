import { CustomerTable } from "../features/customers/components/CustomerTable";
import { PageHeader } from "../shared/components/layout/PageHeader";
export function CustomersPage() {
  return <div className="p-6 max-w-7xl"><PageHeader title="Customers" description="Manage customer records." /><CustomerTable /></div>;
}