// src/routes/PrestataireRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PrestataireRoute = () => {
  const { user, isLoading } = useAuth();
  
  console.log("PrestataireRoute - User:", user);
  console.log("PrestataireRoute - Loading:", isLoading);
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        Chargement...
      </div>
    );
  }
  
  if (!user) {
    console.log("PrestataireRoute: Non authentifié, redirection vers login");
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== "prestataire") {
    console.log("PrestataireRoute: Rôle non autorisé - Role actuel:", user.role);
    if (user.role === "admin") {
      return <Navigate to="/admin/statistiques" replace />;
    }
    if (user.role === "demandeur") {
      return <Navigate to="/demandeur/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }
  
  console.log("PrestataireRoute: Accès autorisé pour prestataire");
  return <Outlet />;
};

export default PrestataireRoute;