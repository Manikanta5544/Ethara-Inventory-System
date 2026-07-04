import { cn } from "../../../lib/utils";

const COLORS = {
  blue:   { bg: "bg-blue-50",   icon: "bg-blue-100 text-blue-600"   },
  green:  { bg: "bg-green-50",  icon: "bg-green-100 text-green-600"  },
  purple: { bg: "bg-purple-50", icon: "bg-purple-100 text-purple-600" },
  orange: { bg: "bg-orange-50", icon: "bg-orange-100 text-orange-600" },
  red:    { bg: "bg-red-50",    icon: "bg-red-100 text-red-600"    },
  teal:   { bg: "bg-teal-50",   icon: "bg-teal-100 text-teal-600"   },
};

export function StatCard({ title, value, icon: Icon, color = "blue", subtitle }) {
  const c = COLORS[color] ?? COLORS.blue;
  return (
    <div className={cn("card p-5", c.bg)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value ?? "—"}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0", c.icon)}>
          <Icon className="w-5 h-5" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
