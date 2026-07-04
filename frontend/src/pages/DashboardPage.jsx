import { AlertTriangle, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../features/dashboard/components/StatCard";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import { useProducts } from "../features/products/hooks/useProducts";
import { formatCurrency } from "../lib/utils";
import { CardSkeleton } from "../shared/components/ui/Skeleton";
import { PageHeader } from "../shared/components/layout/PageHeader";

export function DashboardPage() {
  const { data: summary, isLoading } = useDashboard();
  const { data: prodData } = useProducts({ low_stock: true, limit: 10 });
  const lowStockItems = prodData?.data ?? [];

  return (
    <div className="p-6 max-w-7xl">
      <PageHeader title="Dashboard" description="Real-time overview of your inventory and operations." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)
          : <>
              <StatCard title="Products"       value={summary?.total_products}    icon={Package}      color="blue"   />
              <StatCard title="Customers"      value={summary?.total_customers}   icon={Users}        color="purple" />
              <StatCard title="Orders"         value={summary?.total_orders}      icon={ShoppingCart} color="green"  />
              <StatCard title="Low Stock"      value={summary?.low_stock_count}   icon={AlertTriangle} color="red"   subtitle={`≤ ${summary?.low_stock_threshold} units`} />
              <StatCard title="Inventory Value" value={summary ? formatCurrency(summary.inventory_value) : "—"} icon={DollarSign} color="orange" subtitle="Stock × price" />
              <StatCard title="Avg Order"      value={summary ? formatCurrency(summary.average_order_value) : "—"} icon={TrendingUp} color="teal" subtitle="Per order" />
            </>
        }
      </div>

      {lowStockItems.length > 0 && (
        <div className="card p-4 mb-6 border-l-4 border-red-400 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-500" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-red-800">Low Stock Alert ({lowStockItems.length} products)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.map((p) => (
              <div key={p.id} className="flex justify-between items-center bg-white rounded-lg px-3 py-2 text-xs shadow-sm">
                <span className="font-medium text-gray-800">{p.name}</span>
                <span className={p.stock_quantity === 0 ? "badge-red" : "badge-yellow"}>{p.stock_quantity} left</span>
              </div>
            ))}
          </div>
          <Link to="/products?low_stock=true" className="inline-flex items-center gap-1 text-xs text-red-700 mt-3 font-medium hover:underline">
            Manage inventory <TrendingUp className="w-3 h-3" />
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { to: "/products",  label: "Manage Products",  Icon: Package,      bg: "bg-blue-100",   text: "text-blue-600"   },
          { to: "/customers", label: "Manage Customers", Icon: Users,        bg: "bg-purple-100", text: "text-purple-600" },
          { to: "/orders",    label: "View Orders",      Icon: ShoppingCart, bg: "bg-green-100",  text: "text-green-600"  },
        ].map(({ to, label, Icon, bg, text }) => (
          <Link key={to} to={to} className="card p-5 flex items-center gap-3 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg} ${text} group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5" aria-hidden="true" />
            </div>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
