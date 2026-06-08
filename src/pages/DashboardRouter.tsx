// src/pages/DashboardRouter.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const DashboardRouter = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        navigate("/login");
      } else {
        switch (user.role) {
          case "admin":
            navigate("/admin/statistiques");
            break;
          case "prestataire":
            navigate("/prestataire/dashboard");
            break;
          case "demandeur":
            navigate("/demandeur/dashboard");
            break;
          default:
            navigate("/");
        }
      }
    }
  }, [user, isLoading, navigate]);
  
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh'
    }}>
      Redirection en cours...
    </div>
  );
};

export default DashboardRouter;