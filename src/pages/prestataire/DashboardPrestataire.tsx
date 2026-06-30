// src/pages/prestataire/DashboardPrestataire.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
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
  statut: string;
}

interface ReservationRecente {
  id: number;
  service: string;
  demandeur: string;
  date_debut: string;
  statut: string;
  montant: number;
}

interface NotificationRecente {
  id: number;
  type: "reservation" | "avis" | "message";
  contenu: string;
  date: string;
  lu: boolean;
}

const DashboardPrestataire = () => {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [servicesRecents, setServicesRecents] = useState<ServiceRecent[]>([]);
  const [reservationsRecentes, setReservationsRecentes] = useState<ReservationRecente[]>([]);
  const [notificationsRecentes, setNotificationsRecentes] = useState<NotificationRecente[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les services depuis localStorage
      const storedServices = localStorage.getItem("prestataire_services");
      let services = [];
      if (storedServices) {
        services = JSON.parse(storedServices);
      }
      
      // Récupérer les réservations depuis localStorage
      const storedReservations = localStorage.getItem("reservations");
      let allReservations = [];
      if (storedReservations) {
        allReservations = JSON.parse(storedReservations);
      }
      
      // Filtrer les réservations du prestataire (prestataire_id = 2 par défaut)
      const prestataireReservations = allReservations.filter((r: any) => r.prestataire_id === 2);
      
      // Statistiques
      const statsMock: Statistiques = {
        totalServices: services.length || 8,
        totalReservations: prestataireReservations.length || 24,
        reservationsEnAttente: prestataireReservations.filter((r: any) => r.statut === "en_attente").length || 5,
        reservationsConfirmees: prestataireReservations.filter((r: any) => r.statut === "confirmee").length || 12,
        reservationsTerminees: prestataireReservations.filter((r: any) => r.statut === "terminee").length || 7,
        totalRevenus: prestataireReservations.filter((r: any) => r.statut === "terminee").reduce((sum: number, r: any) => sum + r.montant, 0) || 425000,
        noteMoyenne: 4.8
      };

      // Services récents (3 derniers)
      const servicesMock: ServiceRecent[] = services.slice(0, 3).map((s: any) => ({
        id: s.id,
        nom: s.nom,
        prix: s.prix,
        reservations_count: s.reservations_count || 0,
        statut: s.statut || "actif"
      }));
      
      if (servicesMock.length === 0) {
        servicesMock.push(
          { id: 1, nom: "Plomberie Express", prix: 25000, reservations_count: 12, statut: "actif" },
          { id: 2, nom: "Dépannage Électrique", prix: 30000, reservations_count: 8, statut: "actif" },
          { id: 3, nom: "Installation Climatisation", prix: 40000, reservations_count: 4, statut: "actif" }
        );
      }

      // Réservations récentes (5 dernières)
      const reservationsMock: ReservationRecente[] = prestataireReservations.slice(0, 5).map((r: any) => ({
        id: r.id,
        service: r.service_nom,
        demandeur: `${r.demandeur_prenom} ${r.demandeur_nom}`,
        date_debut: r.date_debut,
        statut: r.statut,
        montant: r.montant
      }));

      // Notifications récentes
      const storedNotifications = localStorage.getItem("prestataire_notifications");
      let notifications = [];
      if (storedNotifications) {
        notifications = JSON.parse(storedNotifications).slice(0, 3);
      }
      setNotificationsRecentes(notifications);

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

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "confirmee": return "bi-check-circle";
      case "terminee": return "bi-check2-circle";
      case "annulee": return "bi-x-circle";
      default: return "bi-clock";
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

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return "À l'instant";
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
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
        {/* En-tête avec horloge */}
        <div className="dashboard-header-prestataire">
          <div className="dashboard-welcome">
            <div className="welcome-badge">
              <span className="status-dot"></span>
              En ligne
            </div>
            <h1>
              <i className="bi bi-briefcase"></i>
              Tableau de bord
            </h1>
            <p>Gérez vos services et suivez vos réservations en temps réel</p>
          </div>
          <div className="dashboard-actions">
            <div className="clock-display">
              <i className="bi bi-clock"></i>
              <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            <Link to="/prestataire/services/ajouter" className="btn-add-service">
              <i className="bi bi-plus-circle"></i>
              Nouveau service
            </Link>
          </div>
        </div>

        {/* Cartes Statistiques avec icônes modernes */}
        <div className="stats-cards-prestataire">
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#354dd415", color: "#354dd4" }}>
              <i className="bi bi-grid"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalServices || 0}</div>
              <div className="stat-card-label">Services actifs</div>
              <div className="stat-card-trend">
                <i className="bi bi-arrow-up"></i>
                <span>+2 ce mois</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>
              <i className="bi bi-calendar-check"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalReservations || 0}</div>
              <div className="stat-card-label">Réservations totales</div>
              <div className="stat-card-trend">
                <i className="bi bi-arrow-up"></i>
                <span>+5 ce mois</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>
              <i className="bi bi-clock-history"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.reservationsEnAttente || 0}</div>
              <div className="stat-card-label">En attente</div>
              <div className="stat-card-trend">
                <i className="bi bi-clock"></i>
                <span>À traiter</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#8B5CF615", color: "#8B5CF6" }}>
              <i className="bi bi-currency-dollar"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.totalRevenus?.toLocaleString()} FCFA</div>
              <div className="stat-card-label">Revenus totaux</div>
              <div className="stat-card-trend">
                <i className="bi bi-arrow-up"></i>
                <span>+12% ce mois</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="quick-actions-prestataire">
          <Link to="/prestataire/services/ajouter" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-plus-circle"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Ajouter un service</span>
              <span className="quick-action-desc">Proposez vos compétences</span>
            </div>
          </Link>
          <Link to="/prestataire/services" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-list-check"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Mes services</span>
              <span className="quick-action-desc">Gérez vos offres</span>
            </div>
          </Link>
          <Link to="/prestataire/reservations" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-calendar-week"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Réservations</span>
              <span className="quick-action-desc">Consultez vos demandes</span>
            </div>
          </Link>
          <Link to="/prestataire/profile" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-person-gear"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Mon profil</span>
              <span className="quick-action-desc">Mettez à jour vos infos</span>
            </div>
          </Link>
        </div>

        {/* Grille principale */}
        <div className="dashboard-grid-prestataire">
          {/* Services récents */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>
                <i className="bi bi-tools"></i>
                Mes services récents
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
                        <span className="service-reservations">
                          <i className="bi bi-calendar"></i> {service.reservations_count} réservations
                        </span>
                        <span className={`service-status ${service.statut === "actif" ? "status-active" : "status-inactive"}`}>
                          {service.statut === "actif" ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>
                    <Link to={`/prestataire/services/modifier/${service.id}`} className="service-action" title="Modifier">
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
                {reservationsRecentes.length === 0 ? (
                  <div className="empty-reservations">
                    <i className="bi bi-inbox"></i>
                    <p>Aucune réservation pour le moment</p>
                  </div>
                ) : (
                  reservationsRecentes.map((reservation) => (
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
                          <i className={`bi ${getStatutIcon(reservation.statut)}`}></i>
                          {getStatutTexte(reservation.statut)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Section Notifications et Évaluation */}
        <div className="dashboard-bottom-section">
          {/* Notifications récentes */}
          <div className="notifications-card">
            <div className="card-header">
              <h3>
                <i className="bi bi-bell"></i>
                Notifications récentes
              </h3>
              <Link to="/prestataire/notifications" className="voir-tout">
                Voir tout <i className="bi bi-arrow-right"></i>
              </Link>
            </div>
            <div className="card-body">
              {notificationsRecentes.length === 0 ? (
                <div className="empty-notifications">
                  <i className="bi bi-bell-slash"></i>
                  <p>Aucune notification</p>
                </div>
              ) : (
                <div className="notifications-list-prestataire">
                  {notificationsRecentes.map((notif) => (
                    <div key={notif.id} className="notification-item-prestataire">
                      <div className="notification-icon">
                        <i className={`bi ${
                          notif.type === "reservation" ? "bi-calendar-check" :
                          notif.type === "avis" ? "bi-star" : "bi-chat-dots"
                        }`}></i>
                      </div>
                      <div className="notification-content">
                        <div className="notification-text">{notif.contenu}</div>
                        <div className="notification-time">{formatDateShort(notif.date)}</div>
                      </div>
                      {!notif.lu && <span className="notification-dot"></span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Évaluation */}
          <div className="rating-section">
            <div className="rating-card">
              <div className="rating-icon">
                <i className="bi bi-star-fill"></i>
              </div>
              <div className="rating-content">
                <h4>Note moyenne</h4>
                <div className="rating-value">
                  <span className="rating-number">{statistiques?.noteMoyenne || 0}</span>
                  <span className="rating-stars">
                    {"★".repeat(Math.floor(statistiques?.noteMoyenne || 0))}
                    {"☆".repeat(5 - Math.floor(statistiques?.noteMoyenne || 0))}
                  </span>
                </div>
                <p>Basé sur {statistiques?.totalReservations || 0} avis clients</p>
                <div className="rating-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${(statistiques?.noteMoyenne || 0) / 5 * 100}%` }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="quick-stats">
              <div className="quick-stat-item">
                <span className="qs-value">{statistiques?.totalServices || 0}</span>
                <span className="qs-label">Services</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="qs-value">{statistiques?.totalReservations || 0}</span>
                <span className="qs-label">Réservations</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="qs-value">{statistiques?.totalRevenus?.toLocaleString()} FCFA</span>
                <span className="qs-label">Revenus</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-prestataire {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* En-tête */
        .dashboard-header-prestataire {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .dashboard-welcome .welcome-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: #dcfce7;
          color: #22c55e;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .status-dot {
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          display: inline-block;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .dashboard-welcome h1 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .dashboard-welcome h1 i {
          color: #354dd4;
        }

        .dashboard-welcome p {
          color: #64748b;
          font-size: 0.875rem;
        }

        .dashboard-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .clock-display {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: white;
          border-radius: 12px;
          color: #1e293b;
          font-weight: 500;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }

        .clock-display i {
          color: #354dd4;
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
          box-shadow: 0 4px 12px rgba(53, 77, 212, 0.3);
        }

        .btn-add-service:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(53, 77, 212, 0.4);
          color: white;
        }

        /* Cartes Statistiques */
        .stats-cards-prestataire {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card-dashboard {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .stat-card-dashboard:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }

        .stat-card-icon {
          width: 55px;
          height: 55px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-card-icon i {
          font-size: 1.5rem;
        }

        .stat-card-info {
          flex: 1;
        }

        .stat-card-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.2;
        }

        .stat-card-label {
          font-size: 0.8rem;
          color: #64748b;
        }

        .stat-card-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #22c55e;
          margin-top: 0.25rem;
        }

        .stat-card-trend i {
          font-size: 0.6rem;
        }

        /* Actions rapides */
        .quick-actions-prestataire {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .quick-action-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: white;
          border-radius: 16px;
          text-decoration: none;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .quick-action-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }

        .quick-action-icon {
          width: 48px;
          height: 48px;
          background: #eef2ff;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .quick-action-icon i {
          font-size: 1.25rem;
          color: #354dd4;
        }

        .quick-action-content {
          flex: 1;
        }

        .quick-action-title {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
        }

        .quick-action-desc {
          font-size: 0.7rem;
          color: #64748b;
        }

        /* Grille principale */
        .dashboard-grid-prestataire {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .dashboard-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #1e293b;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .card-header h3 i {
          color: #354dd4;
        }

        .voir-tout {
          font-size: 0.75rem;
          color: #354dd4;
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          transition: gap 0.3s ease;
        }

        .voir-tout:hover {
          gap: 0.5rem;
        }

        .card-body {
          padding: 1rem;
        }

        /* Services */
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
          flex-shrink: 0;
        }

        .service-icon i {
          font-size: 1.25rem;
          color: #354dd4;
        }

        .service-info {
          flex: 1;
          min-width: 0;
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
          flex-wrap: wrap;
          align-items: center;
        }

        .service-price {
          color: #354dd4;
          font-weight: 600;
        }

        .service-reservations {
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .service-status {
          font-size: 0.6rem;
          padding: 0.15rem 0.5rem;
          border-radius: 12px;
        }

        .status-active {
          background: #dcfce7;
          color: #22c55e;
        }

        .status-inactive {
          background: #fee2e2;
          color: #ef4444;
        }

        .service-action {
          width: 32px;
          height: 32px;
          background: #f1f5f9;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #354dd4;
          text-decoration: none;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .service-action:hover {
          background: #354dd4;
          color: white;
        }

        /* Réservations */
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
          min-width: 0;
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
          flex-shrink: 0;
        }

        .reservation-montant {
          font-size: 0.875rem;
          font-weight: 700;
          color: #354dd4;
          margin-bottom: 0.25rem;
        }

        .reservation-statut {
          font-size: 0.65rem;
          padding: 0.2rem 0.6rem;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }

        .statut-confirmee { background: #dcfce7; color: #22c55e; }
        .statut-terminee { background: #eef2ff; color: #354dd4; }
        .statut-attente { background: #fef3c7; color: #d97706; }
        .statut-annulee { background: #fee2e2; color: #ef4444; }

        /* Section bas */
        .dashboard-bottom-section {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        /* Notifications */
        .notifications-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .notifications-list-prestataire {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .notification-item-prestataire {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .notification-item-prestataire:hover {
          background: #f8fafc;
        }

        .notification-icon {
          width: 36px;
          height: 36px;
          background: #eef2ff;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-icon i {
          font-size: 0.9rem;
          color: #354dd4;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-text {
          font-size: 0.8rem;
          color: #1e293b;
          line-height: 1.4;
        }

        .notification-time {
          font-size: 0.65rem;
          color: #94a3b8;
          margin-top: 0.1rem;
        }

        .notification-dot {
          width: 8px;
          height: 8px;
          background: #354dd4;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .empty-notifications, .empty-reservations {
          text-align: center;
          padding: 1.5rem;
          color: #94a3b8;
        }

        .empty-notifications i, .empty-reservations i {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          display: block;
        }

        /* Évaluation */
        .rating-section {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .rating-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .rating-icon {
          width: 60px;
          height: 60px;
          background: #fef3c7;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .rating-icon i {
          font-size: 2rem;
          color: #f59e0b;
        }

        .rating-content {
          flex: 1;
        }

        .rating-content h4 {
          font-size: 0.8rem;
          font-weight: 500;
          color: #64748b;
          margin-bottom: 0.25rem;
        }

        .rating-number {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1e293b;
        }

        .rating-stars {
          color: #fbbf24;
          font-size: 0.8rem;
          margin-left: 0.5rem;
        }

        .rating-content p {
          font-size: 0.7rem;
          color: #64748b;
          margin: 0.25rem 0 0.5rem;
        }

        .rating-progress {
          width: 100%;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 4px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #f59e0b;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        /* Stats rapides */
        .quick-stats {
          background: white;
          border-radius: 16px;
          padding: 1rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-around;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .quick-stat-item {
          text-align: center;
        }

        .qs-value {
          display: block;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e293b;
        }

        .qs-label {
          font-size: 0.65rem;
          color: #64748b;
        }

        .quick-stat-divider {
          width: 1px;
          height: 30px;
          background: #e2e8f0;
        }

        /* Responsive */
        @media (max-width: 1200px) {
          .stats-cards-prestataire {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .dashboard-grid-prestataire {
            grid-template-columns: 1fr;
          }
          
          .dashboard-bottom-section {
            grid-template-columns: 1fr;
          }
          
          .quick-actions-prestataire {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-header-prestataire {
            flex-direction: column;
          }
          
          .dashboard-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .stats-cards-prestataire {
            grid-template-columns: 1fr 1fr;
          }
          
          .quick-actions-prestataire {
            grid-template-columns: 1fr 1fr;
          }
          
          .reservation-item-prestataire {
            flex-direction: column;
            text-align: center;
          }
          
          .reservation-right {
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .stats-cards-prestataire {
            grid-template-columns: 1fr;
          }
          
          .quick-actions-prestataire {
            grid-template-columns: 1fr;
          }
          
          .rating-card {
            flex-direction: column;
            text-align: center;
          }
          
          .quick-stats {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .quick-stat-divider {
            width: 100%;
            height: 1px;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default DashboardPrestataire;