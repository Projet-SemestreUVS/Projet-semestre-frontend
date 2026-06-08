// src/pages/demandeur/Notifications.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Notification {
  id: number;
  user_id: number;
  type: "reservation" | "message" | "avis" | "systeme" | "paiement";
  contenu: string;
  lu: boolean;
  created_at: string;
  lien?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("toutes");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  useEffect(() => {
    fetchNotifications();
    
    // Rafraîchir les notifications toutes les 30 secondes
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notifications");
      console.log("Notifications reçues:", response.data);
      
      let notificationsData = [];
      if (response.data.data) {
        notificationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        notificationsData = response.data;
      } else if (response.data.notifications) {
        notificationsData = response.data.notifications;
      }
      
      setNotifications(notificationsData);
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement des notifications");
    } finally {
      setLoading(false);
    }
  };

  const marquerCommeLue = async (id: number) => {
    try {
      await api.patch(`/notifications/${id}`, { lu: true });
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === id ? { ...notif, lu: true } : notif
        )
      );
    } catch (err: any) {
      console.error("Erreur:", err);
    }
  };

  const marquerToutesCommeLues = async () => {
    try {
      await api.post("/notifications/mark-all-read");
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, lu: true }))
      );
    } catch (err: any) {
      console.error("Erreur:", err);
    }
  };

  const supprimerNotification = async (id: number) => {
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notif => notif.id !== id));
    } catch (err: any) {
      console.error("Erreur:", err);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reservation":
        return <i className="bi bi-calendar-check" style={{ color: "#354dd4" }}></i>;
      case "message":
        return <i className="bi bi-chat-dots" style={{ color: "#22c55e" }}></i>;
      case "avis":
        return <i className="bi bi-star" style={{ color: "#f59e0b" }}></i>;
      case "paiement":
        return <i className="bi bi-credit-card" style={{ color: "#06b6d4" }}></i>;
      default:
        return <i className="bi bi-bell" style={{ color: "#8b5cf6" }}></i>;
    }
  };

  const getNotificationTypeText = (type: string) => {
    switch (type) {
      case "reservation": return "Réservation";
      case "message": return "Message";
      case "avis": return "Avis";
      case "paiement": return "Paiement";
      default: return "Système";
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

  const getNotificationBackground = (notification: Notification) => {
    if (!notification.lu) return "#f0f4ff";
    return "white";
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === "non_lues") return !notif.lu;
    if (filter === "type_reservation") return notif.type === "reservation";
    if (filter === "type_message") return notif.type === "message";
    if (filter === "type_avis") return notif.type === "avis";
    if (filter === "type_systeme") return notif.type === "systeme";
    return true;
  });

  const stats = {
    total: notifications.length,
    nonLues: notifications.filter(n => !n.lu).length,
    reservations: notifications.filter(n => n.type === "reservation").length,
    messages: notifications.filter(n => n.type === "message").length,
    avis: notifications.filter(n => n.type === "avis").length,
  };

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

  if (error) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="error-container">
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "3rem", color: "#ef4444" }}></i>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button onClick={fetchNotifications} className="retry-btn">
            <i className="bi bi-arrow-repeat"></i> Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="dashboard-demandeur">
        {/* En-tête */}
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
            <i className="bi bi-calendar"></i>
            <div>
              <span className="stat-number">{stats.reservations}</span>
              <span className="stat-label">Réservations</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <i className="bi bi-chat"></i>
            <div>
              <span className="stat-number">{stats.messages}</span>
              <span className="stat-label">Messages</span>
            </div>
          </div>
        </div>

        {/* Actions */}
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
              className={`filter-btn ${filter === "type_reservation" ? "active" : ""}`}
              onClick={() => setFilter("type_reservation")}
            >
              Réservations
            </button>
            <button 
              className={`filter-btn ${filter === "type_message" ? "active" : ""}`}
              onClick={() => setFilter("type_message")}
            >
              Messages
            </button>
            <button 
              className={`filter-btn ${filter === "type_avis" ? "active" : ""}`}
              onClick={() => setFilter("type_avis")}
            >
              Avis
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
            {filteredNotifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`notification-item ${!notification.lu ? "unread" : ""}`}
                style={{ backgroundColor: getNotificationBackground(notification) }}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <div className="notification-header">
                    <span className="notification-type">
                      {getNotificationTypeText(notification.type)}
                    </span>
                    <span className="notification-date">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  <div className="notification-message">
                    {notification.contenu}
                  </div>
                </div>
                <div className="notification-actions">
                  {!notification.lu && (
                    <button 
                      className="mark-read-btn"
                      onClick={() => marquerCommeLue(notification.id)}
                      title="Marquer comme lu"
                    >
                      <i className="bi bi-envelope-open"></i>
                    </button>
                  )}
                  <button 
                    className="delete-btn"
                    onClick={() => supprimerNotification(notification.id)}
                    title="Supprimer"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal détails notification */}
        {selectedNotification && (
          <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Détails de la notification</h3>
                <button className="modal-close" onClick={() => setSelectedNotification(null)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-icon">
                  {getNotificationIcon(selectedNotification.type)}
                </div>
                <div className="detail-type">
                  Type: {getNotificationTypeText(selectedNotification.type)}
                </div>
                <div className="detail-date">
                  Date: {new Date(selectedNotification.created_at).toLocaleString('fr-FR')}
                </div>
                <div className="detail-message">
                  {selectedNotification.contenu}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setSelectedNotification(null)}>
                  Fermer
                </button>
                {!selectedNotification.lu && (
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      marquerCommeLue(selectedNotification.id);
                      setSelectedNotification(null);
                    }}
                  >
                    Marquer comme lu
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .notifications-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
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
          border-radius: 10px;
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
        }

        .notification-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-radius: 16px;
          transition: all 0.3s ease;
          border: 1px solid #e2e8f0;
          background: white;
        }

        .notification-item.unread {
          border-left: 4px solid #354dd4;
        }

        .notification-item:hover {
          transform: translateX(5px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .notification-icon {
          width: 45px;
          height: 45px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notification-icon i {
          font-size: 1.5rem;
        }

        .notification-content {
          flex: 1;
        }

        .notification-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .notification-type {
          font-size: 0.75rem;
          font-weight: 600;
          color: #354dd4;
          background: #eef2ff;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
        }

        .notification-date {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .notification-message {
          font-size: 0.875rem;
          color: #1e293b;
          line-height: 1.4;
        }

        .notification-actions {
          display: flex;
          gap: 0.5rem;
        }

        .mark-read-btn,
        .delete-btn {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
        }

        .mark-read-btn {
          background: #eef2ff;
          color: #354dd4;
        }

        .mark-read-btn:hover {
          background: #354dd4;
          color: white;
        }

        .delete-btn {
          background: #fee2e2;
          color: #ef4444;
        }

        .delete-btn:hover {
          background: #ef4444;
          color: white;
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

        /* Modal */
        .detail-icon {
          text-align: center;
          margin-bottom: 1rem;
        }

        .detail-icon i {
          font-size: 3rem;
        }

        .detail-type,
        .detail-date {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
          text-align: center;
        }

        .detail-message {
          font-size: 1rem;
          color: #1e293b;
          text-align: center;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .notification-item {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .notification-actions {
            align-self: flex-end;
          }
          
          .notifications-actions {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-buttons {
            justify-content: center;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default Notifications;