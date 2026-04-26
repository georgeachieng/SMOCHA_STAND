import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CategoriesPage from "./pages/CategoriesPage";
import ProductsPage from "./pages/ProductsPage";
import SuppliersPage from "./pages/SuppliersPage";
import InventoryPage from "./pages/InventoryPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
