import { cn } from "../../../lib/utils";

const ACCENT = {
  gold: "text-primary-500 bg-primary-500/10",
  red:  "text-danger bg-danger/10",
};

export function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const iconClass = ACCENT[color] ?? "text-ink-muted bg-elevated";
  return (
    <div className="p-5 flex flex-col gap-3 min-w-0">
      <div className="flex items-center gap-2">
        <div className={cn("w-6 h-6 rounded-md flex items-center justify-center shrink-0", iconClass)}>
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wider truncate">{title}</span>
      </div>
      <p className="text-[26px] leading-none font-bold text-ink tracking-tight tabular-nums">{value ?? "—"}</p>
      {subtitle && <p className="text-xs text-ink-muted truncate">{subtitle}</p>}
    </div>
  );
}
