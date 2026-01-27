import {Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import CategoryProducts from "./pages/CategoryProducts.jsx";

import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import AdminProducts from "./pages/admin/AdminProducts.jsx";
import AdminProductForm from "./pages/admin/AdminProductForm.jsx";
import ProtectedRoute from "./pages/admin/ProtectedRoute.jsx";
import AdminCategories from "./pages/admin/AdminCategories.jsx";
import AdminCategoryForm from "./pages/admin/AdminCategoryForm.jsx";

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/categoria/:slug" element={<CategoryProducts />} />

      {/* Admin */}
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/admin/productos" replace />} />
        <Route path="productos" element={<AdminProducts />} />
        <Route path="productos/nuevo" element={<AdminProductForm mode="create" />} />
        <Route path="productos/:id/editar" element={<AdminProductForm mode="edit" />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="categorias/nueva" element={<AdminCategoryForm mode="create" />} />
        <Route path="categorias/:id/editar" element={<AdminCategoryForm mode="edit" />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
