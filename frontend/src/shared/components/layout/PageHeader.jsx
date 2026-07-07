export function PageHeader({ title, description, actions }) {
  return (
    <div className="flex items-start justify-between mb-8 pb-6 border-b border-border">
      <div>
        <h1 className="text-2xl font-bold text-ink tracking-tight">{title}</h1>
        {description && <p className="text-sm text-ink-secondary mt-1.5 leading-relaxed">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2 ml-4 shrink-0">{actions}</div>}
    </div>
  );
}
