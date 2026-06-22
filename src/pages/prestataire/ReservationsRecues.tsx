// src/pages/prestataire/ReservationsRecues.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import PrestataireSidebar from "../../components/dashboard/PrestataireSidebar";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/dashboard.css";

interface Reservation {
  id: number;
  service_id: number;
  service_nom: string;
  demandeur_id: number;
  demandeur_nom: string;
  demandeur_prenom: string;
  demandeur_email: string;
  demandeur_telephone: string;
  date_debut: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  montant: number;
  created_at: string;
  prestataire_id: number;
  prestataire_nom?: string;
  prestataire_prenom?: string;
}

const ReservationsRecues = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [updating, setUpdating] = useState(false);
  const [prestataireId, setPrestataireId] = useState<number | null>(null);

  useEffect(() => {
    // Récupérer l'ID du prestataire connecté
    const getPrestataireId = () => {
      // 1. Essayer depuis le contexte Auth
      if (user) {
        console.log("🔑 Prestataire ID depuis AuthContext:", user.id);
        return user.id;
      }
      
      // 2. Essayer depuis localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("🔑 Prestataire ID depuis localStorage:", userData.id);
          return userData.id;
        } catch (e) {
          console.error("Erreur parsing user:", e);
        }
      }
      
      // 3. Fallback: ID par défaut pour le développement
      console.log("⚠️ Aucun utilisateur trouvé, utilisation de l'ID par défaut: 2");
      return 2;
    };

    const id = getPrestataireId();
    setPrestataireId(id);
  }, [user]);

  useEffect(() => {
    if (prestataireId !== null) {
      loadReservations();
    }
  }, [prestataireId]);

  const loadReservations = () => {
    setLoading(true);
    
    // Récupérer les réservations du localStorage
    const storedReservations = localStorage.getItem("reservations");
    
    if (storedReservations) {
      const allReservations = JSON.parse(storedReservations);
      console.log("📋 Toutes les réservations:", allReservations);
      
      // Filtrer les réservations pour le prestataire connecté
      const prestataireReservations = allReservations.filter(
        (r: Reservation) => r.prestataire_id === prestataireId
      );
      
      console.log(`🔍 Réservations pour le prestataire ${prestataireId}:`, prestataireReservations);
      setReservations(prestataireReservations);
    } else {
      // Données mockées par défaut pour le prestataire
      const defaultReservations: Reservation[] = [
        {
          id: 1,
          service_id: 1,
          service_nom: "Plomberie Express",
          demandeur_id: 1,
          demandeur_nom: "Dupont",
          demandeur_prenom: "Jean",
          demandeur_email: "jean.dupont@email.com",
          demandeur_telephone: "+221 77 123 45 67",
          date_debut: "2024-06-20T10:00:00",
          statut: "confirmee",
          commentaire: "Première intervention, fuite dans la cuisine",
          montant: 25000,
          created_at: "2024-06-15T08:00:00",
          prestataire_id: prestataireId || 2,
          prestataire_nom: "Tech",
          prestataire_prenom: "Alpha"
        },
        {
          id: 2,
          service_id: 2,
          service_nom: "Dépannage Électrique",
          demandeur_id: 2,
          demandeur_nom: "Lambert",
          demandeur_prenom: "Marie",
          demandeur_email: "marie.lambert@email.com",
          demandeur_telephone: "+221 77 234 56 78",
          date_debut: "2024-06-18T14:00:00",
          statut: "terminee",
          commentaire: "Panne de courant dans tout l'appartement",
          montant: 30000,
          created_at: "2024-06-16T09:00:00",
          prestataire_id: prestataireId || 2,
          prestataire_nom: "Tech",
          prestataire_prenom: "Alpha"
        }
      ];
      setReservations(defaultReservations);
      localStorage.setItem("reservations", JSON.stringify(defaultReservations));
    }
    
    setLoading(false);
  };

  // Le reste du code reste identique...
  const handleUpdateStatut = async (id: number, newStatut: string) => {
    setUpdating(true);
    
    const updatedReservations = reservations.map(r =>
      r.id === id ? { ...r, statut: newStatut as any } : r
    );
    setReservations(updatedReservations);
    
    const storedReservations = localStorage.getItem("reservations");
    if (storedReservations) {
      const allReservations = JSON.parse(storedReservations);
      const updatedAll = allReservations.map((r: Reservation) =>
        r.id === id ? { ...r, statut: newStatut } : r
      );
      localStorage.setItem("reservations", JSON.stringify(updatedAll));
    }
    
    // Créer une notification pour le demandeur
    const reservation = reservations.find(r => r.id === id);
    if (reservation) {
      const existingNotifications = localStorage.getItem("demandeur_notifications");
      let notifications = existingNotifications ? JSON.parse(existingNotifications) : [];
      
      const statusText = newStatut === "confirmee" ? "confirmée" : newStatut === "terminee" ? "terminée" : "annulée";
      const newNotification = {
        id: Date.now(),
        type: "reservation",
        titre: `Réservation ${statusText}`,
        contenu: `Votre réservation pour "${reservation.service_nom}" a été ${statusText}`,
        lu: false,
        date: new Date().toISOString(),
        service_id: reservation.service_id,
        service_nom: reservation.service_nom
      };
      notifications.unshift(newNotification);
      localStorage.setItem("demandeur_notifications", JSON.stringify(notifications));
    }
    
    if (selectedReservation && selectedReservation.id === id) {
      setSelectedReservation({ ...selectedReservation, statut: newStatut as any });
    }
    
    setUpdating(false);
  };

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case "confirmee":
        return { label: "Confirmée", class: "status-confirmed", icon: "bi-check-circle-fill", color: "#22c55e" };
      case "terminee":
        return { label: "Terminée", class: "status-completed", icon: "bi-check2-circle", color: "#354dd4" };
      case "annulee":
        return { label: "Annulée", class: "status-cancelled", icon: "bi-x-circle-fill", color: "#ef4444" };
      default:
        return { label: "En attente", class: "status-pending", icon: "bi-clock-fill", color: "#f59e0b" };
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

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredReservations = reservations.filter(r => {
    const matchesStatut = selectedStatut === "tous" || r.statut === selectedStatut;
    const matchesSearch = r.service_nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.demandeur_prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.demandeur_nom.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatut && matchesSearch;
  });

  const stats = {
    total: reservations.length,
    en_attente: reservations.filter(r => r.statut === "en_attente").length,
    confirmees: reservations.filter(r => r.statut === "confirmee").length,
    terminees: reservations.filter(r => r.statut === "terminee").length,
    annulees: reservations.filter(r => r.statut === "annulee").length,
    revenus: reservations.filter(r => r.statut === "terminee").reduce((sum, r) => sum + r.montant, 0)
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={<PrestataireSidebar />}>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Chargement des réservations...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={<PrestataireSidebar />}>
      <div className="reservations-recues">
        <div className="page-header">
          <h1>
            <i className="bi bi-calendar-check"></i>
            Réservations reçues
          </h1>
          <p>Consultez et gérez les demandes de vos clients</p>
        </div>

        {/* Statistiques */}
        <div className="stats-container">
          <div className="stat-card">
            <div className="stat-icon blue"><i className="bi bi-calendar"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total réservations</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange"><i className="bi bi-clock"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.en_attente}</span>
              <span className="stat-label">En attente</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green"><i className="bi bi-check-circle"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.confirmees}</span>
              <span className="stat-label">Confirmées</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple"><i className="bi bi-check2-circle"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.terminees}</span>
              <span className="stat-label">Terminées</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon teal"><i className="bi bi-currency-dollar"></i></div>
            <div className="stat-info">
              <span className="stat-value">{stats.revenus.toLocaleString()} FCFA</span>
              <span className="stat-label">Revenus totaux</span>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="filters-container">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Rechercher par service ou client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filters">
            <button 
              className={`filter-btn ${selectedStatut === "tous" ? "active" : ""}`}
              onClick={() => setSelectedStatut("tous")}
            >
              Toutes ({stats.total})
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
          </div>
        </div>

        {/* Liste des réservations */}
        {filteredReservations.length === 0 ? (
          <div className="empty-state">
            <i className="bi bi-inbox"></i>
            <h3>Aucune réservation</h3>
            <p>Vous n'avez pas encore de réservations dans cette catégorie</p>
          </div>
        ) : (
          <div className="reservations-grid">
            {filteredReservations.map((reservation) => {
              const status = getStatutInfo(reservation.statut);
              return (
                <div key={reservation.id} className="reservation-card">
                  <div className="card-header">
                    <div className="service-badge">
                      <i className="bi bi-tools"></i>
                      <span>{reservation.service_nom}</span>
                    </div>
                    <div className={`status-badge ${status.class}`}>
                      <i className={`bi ${status.icon}`}></i>
                      {status.label}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="client-info">
                      <div className="client-avatar">
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div className="client-details">
                        <h4>{reservation.demandeur_prenom} {reservation.demandeur_nom}</h4>
                        <div className="client-contact">
                          <a href={`tel:${reservation.demandeur_telephone}`}>
                            <i className="bi bi-telephone"></i> {reservation.demandeur_telephone}
                          </a>
                          <a href={`mailto:${reservation.demandeur_email}`}>
                            <i className="bi bi-envelope"></i> {reservation.demandeur_email}
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="reservation-details">
                      <div className="detail-item">
                        <i className="bi bi-calendar"></i>
                        <div>
                          <span className="detail-label">Date et heure</span>
                          <span className="detail-value">{formatDate(reservation.date_debut)}</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-currency-dollar"></i>
                        <div>
                          <span className="detail-label">Montant</span>
                          <span className="detail-value price">{reservation.montant.toLocaleString()} FCFA</span>
                        </div>
                      </div>
                      <div className="detail-item">
                        <i className="bi bi-calendar3"></i>
                        <div>
                          <span className="detail-label">Réservé le</span>
                          <span className="detail-value">{formatDateShort(reservation.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    {reservation.commentaire && (
                      <div className="comment-section">
                        <i className="bi bi-chat-quote"></i>
                        <p>"{reservation.commentaire}"</p>
                      </div>
                    )}
                  </div>

                  <div className="card-footer">
                    {reservation.statut === "en_attente" && (
                      <>
                        <button 
                          className="btn-confirm"
                          onClick={() => handleUpdateStatut(reservation.id, "confirmee")}
                          disabled={updating}
                        >
                          <i className="bi bi-check-circle"></i>
                          Confirmer
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => handleUpdateStatut(reservation.id, "annulee")}
                          disabled={updating}
                        >
                          <i className="bi bi-x-circle"></i>
                          Refuser
                        </button>
                      </>
                    )}
                    {reservation.statut === "confirmee" && (
                      <button 
                        className="btn-complete"
                        onClick={() => handleUpdateStatut(reservation.id, "terminee")}
                        disabled={updating}
                      >
                        <i className="bi bi-check2-circle"></i>
                        Marquer comme terminée
                      </button>
                    )}
                    <button 
                      className="btn-details"
                      onClick={() => {
                        setSelectedReservation(reservation);
                        setShowModal(true);
                      }}
                    >
                      <i className="bi bi-eye"></i>
                      Voir détails
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Détails */}
        {showModal && selectedReservation && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3><i className="bi bi-info-circle"></i> Détails de la réservation</h3>
                <button className="modal-close" onClick={() => setShowModal(false)}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-section">
                  <h4>Service</h4>
                  <p>{selectedReservation.service_nom}</p>
                </div>
                <div className="detail-section">
                  <h4>Client</h4>
                  <p>{selectedReservation.demandeur_prenom} {selectedReservation.demandeur_nom}</p>
                  <p><i className="bi bi-envelope"></i> {selectedReservation.demandeur_email}</p>
                  <p><i className="bi bi-telephone"></i> {selectedReservation.demandeur_telephone}</p>
                </div>
                <div className="detail-section">
                  <h4>Date et heure</h4>
                  <p>{formatDate(selectedReservation.date_debut)}</p>
                </div>
                <div className="detail-section">
                  <h4>Montant</h4>
                  <p className="price">{selectedReservation.montant.toLocaleString()} FCFA</p>
                </div>
                {selectedReservation.commentaire && (
                  <div className="detail-section">
                    <h4>Commentaire du client</h4>
                    <p className="comment">"{selectedReservation.commentaire}"</p>
                  </div>
                )}
                <div className="detail-section">
                  <h4>Statut actuel</h4>
                  <span className={`status-badge ${getStatutInfo(selectedReservation.statut).class}`}>
                    <i className={`bi ${getStatutInfo(selectedReservation.statut).icon}`}></i>
                    {getStatutInfo(selectedReservation.statut).label}
                  </span>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn-secondary" onClick={() => setShowModal(false)}>Fermer</button>
                {selectedReservation.statut === "en_attente" && (
                  <>
                    <button className="btn-primary" onClick={() => { handleUpdateStatut(selectedReservation.id, "confirmee"); setShowModal(false); }}>
                      <i className="bi bi-check-circle"></i> Confirmer
                    </button>
                    <button className="btn-danger" onClick={() => { handleUpdateStatut(selectedReservation.id, "annulee"); setShowModal(false); }}>
                      <i className="bi bi-x-circle"></i> Refuser
                    </button>
                  </>
                )}
                {selectedReservation.statut === "confirmee" && (
                  <button className="btn-primary" onClick={() => { handleUpdateStatut(selectedReservation.id, "terminee"); setShowModal(false); }}>
                    <i className="bi bi-check2-circle"></i> Marquer terminée
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .reservations-recues { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .stats-container { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
        .stat-card { background: white; border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); transition: transform 0.2s; }
        .stat-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon i { font-size: 1.5rem; }
        .stat-icon.blue { background: #eef2ff; color: #354dd4; }
        .stat-icon.orange { background: #fef3c7; color: #f59e0b; }
        .stat-icon.green { background: #dcfce7; color: #22c55e; }
        .stat-icon.purple { background: #f3e8ff; color: #a855f7; }
        .stat-icon.teal { background: #ccfbf1; color: #14b8a6; }
        .stat-info { flex: 1; }
        .stat-value { display: block; font-size: 1.25rem; font-weight: 700; color: #1e293b; }
        .stat-label { font-size: 0.7rem; color: #64748b; }
        .filters-container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
        .search-box { flex: 1; min-width: 250px; display: flex; align-items: center; background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.6rem 1rem; }
        .search-box:focus-within { border-color: #354dd4; box-shadow: 0 0 0 3px rgba(53, 77, 212, 0.1); }
        .search-box i { color: #94a3b8; margin-right: 0.5rem; }
        .search-box input { flex: 1; border: none; outline: none; font-size: 0.875rem; }
        .status-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .filter-btn { padding: 0.5rem 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 20px; cursor: pointer; font-size: 0.8rem; }
        .filter-btn:hover { border-color: #354dd4; color: #354dd4; }
        .filter-btn.active { background: #354dd4; color: white; border-color: #354dd4; }
        .reservations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 1.5rem; }
        .reservation-card { background: white; border-radius: 20px; overflow: hidden; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .reservation-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }
        .card-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; background: linear-gradient(135deg, #f8fafc, #fff); border-bottom: 1px solid #e2e8f0; }
        .service-badge { display: flex; align-items: center; gap: 0.5rem; font-weight: 600; color: #1e293b; }
        .service-badge i { color: #354dd4; font-size: 1.1rem; }
        .status-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.7rem; font-weight: 500; }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-confirmed { background: #dcfce7; color: #22c55e; }
        .status-completed { background: #eef2ff; color: #354dd4; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .card-body { padding: 1.5rem; }
        .client-info { display: flex; gap: 1rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; }
        .client-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, #eef2ff, #e0e7ff); border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .client-avatar i { font-size: 1.5rem; color: #354dd4; }
        .client-details { flex: 1; }
        .client-details h4 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
        .client-contact { display: flex; gap: 1rem; flex-wrap: wrap; }
        .client-contact a { font-size: 0.7rem; color: #64748b; text-decoration: none; display: flex; align-items: center; gap: 0.25rem; }
        .client-contact a:hover { color: #354dd4; }
        .reservation-details { margin-bottom: 1rem; }
        .detail-item { display: flex; align-items: flex-start; gap: 0.75rem; margin-bottom: 0.75rem; }
        .detail-item i { font-size: 1rem; color: #354dd4; margin-top: 0.125rem; }
        .detail-item div { flex: 1; }
        .detail-label { display: block; font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; }
        .detail-value { display: block; font-size: 0.85rem; font-weight: 500; color: #1e293b; }
        .detail-value.price { color: #354dd4; font-weight: 700; }
        .comment-section { background: #f8fafc; border-radius: 12px; padding: 0.75rem; margin-top: 0.5rem; display: flex; gap: 0.5rem; }
        .comment-section i { color: #94a3b8; font-size: 0.9rem; }
        .comment-section p { flex: 1; font-size: 0.8rem; color: #475569; font-style: italic; margin: 0; }
        .card-footer { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
        .btn-confirm, .btn-reject, .btn-complete, .btn-details { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.75rem; font-weight: 500; cursor: pointer; border: none; }
        .btn-confirm { background: #22c55e; color: white; }
        .btn-confirm:hover { background: #16a34a; transform: translateY(-1px); }
        .btn-reject { background: #ef4444; color: white; }
        .btn-reject:hover { background: #dc2626; transform: translateY(-1px); }
        .btn-complete { background: #8b5cf6; color: white; }
        .btn-complete:hover { background: #7c3aed; transform: translateY(-1px); }
        .btn-details { background: #f1f5f9; color: #64748b; }
        .btn-details:hover { background: #e2e8f0; color: #1e293b; }
        .empty-state { text-align: center; padding: 4rem; background: white; border-radius: 20px; }
        .empty-state i { font-size: 4rem; color: #cbd5e1; margin-bottom: 1rem; }
        .empty-state h3 { font-size: 1.125rem; margin-bottom: 0.5rem; }
        .loading-container { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; }
        .spinner { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: #354dd4; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 1rem; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: white; border-radius: 24px; max-width: 550px; width: 90%; max-height: 90vh; overflow-y: auto; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .modal-header h3 { display: flex; align-items: center; gap: 0.5rem; }
        .modal-close { background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94a3b8; }
        .modal-close:hover { color: #ef4444; }
        .modal-body { padding: 1.5rem; }
        .detail-section { margin-bottom: 1.25rem; padding-bottom: 1rem; border-bottom: 1px solid #e2e8f0; }
        .detail-section:last-child { border-bottom: none; }
        .detail-section h4 { font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; }
        .detail-section p { font-size: 0.9rem; color: #1e293b; margin: 0.25rem 0; }
        .detail-section .comment { background: #f8fafc; padding: 0.75rem; border-radius: 12px; font-style: italic; }
        .modal-footer { display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; background: #f8fafc; }
        .btn-secondary { padding: 0.5rem 1rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; font-size: 0.8rem; }
        .btn-primary { padding: 0.5rem 1rem; background: #354dd4; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.8rem; }
        .btn-danger { padding: 0.5rem 1rem; background: #ef4444; color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 0.8rem; }
        @media (max-width: 768px) { .reservations-grid { grid-template-columns: 1fr; } .stats-container { grid-template-columns: repeat(2, 1fr); } .filters-container { flex-direction: column; } .search-box { width: 100%; } .status-filters { justify-content: center; } .card-footer { flex-direction: column; } .btn-confirm, .btn-reject, .btn-complete, .btn-details { width: 100%; justify-content: center; } }
        @media (max-width: 480px) { .stats-container { grid-template-columns: 1fr; } .client-info { flex-direction: column; text-align: center; } .client-avatar { margin: 0 auto; } .client-contact { justify-content: center; } }
      `}</style>
    </DashboardLayout>
  );
};

export default ReservationsRecues;