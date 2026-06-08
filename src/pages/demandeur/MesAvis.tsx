// src/pages/demandeur/MesAvis.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import api from "../../services/api";
import "../../styles/dashboard.css";

interface Avis {
  id: number;
  reservation_id: number;
  auteur_id: number;
  cible_id: number;
  note: number;
  commentaire: string;
  signale: boolean;
  created_at: string;
  reservation?: {
    id: number;
    service?: {
      id: number;
      nom: string;
      prix: number;
    };
    prestataire?: {
      id: number;
      nom: string;
      prenom: string;
    };
  };
  cible?: {
    id: number;
    nom: string;
    prenom: string;
    role: string;
  };
}

interface ReservationSansAvis {
  id: number;
  service_id: number;
  service_nom: string;
  prestataire_nom: string;
  prestataire_prenom: string;
  date_debut: string;
}

const MesAvis = () => {
  const [avisList, setAvisList] = useState<Avis[]>([]);
  const [reservationsSansAvis, setReservationsSansAvis] = useState<ReservationSansAvis[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationSansAvis | null>(null);
  const [formAvis, setFormAvis] = useState({
    note: 5,
    commentaire: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [selectedNote, setSelectedNote] = useState(0);
  const [hoveredNote, setHoveredNote] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les avis de l'utilisateur
      const avisResponse = await api.get("/avis");
      console.log("Avis reçus:", avisResponse.data);
      
      let avisData: Avis[] = [];
      if (avisResponse.data.data) {
        avisData = avisResponse.data.data;
      } else if (Array.isArray(avisResponse.data)) {
        avisData = avisResponse.data;
      } else if (avisResponse.data.avis) {
        avisData = avisResponse.data.avis;
      }
      
      setAvisList(avisData);
      
      // Récupérer les réservations terminées sans avis
      const reservationsResponse = await api.get("/reservations");
      let reservationsData: any[] = [];
      if (reservationsResponse.data.data) {
        reservationsData = reservationsResponse.data.data;
      } else if (Array.isArray(reservationsResponse.data)) {
        reservationsData = reservationsResponse.data;
      }
      
      // Filtrer les réservations terminées sans avis
      const avisReservationIds = avisData.map(a => a.reservation_id);
      const sansAvis = reservationsData
        .filter(r => r.statut === "terminee" && !avisReservationIds.includes(r.id))
        .map(r => ({
          id: r.id,
          service_id: r.service_id,
          service_nom: r.service?.nom || "Service",
          prestataire_nom: r.prestataire?.nom || "Prestataire",
          prestataire_prenom: r.prestataire?.prenom || "",
          date_debut: r.date_debut
        }));
      
      setReservationsSansAvis(sansAvis);
      
    } catch (err: any) {
      console.error("Erreur:", err);
      setError(err.response?.data?.message || "Erreur lors du chargement des avis");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (reservation: ReservationSansAvis) => {
    setSelectedReservation(reservation);
    setFormAvis({ note: 5, commentaire: "" });
    setSelectedNote(5);
    setShowModal(true);
  };

  const handleSubmitAvis = async () => {
    if (!selectedReservation) return;
    
    try {
      setSubmitting(true);
      
      const data = {
        reservation_id: selectedReservation.id,
        note: formAvis.note,
        commentaire: formAvis.commentaire
      };
      
      await api.post("/avis", data);
      
      // Recharger les données
      await fetchData();
      setShowModal(false);
      setSelectedReservation(null);
      
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors de l'envoi de l'avis");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSignalerAvis = async (avisId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir signaler cet avis ?")) return;
    
    try {
      await api.patch(`/avis/${avisId}`, { signale: true });
      setAvisList(prev =>
        prev.map(a => a.id === avisId ? { ...a, signale: true } : a)
      );
      alert("Avis signalé avec succès");
    } catch (err: any) {
      console.error("Erreur:", err);
      alert(err.response?.data?.message || "Erreur lors du signalement");
    }
  };

  const renderStars = (note: number, interactive = false, onClick?: (n: number) => void) => {
    const stars = [];
    const currentNote = interactive ? (hoveredNote || selectedNote) : note;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <i
          key={i}
          className={`bi bi-star${i <= currentNote ? "-fill" : ""}`}
          style={{
            color: i <= currentNote ? "#fbbf24" : "#cbd5e1",
            fontSize: interactive ? "2rem" : "1rem",
            cursor: interactive ? "pointer" : "default",
            transition: "all 0.2s ease"
          }}
          onMouseEnter={() => interactive && setHoveredNote(i)}
          onMouseLeave={() => interactive && setHoveredNote(selectedNote)}
          onClick={() => {
            if (interactive && onClick) {
              setSelectedNote(i);
              onClick(i);
            }
          }}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<DemandeurSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement de vos avis...</p>
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
          <button onClick={fetchData} className="retry-btn">
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
            <i className="bi bi-star"></i>
            Mes avis
          </h1>
          <p>Consultez et gérez les avis que vous avez donnés</p>
        </div>

        {/* Statistiques */}
        <div className="avis-stats">
          <div className="stat-card-mini">
            <i className="bi bi-chat-dots"></i>
            <div>
              <span className="stat-number">{avisList.length}</span>
              <span className="stat-label">Avis donnés</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <i className="bi bi-star-fill"></i>
            <div>
              <span className="stat-number">
                {avisList.length > 0 
                  ? (avisList.reduce((acc, a) => acc + a.note, 0) / avisList.length).toFixed(1)
                  : "0"}
              </span>
              <span className="stat-label">Note moyenne</span>
            </div>
          </div>
          <div className="stat-card-mini">
            <i className="bi bi-pencil-square"></i>
            <div>
              <span className="stat-number">{reservationsSansAvis.length}</span>
              <span className="stat-label">À évaluer</span>
            </div>
          </div>
        </div>

        {/* Section des réservations à évaluer */}
        {reservationsSansAvis.length > 0 && (
          <div className="to-review-section">
            <h3>
              <i className="bi bi-pencil-square"></i>
              Services à évaluer
            </h3>
            <div className="to-review-list">
              {reservationsSansAvis.map((reservation) => (
                <div key={reservation.id} className="to-review-card">
                  <div className="to-review-info">
                    <div className="service-name">
                      <i className="bi bi-tools"></i>
                      {reservation.service_nom}
                    </div>
                    <div className="prestataire-name">
                      <i className="bi bi-person"></i>
                      {reservation.prestataire_prenom} {reservation.prestataire_nom}
                    </div>
                    <div className="date">
                      <i className="bi bi-calendar"></i>
                      {new Date(reservation.date_debut).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  <button 
                    className="btn-review-now"
                    onClick={() => handleOpenModal(reservation)}
                  >
                    <i className="bi bi-star"></i>
                    Donner mon avis
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Liste des avis donnés */}
        <div className="avis-section">
          <h3>
            <i className="bi bi-clock-history"></i>
            Mes avis donnés
          </h3>
          
          {avisList.length === 0 ? (
            <div className="empty-avis">
              <i className="bi bi-chat-square-text"></i>
              <p>Vous n'avez pas encore donné d'avis.</p>
              <Link to="/services" className="btn-explorer">
                Explorer les services
              </Link>
            </div>
          ) : (
            <div className="avis-list">
              {avisList.map((avis) => (
                <div key={avis.id} className="avis-card">
                  <div className="avis-header">
                    <div className="avis-service">
                      <i className="bi bi-tools"></i>
                      <span>{avis.reservation?.service?.nom || "Service"}</span>
                    </div>
                    <div className="avis-date">
                      {new Date(avis.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="avis-body">
                    <div className="avis-prestataire">
                      <i className="bi bi-person-circle"></i>
                      {avis.cible?.prenom} {avis.cible?.nom}
                    </div>
                    <div className="avis-note">
                      {renderStars(avis.note)}
                    </div>
                    <div className="avis-commentaire">
                      <i className="bi bi-chat-quote"></i>
                      "{avis.commentaire}"
                    </div>
                  </div>
                  
                  <div className="avis-footer">
                    {!avis.signale && (
                      <button 
                        className="btn-signaler"
                        onClick={() => handleSignalerAvis(avis.id)}
                      >
                        <i className="bi bi-flag"></i>
                        Signaler
                      </button>
                    )}
                    {avis.signale && (
                      <span className="signale-badge">
                        <i className="bi bi-check-circle"></i>
                        Signalé
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal pour donner un avis */}
        {showModal && selectedReservation && (
          <div className="modal-overlay">
            <div className="modal-content modal-lg">
              <div className="modal-header">
                <h3>Donner mon avis</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="reservation-info-modal">
                  <p>
                    <strong>Service :</strong> {selectedReservation.service_nom}
                  </p>
                  <p>
                    <strong>Prestataire :</strong> {selectedReservation.prestataire_prenom} {selectedReservation.prestataire_nom}
                  </p>
                  <p>
                    <strong>Date :</strong> {new Date(selectedReservation.date_debut).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                
                <div className="note-section">
                  <label>Votre note :</label>
                  <div className="stars-interactive">
                    {renderStars(formAvis.note, true, (note) => {
                      setFormAvis({ ...formAvis, note });
                    })}
                  </div>
                </div>
                
                <div className="commentaire-section">
                  <label htmlFor="commentaire">Votre commentaire :</label>
                  <textarea
                    id="commentaire"
                    rows={5}
                    value={formAvis.commentaire}
                    onChange={(e) => setFormAvis({ ...formAvis, commentaire: e.target.value })}
                    placeholder="Partagez votre expérience avec ce prestataire..."
                    className="commentaire-textarea"
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>
                  Annuler
                </button>
                <button 
                  className="btn-submit"
                  onClick={handleSubmitAvis}
                  disabled={submitting}
                >
                  {submitting ? "Envoi en cours..." : "Publier mon avis"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .avis-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .to-review-section,
        .avis-section {
          margin-bottom: 2rem;
        }

        .to-review-section h3,
        .avis-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #1e293b;
        }

        .to-review-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .to-review-card {
          background: white;
          border-radius: 16px;
          padding: 1rem 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .to-review-info {
          display: flex;
          flex-wrap: wrap;
          gap: 1.5rem;
          align-items: center;
        }

        .service-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .prestataire-name,
        .date {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .btn-review-now {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: #354dd4;
          color: white;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .btn-review-now:hover {
          background: #2a3fb0;
          transform: translateY(-2px);
        }

        .avis-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .avis-card {
          background: white;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .avis-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .avis-service {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .avis-service i {
          color: #354dd4;
        }

        .avis-date {
          font-size: 0.75rem;
          color: #64748b;
        }

        .avis-body {
          padding: 1.5rem;
        }

        .avis-prestataire {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          color: #354dd4;
          font-weight: 500;
        }

        .avis-note {
          margin-bottom: 0.75rem;
        }

        .avis-commentaire {
          font-size: 0.875rem;
          color: #1e293b;
          line-height: 1.5;
          font-style: italic;
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-top: 0.5rem;
        }

        .avis-footer {
          padding: 0.75rem 1.5rem;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .btn-signaler {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: #fee2e2;
          color: #ef4444;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.7rem;
          transition: all 0.3s ease;
        }

        .btn-signaler:hover {
          background: #fecaca;
        }

        .signale-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.25rem 0.75rem;
          background: #e2e8f0;
          color: #64748b;
          border-radius: 20px;
          font-size: 0.7rem;
        }

        .empty-avis {
          text-align: center;
          padding: 3rem;
          background: white;
          border-radius: 16px;
        }

        .empty-avis i {
          font-size: 3rem;
          color: #cbd5e1;
          margin-bottom: 1rem;
        }

        .btn-explorer {
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

        .modal-lg {
          max-width: 600px;
        }

        .reservation-info-modal {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 12px;
          margin-bottom: 1.5rem;
        }

        .reservation-info-modal p {
          margin: 0.25rem 0;
          font-size: 0.875rem;
        }

        .note-section {
          margin-bottom: 1.5rem;
        }

        .note-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .stars-interactive {
          display: flex;
          gap: 0.5rem;
        }

        .commentaire-section {
          margin-bottom: 1.5rem;
        }

        .commentaire-section label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #1e293b;
        }

        .commentaire-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.875rem;
          font-family: inherit;
          resize: vertical;
        }

        .commentaire-textarea:focus {
          outline: none;
          border-color: #354dd4;
        }

        @media (max-width: 768px) {
          .to-review-card {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .to-review-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
          
          .avis-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
};

export default MesAvis;