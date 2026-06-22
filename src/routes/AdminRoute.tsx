// src/routes/AdminRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";


const AdminRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return <div>Chargement...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "admin") {
    // Rediriger vers le bon dashboard selon le rôle
    if (user.role === "prestataire") {
      return <Navigate to="/prestataire/dashboard" replace />;
    }
    if (user.role === "demandeur") {
      return <Navigate to="/demandeur/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default AdminRoute;