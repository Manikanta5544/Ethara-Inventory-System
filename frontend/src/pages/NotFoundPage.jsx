import { Home } from "lucide-react";
import { Link } from "react-router-dom";
export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-24 text-center px-4">
      <div className="text-8xl font-black text-gray-100 mb-2 select-none">404</div>
      <h1 className="text-xl font-semibold text-gray-900 mb-2">Page not found</h1>
      <p className="text-sm text-gray-500 mb-8 max-w-xs">The page you're looking for doesn't exist or has been moved.</p>
      <Link to="/" className="btn-primary"><Home className="w-4 h-4" /> Go to Dashboard</Link>
    </div>
  );
}