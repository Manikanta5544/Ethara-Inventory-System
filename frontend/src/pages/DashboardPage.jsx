import { AlertTriangle, DollarSign, Package, ShoppingCart, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { StatCard } from "../features/dashboard/components/StatCard";
import { useDashboard } from "../features/dashboard/hooks/useDashboard";
import { useProducts } from "../features/products/hooks/useProducts";
import { formatCurrency } from "../lib/utils";
import { Skeleton } from "../shared/components/ui/Skeleton";
import { PageHeader } from "../shared/components/layout/PageHeader";

function stockBadge(qty) {
  if (qty === 0) return "badge-red";
  if (qty <= 5) return "badge-yellow";
  return "badge-gray";
}

export function DashboardPage() {
  const { data: summary, isLoading } = useDashboard();
  const { data: prodData } = useProducts({ low_stock: true, limit: 10 });
  const lowStockItems = prodData?.data ?? [];

  const stats = [
    { title: "Products",        value: summary?.total_products,  icon: Package,       subtitle: null },
    { title: "Customers",       value: summary?.total_customers, icon: Users,         subtitle: null },
    { title: "Orders",          value: summary?.total_orders,    icon: ShoppingCart,  subtitle: null },
    { title: "Low Stock",       value: summary?.low_stock_count, icon: AlertTriangle, subtitle: summary ? `≤ ${summary.low_stock_threshold} units` : null, color: "red" },
    { title: "Inventory Value", value: summary ? formatCurrency(summary.inventory_value) : undefined, icon: DollarSign,  subtitle: "Stock × price", color: "gold" },
    { title: "Avg Order",       value: summary ? formatCurrency(summary.average_order_value) : undefined, icon: TrendingUp, subtitle: "Per order" },
  ];

  const quickActions = [
    { to: "/products",  label: "Manage Products",  Icon: Package },
    { to: "/customers", label: "Manage Customers", Icon: Users },
    { to: "/orders",    label: "View Orders",      Icon: ShoppingCart },
  ];

  return (
    <div className="p-8 max-w-7xl">
      <PageHeader title="Dashboard" description="Real-time overview of your inventory and operations." />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-px bg-border rounded-2xl border border-border overflow-hidden mb-10">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-5 space-y-3 bg-surface">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-7 w-14" />
              </div>
            ))
          : stats.map((s) => <StatCard key={s.title} {...s} />)
        }
      </div>

      {lowStockItems.length > 0 && (
        <div className="card p-6 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-danger" aria-hidden="true" />
            <h2 className="text-sm font-semibold text-ink">Low Stock Alert ({lowStockItems.length} products)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {lowStockItems.map((p) => (
              <div key={p.id} className="flex justify-between items-center bg-elevated border border-border rounded-lg px-3 py-2 text-xs">
                <span className="font-medium text-ink">{p.name}</span>
                <span className={stockBadge(p.stock_quantity)}>{p.stock_quantity} left</span>
              </div>
            ))}
          </div>
          <Link to="/products?low_stock=true" className="inline-flex items-center gap-1 text-xs text-primary-500 mt-4 font-medium hover:underline">
            Manage inventory <TrendingUp className="w-3 h-3" />
          </Link>
        </div>
      )}

      <div className="card flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border overflow-hidden">
        {quickActions.map(({ to, label, Icon }) => (
          <Link key={to} to={to} className="flex-1 flex items-center gap-3 px-5 py-4 hover:bg-elevated transition-colors duration-150 group">
            <Icon className="w-4 h-4 text-ink-muted group-hover:text-primary-500 transition-colors duration-150 shrink-0" aria-hidden="true" />
            <span className="text-sm font-medium text-ink-secondary group-hover:text-ink transition-colors duration-150">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
