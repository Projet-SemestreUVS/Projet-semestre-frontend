// src/pages/admin/Statistiques.tsx
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import "../../styles/dashboard.css";

// Composant Cartes Statistiques
const StatsCards = ({ data }: { data: any }) => {
  const cards = [
    { title: "Utilisateurs", value: data?.total_users || 0, icon: "bi-people", color: "#354dd4" },
    { title: "Prestataires", value: data?.total_prestataires || 0, icon: "bi-briefcase", color: "#354dd4" },
    { title: "Demandeurs", value: data?.total_demandeurs || 0, icon: "bi-person", color: "#354dd4" },
    { title: "Services", value: data?.total_services || 0, icon: "bi-grid", color: "#354dd4" },
    { title: "Réservations", value: data?.total_reservations || 0, icon: "bi-calendar", color: "#354dd4" },
    { title: "Revenus", value: `${(data?.total_revenus || 0).toLocaleString()} FCFA`, icon: "bi-calculator", color: "#354dd4" },
  ];

  return (
    <div className="stats-cards">
      {cards.map((card, index) => (
        <div key={index} className="stat-card" style={{ borderTop: `4px solid ${card.color}` }}>
          <div className="stat-icon">
            <i className={`bi ${card.icon}`}></i>
          </div>
          <div className="stat-value">{card.value}</div>
          <div className="stat-label">{card.title}</div>
        </div>
      ))}
    </div>
  );
};

// Composant Graphique Réservations
const ReservationsChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">Aucune donnée de réservation</div>;
  }

  const maxValue = Math.max(...data.map(d => d.total || 0));

  return (
    <div className="chart-container">
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-item">
            <div 
              className="chart-bar" 
              style={{ 
                height: `${(item.total / maxValue) * 200}px`,
                backgroundColor: "#354dd4"
              }}
            ></div>
            <div className="chart-label">{item.mois}</div>
            <div className="chart-value">{item.total}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Composant Graphique Revenus
const RevenueChart = ({ data }: { data: any[] }) => {
  if (!data || data.length === 0) {
    return <div className="chart-placeholder">Aucune donnée de revenu</div>;
  }

  const maxValue = Math.max(...data.map(d => d.total || 0));

  return (
    <div className="chart-container">
      <div className="chart-bars">
        {data.map((item, index) => (
          <div key={index} className="chart-bar-item">
            <div 
              className="chart-bar revenue-bar" 
              style={{ 
                height: `${(item.total / maxValue) * 200}px`,
                backgroundColor: "#22C55E"
              }}
            ></div>
            <div className="chart-label">{item.mois}</div>
            <div className="chart-value">{item.total.toLocaleString()} FCFA</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const Statistiques = () => {
  const [stats, setStats] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);

  useEffect(() => {
    recupererStatistiques();
  }, []);

  const recupererStatistiques = async () => {
    try {
      setChargement(true);
      setErreur(null);
      
      // Données mockées pour le développement
      const donneesMock = {
        total_users: 1250,
        total_prestataires: 450,
        total_demandeurs: 800,
        total_services: 320,
        total_reservations: 1250,
        total_revenus: 12500000,
        reservations_par_mois: [
          { mois: "Jan", total: 45 },
          { mois: "Fév", total: 52 },
          { mois: "Mar", total: 48 },
          { mois: "Avr", total: 61 },
          { mois: "Mai", total: 55 },
          { mois: "Juin", total: 67 }
        ],
        revenus_par_mois: [
          { mois: "Jan", total: 450000 },
          { mois: "Fév", total: 520000 },
          { mois: "Mar", total: 480000 },
          { mois: "Avr", total: 610000 },
          { mois: "Mai", total: 550000 },
          { mois: "Juin", total: 670000 }
        ]
      };
      
      // Simuler un délai réseau
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setStats(donneesMock);
      
    } catch (err: any) {
      console.error("Erreur:", err);
      setErreur(err.message || "Erreur lors du chargement des statistiques");
    } finally {
      setChargement(false);
    }
  };

  if (chargement) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des statistiques...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (erreur) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Erreur de chargement</h3>
          <p>{erreur}</p>
          <button onClick={recupererStatistiques} className="retry-btn">
            Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!stats) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="no-data-container">
          <p>Aucune donnée disponible</p>
          <button onClick={recupererStatistiques} className="retry-btn">
            Recharger
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="statistiques-page">
        <div className="page-header">
          <h2>Tableau de bord Administrateur</h2>
          <p>Bienvenue dans votre espace d'administration</p>
        </div>
        
        <StatsCards data={stats} />

        <div className="charts-section">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <div className="card-chart">
                <div className="card-chart-header">
                  <h5>
                    <i className="bi bi-calendar-week"></i>
                    Réservations par mois
                  </h5>
                </div>
                <div className="card-chart-body">
                  <ReservationsChart data={stats.reservations_par_mois || []} />
                </div>
              </div>
            </div>

            <div className="col-lg-6 mb-4">
              <div className="card-chart">
                <div className="card-chart-header">
                  <h5>
                    <i className="bi bi-currency-exchange"></i>
                    Revenus par mois
                  </h5>
                </div>
                <div className="card-chart-body">
                  <RevenueChart data={stats.revenus_par_mois || []} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Statistiques;