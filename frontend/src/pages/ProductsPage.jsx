import { ProductTable } from "../features/products/components/ProductTable";
import { PageHeader } from "../shared/components/layout/PageHeader";
export function ProductsPage() {
  return <div className="p-6 max-w-7xl"><PageHeader title="Products" description="Manage your product catalogue and inventory levels." /><ProductTable /></div>;
}
