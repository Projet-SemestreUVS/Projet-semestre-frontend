// src/pages/prestataire/DashboardPrestataire.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";

const DashboardPrestataire = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <DashboardLayout sidebar={<PrestataireSidebar />}>
        <div style={{ textAlign: "center", padding: "2rem" }}>
          Chargement du tableau de bord prestataire...
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div>
        <h1>Tableau de bord Prestataire</h1>
        <p>Bienvenue dans votre espace prestataire</p>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPrestataire;