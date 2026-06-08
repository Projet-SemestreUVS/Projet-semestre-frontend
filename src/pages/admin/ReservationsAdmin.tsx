// src/pages/admin/ReservationsAdmin.tsx
import { useState, useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import AdminSidebar from "../../components/dashboard/AdminSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Reservation {
  id: number;
  service_id: number;
  demandeur_id: number;
  prestataire_id: number;
  date_debut: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  created_at: string;
  service?: {
    id: number;
    nom: string;
    prix: number;
  };
  demandeur?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
  };
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
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

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reservations");
      console.log("Réservations reçues:", response.data);
      
      let reservationsData = [];
      if (response.data.data) {
        reservationsData = response.data.data;
      } else if (Array.isArray(response.data)) {
        reservationsData = response.data;
      } else if (response.data.reservations) {
        reservationsData = response.data.reservations;
      }
      
      setReservations(reservationsData);
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement des réservations");
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

  const handleUpdateStatut = async (id: number, newStatut: string) => {
    try {
      setUpdating(true);
      await api.patch(`/reservations/${id}`, { statut: newStatut });
      
      setReservations(prev =>
        prev.map(r =>
          r.id === id ? { ...r, statut: newStatut as any } : r
        )
      );
      
      if (selectedReservation && selectedReservation.id === id) {
        setSelectedReservation({ ...selectedReservation, statut: newStatut as any });
      }
      
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de la mise à jour");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) return;
    
    try {
      await api.delete(`/reservations/${id}`);
      setReservations(prev => prev.filter(r => r.id !== id));
      if (selectedReservation && selectedReservation.id === id) {
        setShowModal(false);
        setSelectedReservation(null);
      }
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReservations = reservations.filter(res => {
    const matchesStatut = selectedStatut === "tous" || res.statut === selectedStatut;
    const matchesSearch = 
      res.service?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.demandeur?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.demandeur?.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.prestataire?.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.prestataire?.nom?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatut && matchesSearch;
  });

  const stats = {
    total: reservations.length,
    en_attente: reservations.filter(r => r.statut === "en_attente").length,
    confirmees: reservations.filter(r => r.statut === "confirmee").length,
    terminees: reservations.filter(r => r.statut === "terminee").length,
    annulees: reservations.filter(r => r.statut === "annulee").length,
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
      <div className="dashboard-admin">
        <div className="page-header">
          <h1>
            <i className="bi bi-calendar-check"></i>
            Gestion des réservations
          </h1>
          <p>Consultez et gérez toutes les réservations de la plateforme</p>
        </div>

        {/* Statistiques */}
        <div className="stats-cards-admin">
          <div className="stat-card">
            <div className="stat-icon"><i className="bi bi-calendar"></i></div>
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total</div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-icon"><i className="bi bi-clock"></i></div>
            <div className="stat-value">{stats.en_attente}</div>
            <div className="stat-label">En attente</div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-icon"><i className="bi bi-check-circle"></i></div>
            <div className="stat-value">{stats.confirmees}</div>
            <div className="stat-label">Confirmées</div>
          </div>
          <div className="stat-card stat-info">
            <div className="stat-icon"><i className="bi bi-check2-circle"></i></div>
            <div className="stat-value">{stats.terminees}</div>
            <div className="stat-label">Terminées</div>
          </div>
          <div className="stat-card stat-danger">
            <div className="stat-icon"><i className="bi bi-x-circle"></i></div>
            <div className="stat-value">{stats.annulees}</div>
            <div className="stat-label">Annulées</div>
          </div>
        </div>

        {/* Filtres */}
        <div className="filters-section">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Rechercher par service, demandeur ou prestataire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="statut-filters">
            <button 
              className={`filter-btn ${selectedStatut === "tous" ? "active" : ""}`}
              onClick={() => setSelectedStatut("tous")}
            >
              Tous ({stats.total})
            </button>
            <button 
              className={`filter-btn ${selectedStatut === "en_attente" ? "active" : ""}`}
              onClick={() => setSelectedStatut("en_attente")}
            >
              En attente ({stats.en_attente})
            </button>
            <button 
              className={`filter-btn ${selectedStatut === "confirmee" ? "active" : ""}`}
              onClick={() => setSelectedStatut("confirmee")}
            >
              Confirmées ({stats.confirmees})
            </button>
            <button 
              className={`filter-btn ${selectedStatut === "terminee" ? "active" : ""}`}
              onClick={() => setSelectedStatut("terminee")}
            >
              Terminées ({stats.terminees})
            </button>
            <button 
              className={`filter-btn ${selectedStatut === "annulee" ? "active" : ""}`}
              onClick={() => setSelectedStatut("annulee")}
            >
              Annulées ({stats.annulees})
            </button>
          </div>
        </div>

        {/* Tableau des réservations */}
        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-calendar-x"></i>
            <h3>Aucune réservation trouvée</h3>
            <p>Aucune réservation ne correspond à vos critères</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="data-table">
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
                {filteredReservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>#{reservation.id}</td>
                    <td>{reservation.service?.nom || "-"}</td>
                    <td>
                      {reservation.demandeur?.prenom} {reservation.demandeur?.nom}
                    </td>
                    <td>
                      {reservation.prestataire?.prenom} {reservation.prestataire?.nom}
                    </td>
                    <td>{formatDate(reservation.date_debut)}</td>
                    <td>{reservation.service?.prix?.toLocaleString()} FCFA</td>
                    <td>
                      <span className={`statut-badge ${getStatutClass(reservation.statut)}`}>
                        {getStatutTexte(reservation.statut)}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button 
                          className="btn-view"
                          onClick={() => {
                            setSelectedReservation(reservation);
                            setShowModal(true);
                          }}
                          title="Voir détails"
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button 
                          className="btn-delete"
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
        )}

        {/* Modal Détails */}
        {showModal && selectedReservation && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Détails de la réservation #{selectedReservation.id}</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="details-grid">
                  <div className="detail-group">
                    <label>Service</label>
                    <p>{selectedReservation.service?.nom || "-"}</p>
                  </div>
                  <div className="detail-group">
                    <label>Prix</label>
                    <p>{selectedReservation.service?.prix?.toLocaleString()} FCFA</p>
                  </div>
                  <div className="detail-group">
                    <label>Demandeur</label>
                    <p>{selectedReservation.demandeur?.prenom} {selectedReservation.demandeur?.nom}</p>
                    <small>{selectedReservation.demandeur?.email}</small>
                    <small>{selectedReservation.demandeur?.telephone}</small>
                  </div>
                  <div className="detail-group">
                    <label>Prestataire</label>
                    <p>{selectedReservation.prestataire?.prenom} {selectedReservation.prestataire?.nom}</p>
                    <small>{selectedReservation.prestataire?.email}</small>
                    <small>{selectedReservation.prestataire?.telephone}</small>
                  </div>
                  <div className="detail-group">
                    <label>Date de début</label>
                    <p>{formatDate(selectedReservation.date_debut)}</p>
                  </div>
                  <div className="detail-group">
                    <label>Statut actuel</label>
                    <select 
                      value={selectedReservation.statut}
                      onChange={(e) => handleUpdateStatut(selectedReservation.id, e.target.value)}
                      disabled={updating}
                      className="status-select"
                    >
                      <option value="en_attente">En attente</option>
                      <option value="confirmee">Confirmée</option>
                      <option value="terminee">Terminée</option>
                      <option value="annulee">Annulée</option>
                    </select>
                  </div>
                  {selectedReservation.commentaire && (
                    <div className="detail-group full-width">
                      <label>Commentaire</label>
                      <p className="commentaire-text">{selectedReservation.commentaire}</p>
                    </div>
                  )}
                  <div className="detail-group">
                    <label>Date de création</label>
                    <p>{new Date(selectedReservation.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .stats-cards-admin {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .filters-section {
          background: white;
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
        }

        .search-box {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8fafc;
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }

        .search-box i {
          color: #94a3b8;
        }

        .search-box input {
          flex: 1;
          border: none;
          background: none;
          outline: none;
          font-size: 0.875rem;
        }

        .statut-filters {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.75rem;
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

        .table-container {
          background: white;
          border-radius: 16px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
        }

        .data-table th,
        .data-table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .data-table th {
          background: #f8fafc;
          font-weight: 600;
          color: #1e293b;
        }

        .data-table tr:hover {
          background: #f8fafc;
        }

        .statut-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-view,
        .btn-delete {
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

        .btn-view {
          background: #eef2ff;
          color: #354dd4;
        }

        .btn-view:hover {
          background: #354dd4;
          color: white;
        }

        .btn-delete {
          background: #fee2e2;
          color: #ef4444;
        }

        .btn-delete:hover {
          background: #ef4444;
          color: white;
        }

        .empty-state {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
        }

        .empty-state i {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .details-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .detail-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .detail-group.full-width {
          grid-column: span 2;
        }

        .detail-group label {
          font-size: 0.7rem;
          font-weight: 600;
          color: #64748b;
          text-transform: uppercase;
        }

        .detail-group p {
          font-size: 0.875rem;
          color: #1e293b;
          margin: 0;
        }

        .detail-group small {
          font-size: 0.7rem;
          color: #94a3b8;
        }

        .status-select {
          padding: 0.5rem;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
        }

        .commentaire-text {
          background: #f8fafc;
          padding: 0.75rem;
          border-radius: 8px;
          font-style: italic;
        }

        @media (max-width: 768px) {
          .filters-section {
            flex-direction: column;
          }
          
          .statut-filters {
            justify-content: center;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-group.full-width {
            grid-column: span 1;
          }
          
          .data-table th,
          .data-table td {
            padding: 0.75rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ReservationsAdmin;