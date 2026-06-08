// src/routes/DemandeurRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DemandeurRoute = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div className="spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }
  
  if (!user) {
    console.log("DemandeurRoute: Non authentifié, redirection vers login");
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "demandeur") {
    console.log("DemandeurRoute: Rôle non autorisé", user.role);
    if (user.role === "admin") {
      return <Navigate to="/admin/statistiques" replace />;
    }
    if (user.role === "prestataire") {
      return <Navigate to="/prestataire/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  console.log("DemandeurRoute: Accès autorisé");
  return <Outlet />;
};

export default DemandeurRoute;