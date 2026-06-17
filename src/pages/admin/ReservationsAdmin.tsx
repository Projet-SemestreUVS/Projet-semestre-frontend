// src/pages/admin/ReservationsAdmin.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import api from "../../services/api";

interface Reservation {
  id: number;
  service_id: number;
  demandeur_id: number;
  prestataire_id: number;
  date_debut: string;
  date_fin?: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  message?: string | null;
  prix_total?: number;
  created_at: string;
  updated_at?: string;
  service?: {
    id: number;
    nom: string;
    titre?: string;
    prix: number;
    description?: string;
    image?: string;
  };
  demandeur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    avatar?: string;
  };
}

const ReservationsAdmin = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

// src/pages/admin/ReservationsAdmin.tsx - modifier la fonction fetchReservations

const fetchReservations = async () => {
    try {
        setLoading(true);
        setError(null);
        
        // Vérifier d'abord si l'utilisateur est admin
        const userStr = localStorage.getItem('user');
        let user = null;
        if (userStr) {
            try {
                user = JSON.parse(userStr);
            } catch (e) {
                console.error('Erreur parsing user:', e);
            }
        }
        
        // Si l'utilisateur n'est pas admin, essayer quand même
        // Le backend vérifiera
        const response = await api.get("/auth/reservations");
        console.log("Réservations reçues:", response.data);
        
        let reservationsData = [];
        if (response.data?.data) {
            reservationsData = response.data.data;
        } else if (Array.isArray(response.data)) {
            reservationsData = response.data;
        } else if (response.data?.reservations) {
            reservationsData = response.data.reservations;
        } else {
            reservationsData = [];
        }
        
        setReservations(reservationsData);
    } catch (err: any) {
        console.error("Erreur détaillée:", err);
        console.error("Response:", err.response);
        console.error("Status:", err.response?.status);
        console.error("Data:", err.response?.data);
        
        if (err.response?.status === 403) {
            // Vérifier le rôle depuis la réponse ou localStorage
            const userRole = user?.role || 'unknown';
            setError(
                `Accès non autorisé. Votre rôle est "${userRole}". ` +
                `Vous devez être administrateur pour accéder à cette page.`
            );
        } else if (err.response?.status === 401) {
            setError("Non authentifié. Veuillez vous reconnecter.");
            // Rediriger vers login
            setTimeout(() => {
                window.location.href = '/login';
            }, 2000);
        } else {
            setError(err.response?.data?.message || "Erreur lors du chargement des réservations");
        }
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

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "confirmee": return "bi-check-circle-fill";
      case "terminee": return "bi-check2-circle";
      case "annulee": return "bi-x-circle-fill";
      default: return "bi-clock-fill";
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

  const handleUpdateStatut = async (id: number, newStatut: string) => {
    try {
      setUpdating(true);
      // CORRECTION: Utiliser /auth/reservations
      await api.put(`/auth/reservations/${id}`, { statut: newStatut });
      
      setReservations(prev =>
        prev.map(r =>
          r.id === id ? { ...r, statut: newStatut as Reservation["statut"] } : r
        )
      );
      
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({ ...selectedReservation, statut: newStatut as Reservation["statut"] });
      }
      
      showNotification("Statut mis à jour avec succès", "success");
    } catch (err: any) {
      console.error("Erreur mise à jour:", err);
      showNotification(err.response?.data?.message || "Erreur lors de la mise à jour", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.")) return;
    
    try {
      // CORRECTION: Utiliser /auth/reservations
      await api.delete(`/auth/reservations/${id}`);
      setReservations(prev => prev.filter(r => r.id !== id));
      if (selectedReservation && selectedReservation.id === id) {
        setShowModal(false);
        setSelectedReservation(null);
      }
      showNotification("Réservation supprimée avec succès", "success");
    } catch (err: any) {
      console.error("Erreur suppression:", err);
      showNotification(err.response?.data?.message || "Erreur lors de la suppression", "error");
    }
  };

  const showNotification = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Date non définie";
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(price);
  };

  const filteredReservations = reservations.filter(res => {
    const matchesStatut = selectedStatut === "tous" || res.statut === selectedStatut;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (res.service?.nom || res.service?.titre || "")?.toLowerCase().includes(searchLower) ||
      `${res.demandeur?.prenom || ""} ${res.demandeur?.nom || ""}`.toLowerCase().includes(searchLower) ||
      `${res.prestataire?.prenom || ""} ${res.prestataire?.nom || ""}`.toLowerCase().includes(searchLower) ||
      res.id.toString().includes(searchLower);
    return matchesStatut && matchesSearch;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredReservations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredReservations.length / itemsPerPage);

  const stats = {
    total: reservations.length,
    en_attente: reservations.filter(r => r.statut === "en_attente").length,
    confirmees: reservations.filter(r => r.statut === "confirmee").length,
    terminees: reservations.filter(r => r.statut === "terminee").length,
    annulees: reservations.filter(r => r.statut === "annulee").length,
    revenus_total: reservations.reduce((sum, r) => {
      if (r.statut === "confirmee" || r.statut === "terminee") {
        return sum + (r.service?.prix || r.prix_total || 0);
      }
      return sum;
    }, 0)
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebar={<AdminSidebar />}>
        <div className="error-container">
          <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: "3rem", color: "#ef4444" }}></i>
          <h3>Erreur de chargement</h3>
          <p>{error}</p>
          <button onClick={fetchReservations} className="retry-btn">
            <i className="bi bi-arrow-repeat"></i> Réessayer
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<AdminSidebar />}>
      <div className="reservations-manager">
        {/* Notification */}
        {notification && (
          <div className={`notification notification-${notification.type}`}>
            <i className={`bi bi-${notification.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}`}></i>
            <span>{notification.message}</span>
          </div>
        )}

        <div className="page-header">
          <h1>
            <i className="bi bi-calendar-check"></i>
            Gestion des réservations
          </h1>
          <p>Consultez et gérez toutes les réservations de la plateforme</p>
        </div>

        {/* Statistiques */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"><i className="bi bi-calendar-week"></i></div>
            <div className="stat-info">
              <h3>{stats.total}</h3>
              <p>Total réservations</p>
            </div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-icon"><i className="bi bi-clock-history"></i></div>
            <div className="stat-info">
              <h3>{stats.en_attente}</h3>
              <p>En attente</p>
            </div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-icon"><i className="bi bi-check-circle"></i></div>
            <div className="stat-info">
              <h3>{stats.confirmees}</h3>
              <p>Confirmées</p>
            </div>
          </div>
          <div className="stat-card stat-info">
            <div className="stat-icon"><i className="bi bi-check2-circle"></i></div>
            <div className="stat-info">
              <h3>{stats.terminees}</h3>
              <p>Terminées</p>
            </div>
          </div>
          <div className="stat-card stat-danger">
            <div className="stat-icon"><i className="bi bi-x-circle"></i></div>
            <div className="stat-info">
              <h3>{stats.annulees}</h3>
              <p>Annulées</p>
            </div>
          </div>
          <div className="stat-card stat-primary">
            <div className="stat-icon"><i className="bi bi-currency-franc"></i></div>
            <div className="stat-info">
              <h3>{formatPrice(stats.revenus_total)}</h3>
              <p>Revenus totaux</p>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="filters-bar">
          <div className="search-wrapper">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Rechercher par ID, service, demandeur ou prestataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="clear-search" onClick={() => setSearchTerm("")}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>
          <div className="status-filters">
            {["tous", "en_attente", "confirmee", "terminee", "annulee"].map(status => (
              <button
                key={status}
                className={`status-filter-btn ${selectedStatut === status ? "active" : ""}`}
                onClick={() => setSelectedStatut(status)}
              >
                {status === "tous" ? "Tous" : getStatutTexte(status)}
                <span className="count">
                  {status === "tous" ? stats.total : stats[status as keyof typeof stats]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tableau */}
        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <h3>Aucune réservation trouvée</h3>
            <p>Aucune réservation ne correspond à vos critères</p>
            {(searchTerm || selectedStatut !== "tous") && (
              <button 
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedStatut("tous");
                }}
              >
                <i className="bi bi-arrow-counterclockwise"></i>
                Réinitialiser les filtres
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="table-wrapper">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Service</th>
                    <th>Demandeur</th>
                    <th>Prestataire</th>
                    <th>Date</th>
                    <th>Montant</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((reservation) => (
                    <tr key={reservation.id}>
                      <td className="reservation-id">#{reservation.id}</td>
                      <td>
                        <div className="service-info">
                          {reservation.service?.image && (
                            <img src={reservation.service.image} alt="" className="service-thumb" />
                          )}
                          <span>{reservation.service?.nom || "-"}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-info">
                          {reservation.demandeur?.avatar && (
                            <img src={reservation.demandeur.avatar} alt="" className="user-avatar" />
                          )}
                          <div>
                            <div className="user-name">
                              {reservation.demandeur?.prenom} {reservation.demandeur?.nom}
                            </div>
                            <div className="user-contact">{reservation.demandeur?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="user-info">
                          {reservation.prestataire?.avatar && (
                            <img src={reservation.prestataire.avatar} alt="" className="user-avatar" />
                          )}
                          <div>
                            <div className="user-name">
                              {reservation.prestataire?.prenom} {reservation.prestataire?.nom}
                            </div>
                            <div className="user-contact">{reservation.prestataire?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>{formatDate(reservation.date_debut)}</td>
                      <td className="price">{formatPrice(reservation.service?.prix || 0)}</td>
                      <td>
                        <span className={`status-badge ${getStatutClass(reservation.statut)}`}>
                          <i className={getStatutIcon(reservation.statut)}></i>
                          {getStatutTexte(reservation.statut)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view-btn"
                            onClick={() => {
                              setSelectedReservation(reservation);
                              setShowModal(true);
                            }}
                            title="Voir détails"
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="action-btn delete-btn"
                            onClick={() => handleDelete(reservation.id)}
                            title="Supprimer"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <div className="pagination-pages">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`pagination-page ${currentPage === pageNum ? "active" : ""}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}

        {/* Modal Détails */}
        {showModal && selectedReservation && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>
                  <i className="bi bi-calendar-check"></i>
                  Détails de la réservation #{selectedReservation.id}
                </h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-group">
                    <label><i className="bi bi-briefcase"></i> Service</label>
                    <p className="detail-value">{selectedReservation.service?.nom || "-"}</p>
                  </div>
                  <div className="detail-group">
                    <label><i className="bi bi-currency-franc"></i> Prix</label>
                    <p className="detail-value price">{formatPrice(selectedReservation.service?.prix || 0)}</p>
                  </div>
                  <div className="detail-group">
                    <label><i className="bi bi-person"></i> Demandeur</label>
                    <div className="detail-person">
                      <div className="person-name">
                        {selectedReservation.demandeur?.prenom} {selectedReservation.demandeur?.nom}
                      </div>
                      <div className="person-contact">
                        <i className="bi bi-envelope"></i> {selectedReservation.demandeur?.email}
                      </div>
                      <div className="person-contact">
                        <i className="bi bi-telephone"></i> {selectedReservation.demandeur?.telephone || "Non renseigné"}
                      </div>
                    </div>
                  </div>
                  <div className="detail-group">
                    <label><i className="bi bi-person-badge"></i> Prestataire</label>
                    <div className="detail-person">
                      <div className="person-name">
                        {selectedReservation.prestataire?.prenom} {selectedReservation.prestataire?.nom}
                      </div>
                      <div className="person-contact">
                        <i className="bi bi-envelope"></i> {selectedReservation.prestataire?.email}
                      </div>
                      <div className="person-contact">
                        <i className="bi bi-telephone"></i> {selectedReservation.prestataire?.telephone || "Non renseigné"}
                      </div>
                    </div>
                  </div>
                  <div className="detail-group">
                    <label><i className="bi bi-calendar-event"></i> Date de début</label>
                    <p className="detail-value">{formatDate(selectedReservation.date_debut)}</p>
                  </div>
                  {selectedReservation.date_fin && (
                    <div className="detail-group">
                      <label><i className="bi bi-calendar-event"></i> Date de fin</label>
                      <p className="detail-value">{formatDate(selectedReservation.date_fin)}</p>
                    </div>
                  )}
                  <div className="detail-group">
                    <label><i className="bi bi-tag"></i> Statut actuel</label>
                    <select 
                      value={selectedReservation.statut}
                      onChange={(e) => handleUpdateStatut(selectedReservation.id, e.target.value)}
                      disabled={updating}
                      className="status-select"
                    >
                      <option value="en_attente">📋 En attente</option>
                      <option value="confirmee">✅ Confirmée</option>
                      <option value="terminee">🏁 Terminée</option>
                      <option value="annulee">❌ Annulée</option>
                    </select>
                    {updating && <span className="updating-spinner"><i className="bi bi-arrow-repeat spin"></i> Mise à jour...</span>}
                  </div>
                  {(selectedReservation.commentaire || selectedReservation.message) && (
                    <div className="detail-group full-width">
                      <label><i className="bi bi-chat"></i> Commentaire</label>
                      <div className="commentaire-text">
                        <i className="bi bi-quote"></i>
                        {selectedReservation.commentaire || selectedReservation.message}
                      </div>
                    </div>
                  )}
                  <div className="detail-group">
                    <label><i className="bi bi-clock"></i> Date de création</label>
                    <p className="detail-value">{new Date(selectedReservation.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                  {selectedReservation.updated_at && (
                    <div className="detail-group">
                      <label><i className="bi bi-pencil"></i> Dernière modification</label>
                      <p className="detail-value">{new Date(selectedReservation.updated_at).toLocaleString('fr-FR')}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i> Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reservations-manager {
          padding: 2rem;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          min-height: 100vh;
          position: relative;
        }

        /* Notification */
        .notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          z-index: 10000;
          animation: slideIn 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
          font-weight: 500;
        }

        .notification-success {
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
        }

        .notification-error {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Loading */
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
          border: 3px solid #e2e8f0;
          border-top-color: #354dd4;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Error */
        .error-container {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
          margin: 2rem;
        }

        .retry-btn {
          margin-top: 1rem;
          padding: 0.75rem 1.5rem;
          background: #354dd4;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Header */
        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .page-header p {
          color: #64748b;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .stat-icon {
          width: 52px;
          height: 52px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .stat-card:not(.stat-warning):not(.stat-success):not(.stat-info):not(.stat-danger):not(.stat-primary) .stat-icon {
          background: #eef2ff;
          color: #354dd4;
        }

        .stat-warning .stat-icon {
          background: #fef3c7;
          color: #d97706;
        }

        .stat-success .stat-icon {
          background: #dcfce7;
          color: #10b981;
        }

        .stat-info .stat-icon {
          background: #dbeafe;
          color: #3b82f6;
        }

        .stat-danger .stat-icon {
          background: #fee2e2;
          color: #ef4444;
        }

        .stat-primary .stat-icon {
          background: linear-gradient(135deg, #354dd4, #1e40af);
          color: white;
        }

        .stat-info h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
          color: #1e293b;
        }

        .stat-info p {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
        }

        /* Filters */
        .filters-bar {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .search-wrapper {
          flex: 1;
          position: relative;
        }

        .search-wrapper i {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
        }

        .search-wrapper input {
          width: 100%;
          padding: 0.75rem 2.5rem 0.75rem 2.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .search-wrapper input:focus {
          outline: none;
          border-color: #354dd4;
          box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1);
        }

        .clear-search {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
        }

        .status-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .status-filter-btn {
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .status-filter-btn:hover {
          border-color: #354dd4;
          color: #354dd4;
        }

        .status-filter-btn.active {
          background: #354dd4;
          color: white;
          border-color: #354dd4;
        }

        .status-filter-btn .count {
          background: rgba(0,0,0,0.1);
          padding: 0.125rem 0.5rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 600;
        }

        .status-filter-btn.active .count {
          background: rgba(255,255,255,0.2);
        }

        /* Table */
        .table-wrapper {
          background: white;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .reservations-table {
          width: 100%;
          border-collapse: collapse;
        }

        .reservations-table th,
        .reservations-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .reservations-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #475569;
          font-size: 0.875rem;
        }

        .reservations-table tbody tr:hover {
          background: #f8fafc;
        }

        .reservation-id {
          font-weight: 600;
          color: #354dd4;
        }

        .service-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .service-thumb {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          object-fit: cover;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-name {
          font-weight: 500;
          color: #1e293b;
        }

        .user-contact {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .price {
          font-weight: 600;
          color: #10b981;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .statut-confirmee {
          background: #dcfce7;
          color: #166534;
        }

        .statut-terminee {
          background: #dbeafe;
          color: #1e40af;
        }

        .statut-annulee {
          background: #fee2e2;
          color: #991b1b;
        }

        .statut-attente {
          background: #fef3c7;
          color: #92400e;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          width: 34px;
          height: 34px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .view-btn {
          background: #eef2ff;
          color: #354dd4;
        }

        .view-btn:hover {
          background: #354dd4;
          color: white;
          transform: scale(1.05);
        }

        .delete-btn {
          background: #fee2e2;
          color: #ef4444;
        }

        .delete-btn:hover {
          background: #ef4444;
          color: white;
          transform: scale(1.05);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 4rem;
          background: white;
          border-radius: 16px;
        }

        .empty-state i {
          font-size: 4rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          margin-bottom: 0.5rem;
          color: #1e293b;
        }

        .empty-state p {
          color: #64748b;
        }

        .reset-filters-btn {
          margin-top: 1.5rem;
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Pagination */
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1.5rem;
        }

        .pagination-btn {
          padding: 0.5rem 1rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-btn:hover:not(:disabled) {
          background: #354dd4;
          color: white;
          border-color: #354dd4;
        }

        .pagination-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-pages {
          display: flex;
          gap: 0.25rem;
        }

        .pagination-page {
          width: 36px;
          height: 36px;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .pagination-page:hover {
          border-color: #354dd4;
          color: #354dd4;
        }

        .pagination-page.active {
          background: #354dd4;
          color: white;
          border-color: #354dd4;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-content {
          background: white;
          border-radius: 24px;
          width: 90%;
          max-width: 800px;
          max-height: 85vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          position: sticky;
          top: 0;
          background: white;
          z-index: 1;
        }

        .modal-header h3 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #94a3b8;
          transition: color 0.2s;
        }

        .modal-close:hover {
          color: #ef4444;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .modal-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          justify-content: flex-end;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .detail-group.full-width {
          grid-column: span 2;
        }

        .detail-group label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-value {
          font-size: 0.95rem;
          color: #1e293b;
          margin: 0;
        }

        .detail-value.price {
          font-size: 1.25rem;
          font-weight: 700;
          color: #10b981;
        }

        .detail-person {
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 12px;
        }

        .person-name {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 0.25rem;
        }

        .person-contact {
          font-size: 0.75rem;
          color: #64748b;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.25rem;
        }

        .status-select {
          padding: 0.6rem;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
        }

        .status-select:focus {
          outline: none;
          border-color: #354dd4;
        }

        .updating-spinner {
          font-size: 0.7rem;
          color: #354dd4;
          margin-top: 0.25rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .spin {
          animation: spin 1s linear infinite;
        }

        .commentaire-text {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          font-style: italic;
          color: #475569;
          display: flex;
          gap: 0.5rem;
        }

        .commentaire-text i {
          color: #94a3b8;
        }

        .btn-secondary {
          padding: 0.6rem 1.5rem;
          background: #f1f5f9;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: #e2e8f0;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .reservations-manager {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .filters-bar {
            flex-direction: column;
          }

          .status-filters {
            justify-content: center;
          }

          .details-grid {
            grid-template-columns: 1fr;
          }

          .detail-group.full-width {
            grid-column: span 1;
          }

          .modal-content {
            width: 95%;
            max-height: 90vh;
          }

          .reservations-table th,
          .reservations-table td {
            padding: 0.75rem;
            font-size: 0.8rem;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ReservationsAdmin;