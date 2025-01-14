import React, { lazy } from "react";
import { Routes, Route } from "react-router-dom";

const Users = lazy(() => import("@/pages/admin/Users"));
const Products = lazy(() => import("@/pages/admin/Products"));

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/users" element={<Users />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
};

export default AdminRoutes;