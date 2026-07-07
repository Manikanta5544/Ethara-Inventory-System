import { AlertTriangle } from "lucide-react";

export function ConfirmDialog({ isOpen, title, message, confirmLabel = "Confirm", variant = "danger", onConfirm, onCancel, isLoading }) {
  if (!isOpen) return null;
  const isDanger = variant === "danger";
  return (
    <div role="alertdialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-surface border border-border-strong rounded-3xl shadow-sm p-6 w-full max-w-sm mx-4">
        <div className="flex gap-3 mb-4">
          <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isDanger ? "bg-red-100" : "bg-yellow-100"}`}>
            <AlertTriangle className={`w-5 h-5 ${isDanger ? "text-red-600" : "text-yellow-600"}`} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-0.5">{message}</p>
          </div>
        </div>
        <div className="flex gap-3 justify-end">
          <button className="btn-secondary" onClick={onCancel} disabled={isLoading}>Cancel</button>
          <button className={isDanger ? "btn-danger" : "btn-primary"} onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Processing..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
