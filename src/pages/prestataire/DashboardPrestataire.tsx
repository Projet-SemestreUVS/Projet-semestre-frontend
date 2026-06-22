// src/pages/prestataire/DashboardPrestataire.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Statistiques {
  totalServices: number;
  totalReservations: number;
  reservationsEnAttente: number;
  reservationsConfirmees: number;
  reservationsTerminees: number;
  totalRevenus: number;
  noteMoyenne: number;
}

interface ServiceRecent {
  id: number;
  nom: string;
  prix: number;
  reservations_count: number;
}

interface ReservationRecente {
  id: number;
  service: string;
  demandeur: string;
  date_debut: string;
  statut: string;
  montant: number;
}

const DashboardPrestataire = () => {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [servicesRecents, setServicesRecents] = useState<ServiceRecent[]>([]);
  const [reservationsRecentes, setReservationsRecentes] = useState<ReservationRecente[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Données mockées pour le développement
      const statsMock: Statistiques = {
        totalServices: 8,
        totalReservations: 24,
        reservationsEnAttente: 5,
        reservationsConfirmees: 12,
        reservationsTerminees: 7,
        totalRevenus: 425000,
        noteMoyenne: 4.8
      };

      const servicesMock: ServiceRecent[] = [
        { id: 1, nom: "Plomberie Express", prix: 25000, reservations_count: 12 },
        { id: 2, nom: "Dépannage Électrique", prix: 30000, reservations_count: 8 },
        { id: 3, nom: "Installation Climatisation", prix: 40000, reservations_count: 4 }
      ];

      const reservationsMock: ReservationRecente[] = [
        { id: 1, service: "Plomberie Express", demandeur: "Jean Dupont", date_debut: "2024-06-15T10:00:00", statut: "confirmee", montant: 25000 },
        { id: 2, service: "Dépannage Électrique", demandeur: "Marie Lambert", date_debut: "2024-06-14T14:00:00", statut: "terminee", montant: 30000 },
        { id: 3, service: "Installation Climatisation", demandeur: "Papa Diop", date_debut: "2024-06-16T09:00:00", statut: "en_attente", montant: 40000 }
      ];

      setStatistiques(statsMock);
      setServicesRecents(servicesMock);
      setReservationsRecentes(reservationsMock);
      
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<PrestataireSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de votre tableau de bord...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="dashboard-prestataire">
        {/* En-tête */}
        <div className="dashboard-header-prestataire">
          <div className="dashboard-welcome">
            <h1>
              <i className="bi bi-briefcase"></i>
              Tableau de bord Prestataire
            </h1>
            <p>Gérez vos services et suivez vos réservations</p>
          </div>
          <div className="dashboard-actions">
            <Link to="/prestataire/services/ajouter" className="btn-add-service">
              <i className="bi bi-plus-circle"></i>
              Nouveau service
            </Link>
          </div>
        </div>

        {/* Cartes Statistiques */}
        <div className="stats-cards-prestataire">
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#354dd415", color: "#354dd4" }}>
              <i className="bi bi-grid"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalServices || 0}</div>
              <div className="stat-card-label">Services actifs</div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>
              <i className="bi bi-calendar-check"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalReservations || 0}</div>
              <div className="stat-card-label">Réservations</div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.reservationsEnAttente || 0}</div>
              <div className="stat-card-label">En attente</div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#8B5CF615", color: "#8B5CF6" }}>
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalRevenus?.toLocaleString()} FCFA</div>
              <div className="stat-card-label">Revenus</div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="quick-actions-prestataire">
          <Link to="/prestataire/services/ajouter" className="quick-action-card">
            <i className="bi bi-plus-circle"></i>
            <span>Ajouter un service</span>
          </Link>
          <Link to="/prestataire/services" className="quick-action-card">
            <i className="bi bi-list-check"></i>
            <span>Mes services</span>
          </Link>
          <Link to="/prestataire/reservations" className="quick-action-card">
            <i className="bi bi-calendar-week"></i>
            <span>Réservations</span>
          </Link>
          <Link to="/prestataire/profile" className="quick-action-card">
            <i className="bi bi-person-gear"></i>
            <span>Mon profil</span>
          </Link>
        </div>

        {/* Services récents et Réservations */}
        <div className="dashboard-grid-prestataire">
          {/* Services récents */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="bi bi-tools"></i>
                Mes services
              </h3>
              <Link to="/prestataire/services" className="voir-tout">
                Voir tout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body">
              <div className="services-list-prestataire">
                {servicesRecents.map((service) => (
                  <div key={service.id} className="service-item-prestataire">
                    <div className="service-icon">
                      <i className="bi bi-tools"></i>
                    </div>
                    <div className="service-info">
                      <div className="service-name">{service.nom}</div>
                      <div className="service-meta">
                        <span className="service-price">{service.prix.toLocaleString()} FCFA</span>
                        <span className="service-reservations">{service.reservations_count} réservations</span>
                      </div>
                    </div>
                    <Link to={`/prestataire/services/modifier/${service.id}`} className="service-action">
                      <i className="bi bi-pencil"></i>
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
                Dernières réservations
              </h3>
              <Link to="/prestataire/reservations" className="voir-tout">
                Voir tout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body">
              <div className="reservations-list-prestataire">
                {reservationsRecentes.map((reservation) => (
                  <div key={reservation.id} className="reservation-item-prestataire">
                    <div className="reservation-info">
                      <div className="reservation-service">{reservation.service}</div>
                      <div className="reservation-demandeur">
                        <i className="bi bi-person"></i> {reservation.demandeur}
                      </div>
                      <div className="reservation-date">
                        <i className="bi bi-calendar"></i> {formatDate(reservation.date_debut)}
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

        {/* Évaluation */}
        <div className="rating-section">
          <div className="rating-card">
            <i className="bi bi-star-fill"></i>
            <div className="rating-content">
              <h4>Note moyenne</h4>
              <div className="rating-value">
                <span>{statistiques?.noteMoyenne || 0}</span>
                <span className="rating-stars">
                  {"★".repeat(Math.floor(statistiques?.noteMoyenne || 0))}
                  {"☆".repeat(5 - Math.floor(statistiques?.noteMoyenne || 0))}
                </span>
              </div>
              <p>Basé sur {statistiques?.totalReservations || 0} avis clients</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-prestataire {
          animation: fadeIn 0.5s ease;
        }

        .dashboard-header-prestataire {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .btn-add-service {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.6rem 1.25rem;
          background: #354dd4;
          color: white;
          text-decoration: none;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .btn-add-service:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
          color: white;
        }

        .stats-cards-prestataire {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .quick-actions-prestataire {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .dashboard-grid-prestataire {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .services-list-prestataire {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .service-item-prestataire {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .service-item-prestataire:hover {
          background: #f8fafc;
        }

        .service-icon {
          width: 45px;
          height: 45px;
          background: rgba(53, 77, 212, 0.1);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .service-icon i {
          font-size: 1.25rem;
          color: #354dd4;
        }

        .service-info {
          flex: 1;
        }

        .service-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .service-meta {
          display: flex;
          gap: 0.75rem;
          font-size: 0.7rem;
        }

        .service-price {
          color: #354dd4;
          font-weight: 600;
        }

        .service-reservations {
          color: #64748b;
        }

        .service-action {
          width: 30px;
          height: 30px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #354dd4;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .service-action:hover {
          background: #354dd4;
          color: white;
        }

        .reservations-list-prestataire {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .reservation-item-prestataire {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .reservation-item-prestataire:hover {
          background: #f8fafc;
        }

        .reservation-info {
          flex: 1;
        }

        .reservation-service {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .reservation-demandeur, .reservation-date {
          font-size: 0.7rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .reservation-right {
          text-align: right;
        }

        .reservation-montant {
          font-size: 0.875rem;
          font-weight: 700;
          color: #354dd4;
          margin-bottom: 0.25rem;
        }

        .rating-section {
          margin-top: 1rem;
        }

        .rating-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: linear-gradient(135deg, rgba(53, 77, 212, 0.05), rgba(53, 77, 212, 0.02));
          border-radius: 16px;
          border: 1px solid rgba(53, 77, 212, 0.1);
        }

        .rating-card i {
          font-size: 2rem;
          color: #f59e0b;
        }

        .rating-content h4 {
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
        }

        .rating-value {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .rating-value span:first-child {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 0.875rem;
        }

        @media (max-width: 1024px) {
          .dashboard-grid-prestataire {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-header-prestataire {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .stats-cards-prestataire {
            grid-template-columns: 1fr;
          }
          
          .quick-actions-prestataire {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default DashboardPrestataire;