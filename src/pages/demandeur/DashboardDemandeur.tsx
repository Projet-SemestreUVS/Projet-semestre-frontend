// src/pages/demandeur/DashboardDemandeur.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import "../../styles/dashboard.css";

// Interfaces
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

interface NotificationRecente {
  id: number;
  type: "reservation" | "avis" | "message";
  contenu: string;
  date: string;
  lu: boolean;
}

const DashboardDemandeur = () => {
  const [statistiques, setStatistiques] = useState<Statistiques | null>(null);
  const [servicesRecents, setServicesRecents] = useState<Service[]>([]);
  const [reservationsRecentes, setReservationsRecentes] = useState<Reservation[]>([]);
  const [notificationsRecentes, setNotificationsRecentes] = useState<NotificationRecente[]>([]);
  const [chargement, setChargement] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    chargerDonnees();
    return () => clearInterval(timer);
  }, []);

  const chargerDonnees = () => {
    setChargement(true);
    
    try {
      // Récupérer les réservations depuis localStorage
      const storedReservations = localStorage.getItem("reservations");
      let reservationsData = [];
      if (storedReservations) {
        reservationsData = JSON.parse(storedReservations);
      }
      
      // Récupérer les avis depuis localStorage
      const storedAvis = localStorage.getItem("demandeur_avis");
      let avisData = [];
      if (storedAvis) {
        avisData = JSON.parse(storedAvis);
      }
      
      // Statistiques
      const totalReservations = reservationsData.length || 12;
      const totalDepenses = reservationsData.reduce((sum: number, r: any) => sum + (r.montant || 0), 0) || 245000;
      const servicesUtilises = new Set(reservationsData.map((r: any) => r.service_id)).size || 8;
      const avisDonnes = avisData.length || 7;
      
      const statsMock: Statistiques = {
        totalReservations,
        totalDepenses,
        servicesUtilises,
        avisDonnes
      };

      // Services récents (4 derniers services utilisés)
      const servicesMock: Service[] = reservationsData.slice(0, 4).map((r: any, index: number) => ({
        id: r.service_id || index + 1,
        nom: r.service_nom || "Service",
        categorie: "Plomberie",
        prix: r.montant || 25000,
        duree: "1h",
        note: 4.8,
        prestataire: `${r.prestataire_prenom || "Alpha"} ${r.prestataire_nom || "Tech"}`,
        image: ""
      }));
      
      if (servicesMock.length === 0) {
        servicesMock.push(
          { id: 1, nom: "Plomberie Express", categorie: "Plomberie", prix: 25000, duree: "1h", note: 4.8, prestataire: "Alpha Tech", image: "" },
          { id: 2, nom: "Ménage Complet", categorie: "Entretien", prix: 18000, duree: "2h", note: 4.9, prestataire: "Clean Service", image: "" },
          { id: 3, nom: "Cours Maths", categorie: "Éducation", prix: 15000, duree: "1h", note: 4.7, prestataire: "Educ Plus", image: "" }
        );
      }

      // Réservations récentes (5 dernières)
      const reservationsMock: Reservation[] = reservationsData.slice(0, 5).map((r: any) => ({
        id: r.id,
        service: r.service_nom || "Service",
        prestataire: `${r.prestataire_prenom || "Alpha"} ${r.prestataire_nom || "Tech"}`,
        date: r.date_debut || new Date().toISOString(),
        statut: r.statut || "en_attente",
        montant: r.montant || 0
      }));

      // Notifications récentes
      const storedNotifications = localStorage.getItem("demandeur_notifications");
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
      setChargement(false);
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

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="dashboard-demandeur">
        {/* En-tête avec horloge */}
        <div className="dashboard-header-demandeur">
          <div className="dashboard-welcome">
            <div className="welcome-badge">
              <span className="status-dot"></span>
              En ligne
            </div>
            <h1>
              <i className="bi bi-person-circle"></i>
              Tableau de bord
            </h1>
            <p>Gérez vos réservations et découvrez de nouveaux services</p>
          </div>
          <div className="dashboard-actions">
            <div className="clock-display">
              <i className="bi bi-clock"></i>
              <span>{currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
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
              <div className="stat-card-trend">
                <i className="bi bi-arrow-up"></i>
                <span>+3 ce mois</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#22C55E15", color: "#22C55E" }}>
              <i className="bi bi-calculator"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{(statistiques?.totalDepenses || 0).toLocaleString()} FCFA</div>
              <div className="stat-card-label">Dépenses totales</div>
              <div className="stat-card-trend">
                <i className="bi bi-arrow-down"></i>
                <span>-5% ce mois</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#F59E0B15", color: "#F59E0B" }}>
              <i className="bi bi-grid"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.servicesUtilises || 0}</div>
              <div className="stat-card-label">Services utilisés</div>
              <div className="stat-card-trend">
                <i className="bi bi-arrow-up"></i>
                <span>+2 nouveaux</span>
              </div>
            </div>
          </div>
          
          <div className="stat-card-dashboard">
            <div className="stat-card-icon" style={{ backgroundColor: "#8B5CF615", color: "#8B5CF6" }}>
              <i className="bi bi-star"></i>
            </div>
            <div className="stat-card-info">
              <div className="stat-card-value">{statistiques?.avisDonnes || 0}</div>
              <div className="stat-card-label">Avis donnés</div>
              <div className="stat-card-trend">
                <i className="bi bi-star"></i>
                <span>4.8/5 moyenne</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="quick-actions">
          <Link to="/demandeur/reservation/nouvelle" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-calendar-plus"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Nouvelle réservation</span>
              <span className="quick-action-desc">Planifiez un service</span>
            </div>
          </Link>
          <Link to="/services" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-search-heart"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Trouver un service</span>
              <span className="quick-action-desc">Explorez les offres</span>
            </div>
          </Link>
          <Link to="/demandeur/messages" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-chat-dots"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Messages</span>
              <span className="quick-action-desc">Discutez avec vos prestataires</span>
            </div>
          </Link>
          <Link to="/demandeur/profile" className="quick-action-card">
            <div className="quick-action-icon">
              <i className="bi bi-person-gear"></i>
            </div>
            <div className="quick-action-content">
              <span className="quick-action-title">Mon profil</span>
              <span className="quick-action-desc">Mettez à jour vos infos</span>
            </div>
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
                        <span className="service-rating">
                          <i className="bi bi-star-fill"></i> {service.note}
                        </span>
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
                {reservationsRecentes.length === 0 ? (
                  <div className="empty-reservations">
                    <i className="bi bi-inbox"></i>
                    <p>Aucune réservation pour le moment</p>
                  </div>
                ) : (
                  reservationsRecentes.map((reservation) => (
                    <div key={reservation.id} className="reservation-item">
                      <div className="reservation-info">
                        <div className="reservation-service">{reservation.service}</div>
                        <div className="reservation-prestataire">
                          <i className="bi bi-person"></i> {reservation.prestataire}
                        </div>
                        <div className="reservation-date">
                          <i className="bi bi-calendar"></i> {formatDate(reservation.date)}
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

        {/* Section Notifications et Conseils */}
        <div className="dashboard-bottom-demandeur">
          {/* Notifications récentes */}
          <div className="notifications-card">
            <div className="card-header">
              <h3>
                <i className="bi bi-bell"></i>
                Notifications récentes
              </h3>
              <Link to="/demandeur/notifications" className="voir-tout">
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
                <div className="notifications-list">
                  {notificationsRecentes.map((notif) => (
                    <div key={notif.id} className="notification-item">
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

          {/* Conseils et Stats rapides */}
          <div className="right-sidebar">
            {/* Conseils */}
            <div className="tips-section">
              <div className="tips-card">
                <div className="tips-icon">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <div className="tips-content">
                  <h4>Conseil du jour</h4>
                  <p>N'oubliez pas de laisser un avis après chaque service. Votre retour aide la communauté !</p>
                </div>
              </div>
            </div>

            {/* Stats rapides */}
            <div className="quick-stats">
              <div className="quick-stat-item">
                <span className="qs-value">{statistiques?.totalReservations || 0}</span>
                <span className="qs-label">Réservations</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="qs-value">{statistiques?.servicesUtilises || 0}</span>
                <span className="qs-label">Services</span>
              </div>
              <div className="quick-stat-divider"></div>
              <div className="quick-stat-item">
                <span className="qs-value">{statistiques?.avisDonnes || 0}</span>
                <span className="qs-label">Avis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard-demandeur {
          animation: fadeIn 0.5s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* En-tête */
        .dashboard-header-demandeur {
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

        .btn-explorer {
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

        .btn-explorer:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(53, 77, 212, 0.4);
          color: white;
        }

        /* Cartes Statistiques */
        .stats-cards-demandeur {
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

        .stat-card-trend .bi-arrow-down {
          color: #ef4444;
        }

        /* Actions rapides */
        .quick-actions {
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
        .dashboard-grid-demandeur {
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
        .services-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .service-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .service-item:hover {
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

        .service-category {
          color: #64748b;
        }

        .service-price {
          color: #354dd4;
          font-weight: 600;
        }

        .service-rating {
          color: #f59e0b;
          display: flex;
          align-items: center;
          gap: 0.2rem;
        }

        .service-rating i {
          font-size: 0.6rem;
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
        .reservations-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .reservation-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .reservation-item:hover {
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

        .reservation-prestataire, .reservation-date {
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
        .dashboard-bottom-demandeur {
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

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
        }

        .notification-item:hover {
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

        /* Right Sidebar */
        .right-sidebar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        /* Conseils */
        .tips-section {
          flex: 1;
        }

        .tips-card {
          background: white;
          border-radius: 16px;
          padding: 1.25rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .tips-icon {
          width: 48px;
          height: 48px;
          background: #fef3c7;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .tips-icon i {
          font-size: 1.5rem;
          color: #f59e0b;
        }

        .tips-content {
          flex: 1;
        }

        .tips-content h4 {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .tips-content p {
          font-size: 0.8rem;
          color: #64748b;
          margin: 0;
          line-height: 1.5;
        }

        /* Quick Stats */
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
          .stats-cards-demandeur {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 992px) {
          .dashboard-grid-demandeur {
            grid-template-columns: 1fr;
          }
          
          .dashboard-bottom-demandeur {
            grid-template-columns: 1fr;
          }
          
          .quick-actions {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .dashboard-header-demandeur {
            flex-direction: column;
          }
          
          .dashboard-actions {
            width: 100%;
            justify-content: space-between;
          }
          
          .stats-cards-demandeur {
            grid-template-columns: 1fr 1fr;
          }
          
          .quick-actions {
            grid-template-columns: 1fr 1fr;
          }
          
          .reservation-item {
            flex-direction: column;
            text-align: center;
          }
          
          .reservation-right {
            text-align: center;
          }
          
          .tips-card {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 480px) {
          .stats-cards-demandeur {
            grid-template-columns: 1fr;
          }
          
          .quick-actions {
            grid-template-columns: 1fr;
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

export default DashboardDemandeur;