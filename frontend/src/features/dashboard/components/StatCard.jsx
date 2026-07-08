import { cn } from "../../../lib/utils";

const ACCENT = {
  gold: "text-primary-500 bg-primary-500/10",
  red:  "text-danger bg-danger/10",
};

export function StatCard({ title, value, icon: Icon, color, subtitle }) {
  const iconClass = ACCENT[color] ?? "text-ink-secondary bg-elevated";
  return (
    <div className="p-5 flex flex-col gap-3.5 min-w-0">
      <div className="flex items-center gap-2.5">
        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", iconClass)}>
          <Icon className="w-4 h-4" aria-hidden="true" />
        </div>
        <span className="text-xs font-medium text-ink-muted uppercase tracking-wider truncate">{title}</span>
      </div>
      <div>
        <p className="text-xl leading-none font-bold text-ink tracking-tight tabular-nums truncate" title={typeof value === "string" ? value : undefined}>{value ?? "—"}</p>
        <p className="text-xs text-ink-muted truncate mt-1.5 h-4">{subtitle || "\u00A0"}</p>
      </div>
    </div>
  );
}
