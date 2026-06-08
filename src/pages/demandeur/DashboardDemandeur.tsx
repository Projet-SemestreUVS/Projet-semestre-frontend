// src/pages/demandeur/DashboardDemandeur.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import "../../styles/dashboard.css";

// Interface pour les données
interface Service {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  duree: string;
  note: number;
  prestataire: string;
  image: string;
}

interface Reservation {
  id: number;
  service: string;
  prestataire: string;
  date: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  montant: number;
}

interface Statistiques {
  totalReservations: number;
  totalDepenses: number;
  servicesUtilises: number;
  avisDonnes: number;
}

const DashboardDemandeur = () => {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [servicesRecents, setServicesRecents] = useState<Service[]>([]);
  const [reservationsRecentes, setReservationsRecentes] = useState<Reservation[]>([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Données mockées
      const statsMock: Statistiques = {
        totalReservations: 12,
        totalDepenses: 245000,
        servicesUtilises: 8,
        avisDonnes: 7
      };

      const servicesMock: Service[] = [
        { id: 1, nom: "Plomberie Express", categorie: "Plomberie", prix: 25000, duree: "1h", note: 4.8, prestataire: "Alpha Tech", image: "" },
        { id: 2, nom: "Ménage Complet", categorie: "Entretien", prix: 18000, duree: "2h", note: 4.9, prestataire: "Clean Service", image: "" },
        { id: 3, nom: "Cours Maths", categorie: "Éducation", prix: 15000, duree: "1h", note: 4.7, prestataire: "Educ Plus", image: "" },
        { id: 4, nom: "Transport Aéroport", categorie: "Transport", prix: 15000, duree: "30min", note: 4.6, prestataire: "Mobility", image: "" }
      ];

      const reservationsMock: Reservation[] = [
        { id: 1, service: "Plomberie Express", prestataire: "Alpha Tech", date: "2024-06-15", statut: "terminee", montant: 25000 },
        { id: 2, service: "Ménage Complet", prestataire: "Clean Service", date: "2024-06-10", statut: "terminee", montant: 18000 },
        { id: 3, service: "Cours Maths", prestataire: "Educ Plus", date: "2024-06-05", statut: "confirmee", montant: 45000 },
        { id: 4, service: "Transport Aéroport", prestataire: "Mobility", date: "2024-06-20", statut: "en_attente", montant: 15000 },
        { id: 5, service: "Électricité Sûre", prestataire: "Electro Plus", date: "2024-05-28", statut: "terminee", montant: 30000 }
      ];

      setStatistiques(statsMock);
      setServicesRecents(servicesMock);
      setReservationsRecentes(reservationsMock);
      setChargement(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (chargement) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de votre tableau de bord...</p>
        </div>
      </DashboardLayout>
    );
  }

  const getStatutClass = (statut: string) => {
    switch (statut) {
      case "confirmee": return "statut-confirmee";
      case "terminee": return "statut-terminee";
      case "annulee": return "statut-annulee";
      default: return "statut-attente";
    }
  };

  const getStatutTexte = (statut: string) => {
    switch (statut) {
      case "confirmee": return "Confirmée";
      case "terminee": return "Terminée";
      case "annulee": return "Annulée";
      default: return "En attente";
    }
  };

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="dashboard-demandeur">
        {/* En-tête */}
        <div className="dashboard-header-demandeur">
          <div className="dashboard-welcome">
            <h1>
              <i className="bi bi-person-circle"></i>
              Tableau de bord Demandeur
            </h1>
            <p>Gérez vos réservations et découvrez de nouveaux services</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/services" className="btn-explorer">
              <i className="bi bi-search"></i>
              Explorer les services
            </Link>
          </div>
        </div>

        {/* Cartes Statistiques */}
        <div className="stats-cards-demandeur">
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#354dd415", color: "#354dd4" }}>
              <i className="bi bi-calendar-check"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalReservations || 0}</div>
              <div className="stat-card-label">Réservations</div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>
              <i className="bi bi-calculator"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{(statistiques?.totalDepenses || 0).toLocaleString()} FCFA</div>
              <div className="stat-card-label">Dépenses totales</div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>
              <i className="bi bi-grid"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.servicesUtilises || 0}</div>
              <div className="stat-card-label">Services utilisés</div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#8B5CF615", color: "#8B5CF6" }}>
              <i className="bi bi-star"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.avisDonnes || 0}</div>
              <div className="stat-card-label">Avis donnés</div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="quick-actions">
          <Link to="/demandeur/reservations" className="quick-action-card">
            <i className="bi bi-calendar-plus"></i>
            <span>Nouvelle réservation</span>
          </Link>
          <Link to="/services" className="quick-action-card">
            <i className="bi bi-search-heart"></i>
            <span>Trouver un service</span>
          </Link>
          <Link to="/demandeur/messages" className="quick-action-card">
            <i className="bi bi-chat-dots"></i>
            <span>Messages</span>
          </Link>
          <Link to="/demandeur/profile" className="quick-action-card">
            <i className="bi bi-person-gear"></i>
            <span>Mon profil</span>
          </Link>
        </div>

        {/* Services récents et Réservations */}
        <div className="dashboard-grid-demandeur">
          {/* Services récents */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="bi bi-clock-history"></i>
                Services récents
              </h3>
              <Link to="/services" className="voir-tout">
                Voir tout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body">
              <div className="services-list">
                {servicesRecents.map((service) => (
                  <div key={service.id} className="service-item">
                    <div className="service-icon">
                      <i className="bi bi-tools"></i>
                    </div>
                    <div className="service-info">
                      <div className="service-name">{service.nom}</div>
                      <div className="service-meta">
                        <span className="service-category">{service.categorie}</span>
                        <span className="service-price">{service.prix.toLocaleString()} FCFA</span>
                      </div>
                    </div>
                    <Link to={`/services/${service.id}`} className="service-action">
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Réservations récentes */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="bi bi-calendar-week"></i>
                Réservations récentes
              </h3>
              <Link to="/demandeur/reservations" className="voir-tout">
                Voir tout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body">
              <div className="reservations-list">
                {reservationsRecentes.map((reservation) => (
                  <div key={reservation.id} className="reservation-item">
                    <div className="reservation-info">
                      <div className="reservation-service">{reservation.service}</div>
                      <div className="reservation-prestataire">
                        <i className="bi bi-person"></i> {reservation.prestataire}
                      </div>
                      <div className="reservation-date">
                        <i className="bi bi-calendar"></i> {new Date(reservation.date).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                    <div className="reservation-right">
                      <div className="reservation-montant">{reservation.montant.toLocaleString()} FCFA</div>
                      <div className={`reservation-statut ${getStatutClass(reservation.statut)}`}>
                        {getStatutTexte(reservation.statut)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Conseils */}
        <div className="tips-section">
          <div className="tips-card">
            <i className="bi bi-lightbulb"></i>
            <div className="tips-content">
              <h4>Conseil du jour</h4>
              <p>N'oubliez pas de laisser un avis après chaque service. Votre retour aide la communauté !</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardDemandeur;