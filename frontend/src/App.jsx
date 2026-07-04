import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppLayout } from "./shared/components/layout/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";
import { ProductsPage } from "./pages/ProductsPage";
import { CustomersPage } from "./pages/CustomersPage";
import { OrdersPage } from "./pages/OrdersPage";

export default function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{ duration: 3500, style: { fontSize: "13px", maxWidth: "380px" } }}
      />
      <AppLayout>
        <Routes>
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="*"           element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}