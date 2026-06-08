// src/pages/demandeur/MesReservations.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
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
    duree: string;
  };
  prestataire?: {
    id: number;
    nom: string;
    prenom: string;
    telephone: string;
  };
}

const MesReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [showAnnulerModal, setShowAnnulerModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const response = await api.get("/reservations");
      console.log("Réservations reçues:", response.data);
      
      let reservationsData: Reservation[] = [];
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

  const getStatutIcone = (statut: string) => {
    switch (statut) {
      case "confirmee": return "bi-check-circle-fill";
      case "terminee": return "bi-check2-circle";
      case "annulee": return "bi-x-circle-fill";
      default: return "bi-clock-fill";
    }
  };

  const filtrerReservations = (): Reservation[] => {
    if (selectedStatut === "tous") {
      return reservations;
    }
    return reservations.filter(r => r.statut === selectedStatut);
  };

  const handleAnnulerReservation = async () => {
    if (!reservationToCancel) return;
    
    try {
      setCancelling(true);
      await api.put(`/reservations/${reservationToCancel.id}`, {
        statut: "annulee"
      });
      
      setReservations(prev =>
        prev.map(r =>
          r.id === reservationToCancel.id ? { ...r, statut: "annulee" as const } : r
        )
      );
      
      setShowAnnulerModal(false);
      setReservationToCancel(null);
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de l'annulation");
    } finally {
      setCancelling(false);
    }
  };

  const reservationsFiltered = filtrerReservations();
  const stats = {
    total: reservations.length,
    en_attente: reservations.filter(r => r.statut === "en_attente").length,
    confirmees: reservations.filter(r => r.statut === "confirmee").length,
    terminees: reservations.filter(r => r.statut === "terminee").length,
    annulees: reservations.filter(r => r.statut === "annulee").length,
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de vos réservations...</p>
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
          <button onClick={fetchReservations} className="retry-btn">
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
            <i className="bi bi-calendar-check"></i>
            Mes réservations
          </h1>
          <p>Consultez et gérez toutes vos réservations</p>
        </div>

        {/* Statistiques */}
        <div className="reservation-stats">
          <div className="stat-card-mini">
            <i className="bi bi-calendar"></i>
            <div>
              <span className="stat-number">{stats.total}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="stat-card-mini stat-warning">
            <i className="bi bi-clock-fill"></i>
            <div>
              <span className="stat-number">{stats.en_attente}</span>
              <span className="stat-label">En attente</span>
            </div>
          </div>
          <div className="stat-card-mini stat-success">
            <i className="bi bi-check-circle-fill"></i>
            <div>
              <span className="stat-number">{stats.confirmees}</span>
              <span className="stat-label">Confirmées</span>
            </div>
          </div>
          <div className="stat-card-mini stat-info">
            <i className="bi bi-check2-circle"></i>
            <div>
              <span className="stat-number">{stats.terminees}</span>
              <span className="stat-label">Terminées</span>
            </div>
          </div>
          <div className="stat-card-mini stat-danger">
            <i className="bi bi-x-circle-fill"></i>
            <div>
              <span className="stat-number">{stats.annulees}</span>
              <span className="stat-label">Annulées</span>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="reservation-filters">
          <div className="filter-buttons">
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
          <Link to="/demandeur/reservation/nouvelle" className="btn-new-reservation">
            <i className="bi bi-plus-circle"></i>
            Nouvelle réservation
          </Link>
        </div>

        {/* Liste des réservations */}
        {reservationsFiltered.length === 0 ? (
          <div className="empty-reservations">
            <i className="bi bi-calendar-x"></i>
            <h3>Aucune réservation trouvée</h3>
            <p>Vous n'avez pas encore de réservation dans cette catégorie.</p>
            <Link to="/services" className="btn-explorer-services">
              <i className="bi bi-search"></i>
              Explorer les services
            </Link>
          </div>
        ) : (
          <div className="reservations-list-container">
            {reservationsFiltered.map((reservation) => (
              <div key={reservation.id} className="reservation-card">
                <div className="reservation-card-header">
                  <div className="reservation-service">
                    <i className="bi bi-tools"></i>
                    <span>{reservation.service?.nom || "Service"}</span>
                  </div>
                  <div className={`reservation-statut ${getStatutClass(reservation.statut)}`}>
                    <i className={`bi ${getStatutIcone(reservation.statut)}`}></i>
                    {getStatutTexte(reservation.statut)}
                  </div>
                </div>
                
                <div className="reservation-card-body">
                  <div className="reservation-info">
                    <div className="info-item">
                      <i className="bi bi-person"></i>
                      <div>
                        <span className="info-label">Prestataire</span>
                        <span className="info-value">
                          {reservation.prestataire?.prenom} {reservation.prestataire?.nom || "Prestataire"}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="bi bi-calendar"></i>
                      <div>
                        <span className="info-label">Date et heure</span>
                        <span className="info-value">
                          {new Date(reservation.date_debut).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                    <div className="info-item">
                      <i className="bi bi-currency-dollar"></i>
                      <div>
                        <span className="info-label">Prix</span>
                        <span className="info-value">{reservation.service?.prix?.toLocaleString() || 0} FCFA</span>
                      </div>
                    </div>
                    {reservation.commentaire && (
                      <div className="info-item">
                        <i className="bi bi-chat"></i>
                        <div>
                          <span className="info-label">Commentaire</span>
                          <span className="info-value">{reservation.commentaire}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="reservation-card-footer">
                  <Link to={`/services/${reservation.service_id}`} className="btn-view-service">
                    <i className="bi bi-eye"></i>
                    Voir le service
                  </Link>
                  {reservation.statut === "en_attente" && (
                    <button 
                      className="btn-cancel-reservation"
                      onClick={() => {
                        setReservationToCancel(reservation);
                        setShowAnnulerModal(true);
                      }}
                    >
                      <i className="bi bi-x-circle"></i>
                      Annuler
                    </button>
                  )}
                  {reservation.statut === "terminee" && (
                    <Link to={`/demandeur/avis?service=${reservation.service_id}`} className="btn-review">
                      <i className="bi bi-star"></i>
                      Donner un avis
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal d'annulation */}
        {showAnnulerModal && reservationToCancel && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>Annuler la réservation</h3>
                <button className="modal-close" onClick={() => setShowAnnulerModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
                <div className="reservation-details">
                  <strong>{reservationToCancel.service?.nom}</strong>
                  <span>{new Date(reservationToCancel.date_debut).toLocaleString('fr-FR')}</span>
                </div>
                <p className="warning-text">Cette action est irréversible.</p>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowAnnulerModal(false)}>
                  Non, revenir
                </button>
                <button 
                  className="btn-danger" 
                  onClick={handleAnnulerReservation}
                  disabled={cancelling}
                >
                  {cancelling ? "Annulation..." : "Oui, annuler"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reservation-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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

        .stat-card-mini .stat-number {
          display: block;
          font-size: 1.25rem;
          font-weight: 700;
          color: #1e293b;
        }

        .stat-card-mini .stat-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .reservation-filters {
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

        .btn-new-reservation {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #354dd4;
          color: white;
          border-radius: 10px;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .btn-new-reservation:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
          color: white;
        }

        .reservations-list-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .reservation-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .reservation-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
        }

        .reservation-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .reservation-service {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .reservation-service i {
          color: #354dd4;
        }

        .reservation-statut {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.7rem;
          font-weight: 500;
        }

        .statut-confirmee {
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
        }

        .statut-terminee {
          background: rgba(53, 77, 212, 0.1);
          color: #354dd4;
        }

        .statut-attente {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
        }

        .statut-annulee {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
        }

        .reservation-card-body {
          padding: 1.5rem;
        }

        .reservation-info {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }

        .info-item i {
          font-size: 1.25rem;
          color: #354dd4;
          margin-top: 0.125rem;
        }

        .info-item div {
          display: flex;
          flex-direction: column;
        }

        .info-label {
          font-size: 0.7rem;
          color: #64748b;
        }

        .info-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }

        .reservation-card-footer {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .btn-view-service,
        .btn-cancel-reservation,
        .btn-review {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          text-decoration: none;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .btn-view-service {
          background: #f1f5f9;
          color: #64748b;
        }

        .btn-view-service:hover {
          background: #e2e8f0;
        }

        .btn-cancel-reservation {
          background: #fee2e2;
          color: #ef4444;
          border: none;
        }

        .btn-cancel-reservation:hover {
          background: #fecaca;
        }

        .btn-review {
          background: rgba(53, 77, 212, 0.1);
          color: #354dd4;
        }

        .btn-review:hover {
          background: rgba(53, 77, 212, 0.2);
        }

        .empty-reservations {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
        }

        .empty-reservations i {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .empty-reservations h3 {
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
        }

        .btn-explorer-services {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          background: #354dd4;
          color: white;
          border-radius: 10px;
          text-decoration: none;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 20px;
          width: 90%;
          max-width: 500px;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-body {
          padding: 1.5rem;
        }

        .reservation-details {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin: 1rem 0;
        }

        .warning-text {
          color: #ef4444;
          font-size: 0.75rem;
        }

        .modal-footer {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          padding: 1rem 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn-secondary {
          padding: 0.5rem 1rem;
          background: #f1f5f9;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-danger {
          padding: 0.5rem 1rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        .btn-danger:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .reservation-filters {
            flex-direction: column;
            align-items: stretch;
          }
          
          .filter-buttons {
            justify-content: center;
          }
          
          .reservation-info {
            grid-template-columns: 1fr;
          }
          
          .reservation-card-footer {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MesReservations;