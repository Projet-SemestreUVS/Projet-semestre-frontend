// src/routes/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // si pas connecté ou pas admin → redirect login
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" />;
  }

  // sinon → afficher les pages admin
  return <Outlet />;
};

export default AdminRoute;