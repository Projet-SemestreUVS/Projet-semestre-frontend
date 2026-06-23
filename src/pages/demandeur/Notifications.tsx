// src/pages/demandeur/Notifications.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import "../../styles/dashboard.css";

interface Notification {
  id: number;
  type: "reservation" | "avis" | "message" | "systeme" | "paiement";
  titre: string;
  contenu: string;
  lu: boolean;
  date: string;
  service_id?: number;
  service_nom?: string;
  lien?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("toutes");
  const [stats, setStats] = useState({ total: 0, nonLues: 0 });

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    
    let allNotifications: Notification[] = [];
    
    // 1. Récupérer les notifications des avis (depuis demandeur_avis)
    const storedAvis = localStorage.getItem("demandeur_avis");
    if (storedAvis) {
      const avisList = JSON.parse(storedAvis);
      const avisNotifications = avisList.map((avis: any) => ({
        id: Date.now() + avis.id,
        type: "avis" as const,
        titre: "Avis publié",
        contenu: `Vous avez publié un avis pour "${avis.service_nom}" avec une note de ${avis.note}/5`,
        lu: false,
        date: avis.date || new Date().toISOString(),
        service_id: avis.service_id,
        service_nom: avis.service_nom,
        lien: "/demandeur/avis"
      }));
      allNotifications = [...allNotifications, ...avisNotifications];
    }
    
    // 2. Récupérer les notifications des réservations
    const storedReservations = localStorage.getItem("reservations");
    if (storedReservations) {
      const reservations = JSON.parse(storedReservations);
      const reservationNotifications = reservations.map((r: any) => ({
        id: Date.now() + r.id + 1000,
        type: "reservation" as const,
        titre: r.statut === "en_attente" ? "Réservation en attente" :
                r.statut === "confirmee" ? "Réservation confirmée" :
                r.statut === "terminee" ? "Réservation terminée" :
                "Réservation annulée",
        contenu: `Votre réservation pour "${r.service_nom}" est ${r.statut === "en_attente" ? "en attente de confirmation" : 
                  r.statut === "confirmee" ? "confirmée" : 
                  r.statut === "terminee" ? "terminée" : "annulée"}`,
        lu: false,
        date: r.created_at || new Date().toISOString(),
        service_id: r.service_id,
        service_nom: r.service_nom,
        lien: "/demandeur/reservations"
      }));
      allNotifications = [...allNotifications, ...reservationNotifications];
    }
    
    // 3. Notifications système par défaut
    const defaultNotifications: Notification[] = [
      {
        id: Date.now() + 1,
        type: "systeme",
        titre: "Bienvenue sur KAY JOB",
        contenu: "Découvrez nos services et trouvez le prestataire idéal",
        lu: false,
        date: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: Date.now() + 2,
        type: "message",
        titre: "Nouveau message",
        contenu: "Vous avez un nouveau message de Alpha Tech",
        lu: true,
        date: new Date(Date.now() - 7200000).toISOString(),
      },
      {
        id: Date.now() + 3,
        type: "paiement",
        titre: "Paiement sécurisé",
        contenu: "Votre paiement a été sécurisé avec succès",
        lu: true,
        date: new Date(Date.now() - 86400000).toISOString(),
      }
    ];
    
    // Si aucune notification, ajouter les notifications par défaut
    if (allNotifications.length === 0) {
      allNotifications = defaultNotifications;
    }
    
    // Trier par date (les plus récentes en premier)
    allNotifications.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    // Supprimer les doublons (même type et même service)
    const uniqueNotifications = allNotifications.filter((notif, index, self) => 
      index === self.findIndex((n) => 
        n.type === notif.type && 
        n.service_id === notif.service_id && 
        n.titre === notif.titre
      )
    );
    
    setNotifications(uniqueNotifications);
    updateStats(uniqueNotifications);
    setLoading(false);
  };

  const updateStats = (notifs: Notification[]) => {
    setStats({
      total: notifs.length,
      nonLues: notifs.filter(n => !n.lu).length
    });
  };

  const marquerCommeLue = (id: number) => {
    const updatedNotifs = notifications.map(notif =>
      notif.id === id ? { ...notif, lu: true } : notif
    );
    setNotifications(updatedNotifs);
    updateStats(updatedNotifs);
  };

  const marquerToutesCommeLues = () => {
    const updatedNotifs = notifications.map(notif => ({ ...notif, lu: true }));
    setNotifications(updatedNotifs);
    updateStats(updatedNotifs);
  };

  const supprimerNotification = (id: number) => {
    const updatedNotifs = notifications.filter(notif => notif.id !== id);
    setNotifications(updatedNotifs);
    updateStats(updatedNotifs);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return <i className="bi bi-calendar-check" style={{ color: "#354dd4" }}></i>;
      case "avis":
        return <i className="bi bi-star" style={{ color: "#f59e0b" }}></i>;
      case "message":
        return <i className="bi bi-chat-dots" style={{ color: "#22c55e" }}></i>;
      case "paiement":
        return <i className="bi bi-credit-card" style={{ color: "#06b6d4" }}></i>;
      default:
        return <i className="bi bi-bell" style={{ color: "#8b5cf6" }}></i>;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "reservation":
        return { label: "Réservation", class: "badge-reservation" };
      case "avis":
        return { label: "Avis", class: "badge-avis" };
      case "message":
        return { label: "Message", class: "badge-message" };
      case "paiement":
        return { label: "Paiement", class: "badge-paiement" };
      default:
        return { label: "Système", class: "badge-systeme" };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "À l'instant";
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours} h`;
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return date.toLocaleDateString('fr-FR');
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "toutes") return true;
    if (filter === "non_lues") return !notif.lu;
    return notif.type === filter;
  });

  if (loading) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des notifications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="notifications-page">
        <div className="page-header">
          <h1>
            <i className="bi bi-bell"></i>
            Notifications
          </h1>
          <p>Restez informé de vos activités</p>
        </div>

        {/* Statistiques */}
        <div className="notifications-stats">
          <div className="stat-card-mini">
            <i className="bi bi-envelope"></i>
            <div>
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <i className="bi bi-envelope-open"></i>
            <div>
              <span className="stat-number">{stats.nonLues}</span>
              <span className="stat-label">Non lues</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <i className="bi bi-star"></i>
            <div>
              <span className="stat-number">
                {notifications.filter(n => n.type === "avis").length}
              </span>
              <span className="stat-label">Avis</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <i className="bi bi-calendar"></i>
            <div>
              <span className="stat-number">
                {notifications.filter(n => n.type === "reservation").length}
              </span>
              <span className="stat-label">Réservations</span>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="notifications-actions">
          <div className="filter-buttons">
            <button 
              className={`filter-btn ${filter === "toutes" ? "active" : ""}`}
              onClick={() => setFilter("toutes")}
            >
              Toutes ({stats.total})
            </button>
            <button 
              className={`filter-btn ${filter === "non_lues" ? "active" : ""}`}
              onClick={() => setFilter("non_lues")}
            >
              Non lues ({stats.nonLues})
            </button>
            <button 
              className={`filter-btn ${filter === "reservation" ? "active" : ""}`}
              onClick={() => setFilter("reservation")}
            >
              Réservations
            </button>
            <button 
              className={`filter-btn ${filter === "avis" ? "active" : ""}`}
              onClick={() => setFilter("avis")}
            >
              Avis
            </button>
            <button 
              className={`filter-btn ${filter === "message" ? "active" : ""}`}
              onClick={() => setFilter("message")}
            >
              Messages
            </button>
          </div>
          {stats.nonLues > 0 && (
            <button className="mark-all-btn" onClick={marquerToutesCommeLues}>
              <i className="bi bi-check2-all"></i>
              Tout marquer comme lu
            </button>
          )}
        </div>

        {/* Liste des notifications */}
        {filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <i className="bi bi-bell-slash"></i>
            <h3>Aucune notification</h3>
            <p>Vous n'avez pas encore de notifications</p>
          </div>
        ) : (
          <div className="notifications-list">
            {filteredNotifications.map((notification) => {
              const badge = getNotificationBadge(notification.type);
              return (
                <div 
                  key={notification.id} 
                  className={`notification-item ${!notification.lu ? "unread" : ""}`}
                  onClick={() => !notification.lu && marquerCommeLue(notification.id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <div className="notification-title-section">
                        <span className="notification-title">{notification.titre}</span>
                        <span className={`notification-badge ${badge.class}`}>
                          {badge.label}
                        </span>
                      </div>
                      <span className="notification-date">{formatDate(notification.date)}</span>
                    </div>
                    <div className="notification-message">
                      {notification.contenu}
                    </div>
                    {notification.service_nom && (
                      <div className="notification-service">
                        <i className="bi bi-tools"></i>
                        {notification.service_nom}
                      </div>
                    )}
                    {notification.lien && (
                      <Link to={notification.lien} className="notification-link">
                        Voir détails <i className="bi bi-arrow-right"></i>
                      </Link>
                    )}
                  </div>
                  <button 
                    className="delete-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      supprimerNotification(notification.id);
                    }}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Bouton pour rafraîchir */}
        <div className="notifications-footer">
          <button className="refresh-btn" onClick={loadNotifications}>
            <i className="bi bi-arrow-clockwise"></i>
            Rafraîchir
          </button>
        </div>
      </div>

      <style>{`
        .notifications-page {
          animation: fadeIn 0.3s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .notifications-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card-mini {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .stat-card-mini i {
          font-size: 1.75rem;
          color: #354dd4;
        }

        .stat-number {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .notifications-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .filter-btn:hover {
          border-color: #354dd4;
          color: #354dd4;
        }

        .filter-btn.active {
          background: #354dd4;
          color: white;
          border-color: #354dd4;
        }

        .mark-all-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .mark-all-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .notification-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: white;
          border-radius: 16px;
          transition: all 0.3s ease;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .notification-item.unread {
          background: #eef2ff;
          border-left: 4px solid #354dd4;
        }

        .notification-item:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .notification-icon {
          width: 45px;
          height: 45px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notification-icon i {
          font-size: 1.5rem;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .notification-title-section {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .notification-title {
          font-weight: 600;
          color: #1e293b;
          font-size: 0.9rem;
        }

        .notification-badge {
          font-size: 0.6rem;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-weight: 500;
        }

        .badge-reservation { background: #eef2ff; color: #354dd4; }
        .badge-avis { background: #fef3c7; color: #d97706; }
        .badge-message { background: #dcfce7; color: #22c55e; }
        .badge-paiement { background: #ccfbf1; color: #14b8a6; }
        .badge-systeme { background: #f3e8ff; color: #a855f7; }

        .notification-date {
          font-size: 0.7rem;
          color: #94a3b8;
          white-space: nowrap;
        }

        .notification-message {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          line-height: 1.5;
        }

        .notification-service {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #354dd4;
          background: #eef2ff;
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
        }

        .notification-link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.7rem;
          color: #354dd4;
          text-decoration: none;
          margin-top: 0.25rem;
          transition: gap 0.3s ease;
        }

        .notification-link:hover {
          gap: 0.5rem;
        }

        .delete-notification {
          background: none;
          border: none;
          color: #cbd5e1;
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.3s ease;
          flex-shrink: 0;
        }

        .delete-notification:hover {
          color: #ef4444;
        }

        .empty-notifications {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
        }

        .empty-notifications i {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .empty-notifications h3 {
          font-size: 1.125rem;
          color: #1e293b;
          margin-bottom: 0.5rem;
        }

        .notifications-footer {
          display: flex;
          justify-content: center;
        }

        .refresh-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          color: #64748b;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .refresh-btn:hover {
          background: #e2e8f0;
          color: #1e293b;
        }

        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 400px;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e2e8f0;
          border-top-color: #354dd4;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .notifications-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-buttons {
            justify-content: center;
          }
          
          .notification-item {
            flex-direction: column;
            padding: 1rem;
          }
          
          .notification-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .notification-date {
            align-self: flex-start;
          }
        }

        @media (max-width: 480px) {
          .notifications-stats {
            grid-template-columns: 1fr 1fr;
          }
          
          .stat-card-mini {
            padding: 0.75rem;
          }
          
          .stat-number {
            font-size: 1rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Notifications;