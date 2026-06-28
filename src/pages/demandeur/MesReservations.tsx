// src/pages/demandeur/MesReservations.tsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DemandeurSidebar from "../../components/dashboard/DemandeurSidebar";
import "../../styles/dashboard.css";

interface Reservation {
  id: number;
  service_id: number;
  service_nom: string;
  prestataire_id: number;
  prestataire_nom: string;
  prestataire_prenom: string;
  date_debut: string;
  statut: "en_attente" | "confirmee" | "terminee" | "annulee";
  commentaire: string | null;
  montant: number;
  created_at: string;
}

const MesReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatut, setSelectedStatut] = useState<string>("tous");
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState<Reservation | null>(null);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    const stored = localStorage.getItem("reservations");
    if (stored) {
      setReservations(JSON.parse(stored));
    } else {
      const defaults: Reservation[] = [
        { id: 1, service_id: 1, service_nom: "Plomberie Express", prestataire_id: 2, prestataire_nom: "Tech", prestataire_prenom: "Alpha", date_debut: "2024-06-20T10:00:00", statut: "confirmee", commentaire: "Première intervention", montant: 25000, created_at: "2024-06-15T08:00:00" },
        { id: 2, service_id: 2, service_nom: "Dépannage Électrique", prestataire_id: 2, prestataire_nom: "Tech", prestataire_prenom: "Alpha", date_debut: "2024-06-18T14:00:00", statut: "terminee", commentaire: "Très satisfait", montant: 30000, created_at: "2024-06-16T09:00:00" },
        { id: 3, service_id: 5, service_nom: "Coiffure à Domicile", prestataire_id: 5, prestataire_nom: "Beauty", prestataire_prenom: "Studio", date_debut: "2024-06-25T09:00:00", statut: "en_attente", commentaire: null, montant: 20000, created_at: "2024-06-17T10:00:00" },
      ];
      setReservations(defaults);
      localStorage.setItem("reservations", JSON.stringify(defaults));
    }
    setLoading(false);
  };

  const handleCancel = () => {
    if (!reservationToCancel) return;
    const updated = reservations.map(r => r.id === reservationToCancel.id ? { ...r, statut: "annulee" as const } : r);
    setReservations(updated);
    localStorage.setItem("reservations", JSON.stringify(updated));
    setShowCancelModal(false);
    setReservationToCancel(null);
  };

  const getStatutInfo = (statut: string) => {
    switch (statut) {
      case "confirmee": return { label: "Confirmée", class: "status-confirmed", icon: "bi-check-circle-fill" };
      case "terminee": return { label: "Terminée", class: "status-completed", icon: "bi-check2-circle" };
      case "annulee": return { label: "Annulée", class: "status-cancelled", icon: "bi-x-circle-fill" };
      default: return { label: "En attente", class: "status-pending", icon: "bi-clock-fill" };
    }
  };

  const formatDate = (date: string) => new Date(date).toLocaleString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });

  const filtered = reservations.filter(r => selectedStatut === "tous" || r.statut === selectedStatut);
  const stats = { total: reservations.length, pending: reservations.filter(r => r.statut === "en_attente").length, confirmed: reservations.filter(r => r.statut === "confirmee").length, completed: reservations.filter(r => r.statut === "terminee").length };

  if (loading) return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="loading-container"><div className="spinner"></div><p>Chargement...</p></div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout sidebar={<DemandeurSidebar />}>
      <div className="mes-reservations">
        <div className="page-header">
          <h1><i className="bi bi-calendar-check"></i> Mes réservations</h1>
          <p>Suivez l'état de vos demandes</p>
        </div>

        {/* Stats Cards */}
        <div className="stats-row">
          <div className="stat-card"><div className="stat-icon blue"><i className="bi bi-calendar"></i></div><div><div className="stat-number">{stats.total}</div><div className="stat-label">Total</div></div></div>
          <div className="stat-card"><div className="stat-icon orange"><i className="bi bi-clock"></i></div><div><div className="stat-number">{stats.pending}</div><div className="stat-label">En attente</div></div></div>
          <div className="stat-card"><div className="stat-icon green"><i className="bi bi-check-circle"></i></div><div><div className="stat-number">{stats.confirmed}</div><div className="stat-label">Confirmées</div></div></div>
          <div className="stat-card"><div className="stat-icon purple"><i className="bi bi-check2-circle"></i></div><div><div className="stat-number">{stats.completed}</div><div className="stat-label">Terminées</div></div></div>
        </div>

        {/* Filters */}
        <div className="filter-bar">
          <div className="filter-buttons">
            <button className={`filter-chip ${selectedStatut === "tous" ? "active" : ""}`} onClick={() => setSelectedStatut("tous")}>Tous ({stats.total})</button>
            <button className={`filter-chip ${selectedStatut === "en_attente" ? "active" : ""}`} onClick={() => setSelectedStatut("en_attente")}>En attente ({stats.pending})</button>
            <button className={`filter-chip ${selectedStatut === "confirmee" ? "active" : ""}`} onClick={() => setSelectedStatut("confirmee")}>Confirmées ({stats.confirmed})</button>
            <button className={`filter-chip ${selectedStatut === "terminee" ? "active" : ""}`} onClick={() => setSelectedStatut("terminee")}>Terminées ({stats.completed})</button>
          </div>
          <Link to="/demandeur/reservation/nouvelle" className="new-booking-btn"><i className="bi bi-plus-lg"></i> Nouvelle réservation</Link>
        </div>

        {/* Reservations Cards */}
        {filtered.length === 0 ? (
          <div className="empty-state"><i className="bi bi-calendar-x"></i><h3>Aucune réservation</h3><Link to="/services">Explorer les services</Link></div>
        ) : (
          <div className="cards-grid">
            {filtered.map(res => {
              const status = getStatutInfo(res.statut);
              return (
                <div key={res.id} className="reservation-card">
                  <div className="card-header">
                    <div className="service-icon"><i className="bi bi-tools"></i></div>
                    <div className="service-title">{res.service_nom}</div>
                    <div className={`status-badge ${status.class}`}><i className={`bi ${status.icon}`}></i> {status.label}</div>
                  </div>
                  <div className="card-body">
                    <div className="info-row"><i className="bi bi-person"></i> <span>{res.prestataire_prenom} {res.prestataire_nom}</span></div>
                    <div className="info-row"><i className="bi bi-calendar-event"></i> <span>{formatDate(res.date_debut)}</span></div>
                    <div className="info-row"><i className="bi bi-currency-dollar"></i> <span className="price">{res.montant.toLocaleString()} FCFA</span></div>
                    {res.commentaire && <div className="comment-bubble"><i className="bi bi-chat"></i> {res.commentaire}</div>}
                  </div>
                  <div className="card-footer">
                    <Link to={`/services/${res.service_id}`} className="btn-outline"><i className="bi bi-eye"></i> Voir le service</Link>
                    {res.statut === "en_attente" && (
                      <button className="btn-cancel" onClick={() => { setReservationToCancel(res); setShowCancelModal(true); }}><i className="bi bi-x-circle"></i> Annuler</button>
                    )}
                    {res.statut === "terminee" && (
                      <Link to={`/demandeur/avis?service=${res.service_id}`} className="btn-review"><i className="bi bi-star"></i> Donner un avis</Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancel Modal */}
        {showCancelModal && reservationToCancel && (
          <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
            <div className="modal-container" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>Annuler la réservation</h3><button className="close-btn" onClick={() => setShowCancelModal(false)}>×</button></div>
              <div className="modal-body"><p>Annuler <strong>{reservationToCancel.service_nom}</strong> du {new Date(reservationToCancel.date_debut).toLocaleDateString()} ?</p><p className="warning">Cette action est irréversible.</p></div>
              <div className="modal-footer"><button className="btn-secondary" onClick={() => setShowCancelModal(false)}>Retour</button><button className="btn-danger" onClick={handleCancel}>Confirmer l'annulation</button></div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .mes-reservations { animation: fadeIn 0.3s ease; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
        .stat-card { background: white; border-radius: 16px; padding: 1rem; display: flex; align-items: center; gap: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon.blue { background: #eef2ff; color: #354dd4; }
        .stat-icon.orange { background: #fef3c7; color: #f59e0b; }
        .stat-icon.green { background: #dcfce7; color: #22c55e; }
        .stat-icon.purple { background: #f3e8ff; color: #a855f7; }
        .stat-icon i { font-size: 1.5rem; }
        .stat-number { font-size: 1.5rem; font-weight: 700; color: #1e293b; }
        .stat-label { font-size: 0.7rem; color: #64748b; }
        .filter-bar { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; margin-bottom: 1.5rem; }
        .filter-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .filter-chip { padding: 0.5rem 1rem; background: white; border: 1px solid #e2e8f0; border-radius: 20px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s; }
        .filter-chip:hover { border-color: #354dd4; color: #354dd4; }
        .filter-chip.active { background: #354dd4; color: white; border-color: #354dd4; }
        .new-booking-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem; background: #354dd4; color: white; border-radius: 10px; text-decoration: none; font-size: 0.8rem; }
        .cards-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 1.5rem; }
        .reservation-card { background: white; border-radius: 20px; overflow: hidden; transition: all 0.2s; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .reservation-card:hover { transform: translateY(-4px); box-shadow: 0 12px 24px -8px rgba(0,0,0,0.15); }
        .card-header { display: flex; align-items: center; gap: 1rem; padding: 1rem 1.5rem; background: linear-gradient(135deg, #f8fafc, #fff); border-bottom: 1px solid #e2e8f0; }
        .service-icon { width: 45px; height: 45px; background: #eef2ff; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .service-icon i { font-size: 1.25rem; color: #354dd4; }
        .service-title { flex: 1; font-weight: 600; font-size: 1rem; }
        .status-badge { display: inline-flex; align-items: center; gap: 0.3rem; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.7rem; font-weight: 500; }
        .status-pending { background: #fef3c7; color: #d97706; }
        .status-confirmed { background: #dcfce7; color: #22c55e; }
        .status-completed { background: #eef2ff; color: #354dd4; }
        .status-cancelled { background: #fee2e2; color: #dc2626; }
        .card-body { padding: 1.5rem; }
        .info-row { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem; font-size: 0.85rem; color: #475569; }
        .info-row i { width: 20px; color: #354dd4; }
        .price { font-weight: 700; color: #354dd4; }
        .comment-bubble { background: #f8fafc; border-radius: 12px; padding: 0.75rem; margin-top: 0.75rem; font-size: 0.8rem; color: #475569; display: flex; gap: 0.5rem; }
        .card-footer { display: flex; gap: 0.75rem; padding: 1rem 1.5rem; background: #f8fafc; border-top: 1px solid #e2e8f0; flex-wrap: wrap; }
        .btn-outline, .btn-cancel, .btn-review { padding: 0.5rem 1rem; border-radius: 10px; font-size: 0.75rem; text-decoration: none; display: inline-flex; align-items: center; gap: 0.3rem; cursor: pointer; transition: all 0.2s; border: none; }
        .btn-outline { background: white; color: #354dd4; border: 1px solid #e2e8f0; }
        .btn-outline:hover { border-color: #354dd4; background: #eef2ff; }
        .btn-cancel { background: #fee2e2; color: #dc2626; }
        .btn-cancel:hover { background: #fecaca; }
        .btn-review { background: #fef3c7; color: #d97706; }
        .btn-review:hover { background: #fde68a; }
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-container { background: white; border-radius: 20px; max-width: 450px; width: 90%; overflow: hidden; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; padding: 1rem 1.5rem; border-bottom: 1px solid #e2e8f0; }
        .close-btn { background: none; border: none; font-size: 1.5rem; cursor: pointer; }
        .modal-body { padding: 1.5rem; }
        .warning { color: #dc2626; font-size: 0.75rem; margin-top: 0.5rem; }
        .modal-footer { display: flex; gap: 1rem; justify-content: flex-end; padding: 1rem 1.5rem; border-top: 1px solid #e2e8f0; }
        .btn-secondary { padding: 0.5rem 1rem; background: #f1f5f9; border: none; border-radius: 8px; cursor: pointer; }
        .btn-danger { padding: 0.5rem 1rem; background: #dc2626; color: white; border: none; border-radius: 8px; cursor: pointer; }
        @media (max-width: 768px) { .stats-row { grid-template-columns: repeat(2, 1fr); } .cards-grid { grid-template-columns: 1fr; } .filter-bar { flex-direction: column; align-items: stretch; } .filter-buttons { justify-content: center; } }
      `}</style>
    </DashboardLayout>
  );
};

export default MesReservations;