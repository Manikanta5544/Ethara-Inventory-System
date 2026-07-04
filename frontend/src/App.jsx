import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppLayout } from "./shared/components/layout/AppLayout";
import { NotFoundPage } from "./pages/NotFoundPage";

export default function App() {
  return (
    <Router>
      <Toaster position="top-right" reverseOrder={false} />
      <AppLayout>
        <Routes>
          <Route path="*"           element={<NotFoundPage />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}