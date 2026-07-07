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
    <aside className="w-60 h-screen sticky top-0 bg-surface/80 backdrop-blur-xl border-r border-border flex flex-col shrink-0">
      <div className="px-5 py-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-elevated to-surface border border-border-strong flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4 text-primary-500" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="text-ink text-sm font-semibold leading-none tracking-tight truncate">Inventory</p>
            <p className="text-ink-muted text-xs mt-1">Management System</p>
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
                "flex items-center gap-3 pl-[9px] pr-3 py-2.5 rounded-xl text-sm font-medium border-l-[3px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                isActive
                  ? "bg-elevated border-primary-500 text-ink shadow-sm"
                  : "border-transparent text-ink-secondary hover:bg-elevated/60 hover:text-ink"
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn("w-4 h-4 shrink-0 transition-colors duration-150", isActive ? "text-primary-500" : "text-ink-muted")} aria-hidden="true" />
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-ink-muted text-xs tracking-wide">Version 1.0 · Production</p>
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
