import { BarChart3, LayoutDashboard, Package, ShoppingCart, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../../lib/utils";

const NAV = [
  { to: "/",          label: "Dashboard", icon: LayoutDashboard },
  { to: "/products",  label: "Products",  icon: Package },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/orders",    label: "Orders",    icon: ShoppingCart },
];

function Sidebar() {
  return (
    <aside className="w-60 h-screen sticky top-0 bg-gray-900 flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-gray-700/60">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-none">Inventory</p>
            <p className="text-gray-400 text-xs mt-0.5">Management System</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto" aria-label="Main navigation">
        {NAV.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary-400",
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              )
            }
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-gray-700/60">
        <p className="text-gray-500 text-xs">v1.0.0 · Production Ready</p>
      </div>
    </aside>
  );
}

export function AppLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-y-auto">{children}</main>
    </div>
  );
}
